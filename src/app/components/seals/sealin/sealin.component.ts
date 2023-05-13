import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  DoCheck,
} from "@angular/core";
import { CrudModalComponent } from "./crud-modal/crud-modal.component";

import {
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { RestService } from "../../../services/rest.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as swalFunctions from "../../../shared/services/sweetalert.service";
import { th } from "date-fns/locale";
import { Seal } from "../../../models/seal.model";
import { forEach } from "core-js/core/array";

let swal = swalFunctions;
@Component({
  selector: "app-sealin",
  templateUrl: "./sealin.component.html",
  styleUrls: [
    "./sealin.component.scss",
    "../../../../assets/sass/libs/datepicker.scss",
  ],
  providers: [RestService],
})
export class SealinComponent implements OnInit {
  window: any;
  private mediaQueryList: MediaQueryList;
  constructor(
    private modalService: NgbModal,
    private service: RestService,
    private spinner: NgxSpinnerService
  ) {
    this.mediaQueryList = window.matchMedia("print");
    this.mediaQueryList.addListener(this.handleMediaQueryChange);
  }

  displayMonths = 2;
  dtStart: NgbDateStruct;
  dtEnd: NgbDateStruct;
  page = 1;
  pageSize = 10;
  pageSizes = [10, 20, 50, 100];
  currentPage = 1;
  searchTerm: string = "";
  closeResult: string;
  checkedAll: boolean = false;
  sealBetween: string;
  sealInItem: Seal[] = [];
  filterItems: Seal[] = [];
  enableBtnDelete: boolean = false;
  now: Date = new Date();
  columnSearch = "";
  isActive:string = "";
  sealItem: any[] = [];
  sealInId:string = "0";
  ngOnDestroy() {
    this.mediaQueryList.removeListener(this.handleMediaQueryChange);
  }

  handleMediaQueryChange(mql: MediaQueryListEvent) {
    if (mql.matches) {
      console.log("Print dialog is open");
    } else {
      console.log("Print dialog is closed");
    }
  }
  ngOnInit(): void {
    this.selectToday();
    this.getSeal();
    this.window = window;
    this.now = new Date();
  }

  pageChanged(event: any): void {
    this.page = event.page;
  }

  clearTextSearch() {
    this.searchTerm = "";
    this.columnSearch ="";
    this.isActive="";
    this.getSeal();
  }
  onItemChecked(item: any, isChecked: boolean) {
    // Do something with the checked item
    if (isChecked) {
      this.enableBtnDelete = true;
    } else {
      this.enableBtnDelete = false;
    }
    console.log(item.name + " was " + (isChecked ? "checked" : "unchecked"));
  }
  checkAllItems() {
    for (let item of this.sealInItem) {
      if (this.checkedAll) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  // Selects today's date
  selectToday() {
    this.dtStart = {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    };
    let tomorrow: Date = this.now;
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.dtEnd = {
      year: tomorrow.getFullYear(),
      month: tomorrow.getMonth() + 1,
      day: tomorrow.getDate(),
    };
  }

  // Custom Day View Starts
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  format(date: NgbDateStruct): string {
    return date
      ? date.year +
          "-" +
          ("0" + date.month).slice(-2) +
          "-" +
          ("0" + date.day).slice(-2)
      : null;
  }

  getSeal() {
    let startDate: string = `${this.dtStart.year}-${this.dtStart.month}-${this.dtStart.day}`;
    let endDate: string = `${this.dtEnd.year}-${this.dtEnd.month}-${this.dtEnd.day}`;
    this.service
      .getSeal(this.isActive,this.columnSearch, this.searchTerm, startDate, endDate)
      .subscribe((res: any) => {
        this.sealInItem = res.result;
      });
  }
  openModal(content: any,modalOptions:any) {
    this.modalService.open(content, modalOptions);
  }
  // Open default modal
  showQRCode(item: any, content: any) {
    this.sealBetween = item.sealBetween;
    this.modalService.open(content, { size: "sm" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  showSealItem(item: any, content: any){
    this.getSealItem(item.id);
    this.sealInId =item.id;
    const modalOptions: NgbModalOptions = {
      keyboard: false,
      centered: false,
      size: 'xl',
    };
    this.openModal(content,modalOptions);
  }
  getSealItem(id:string)
  {
    this.service
    .getSealItemBySealInId(id)
    .subscribe((res: any) => {
      this.sealItem = res.result;
    });
  }
  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  DeleteData(id: string) {
    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.service.deleteSeal(id).subscribe(
            (res: any) => {
              swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getSeal();
            },
            (error: any) => {
              swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  deleteAll() {
    const itemId = [];
    this.sealInItem.forEach((val) => {
      if (val.checked) {
        itemId.push(val.id);
      }
    });
    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.service.deleteSealAll(itemId).subscribe(
            (res: any) => {
              swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getSeal();
            },
            (error: any) => {
              swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  async printQRCode() {
    //  const printContents = document.getElementById("printDivQR").cloneNode(true);
    //  const iframe = document.createElement("iframe");
    //  iframe.setAttribute("style", "visibility:hidden; height:0; width:0; position:absolute;");
    //  document.body.appendChild(iframe);
    //  iframe.contentDocument.body.appendChild(printContents);
    //  iframe.contentWindow.print();
    //  document.body.removeChild(iframe);
    let printWindow: Window;
    let qrCodeElement = document.querySelector("qrcode");
    let canvasElement = qrCodeElement.querySelector("canvas");

    printWindow = window.open(null, "_blank", "width=600,height=450");
    let body = `<html><head><style>@media print{img{max-width:100%;height:auto;}}' +
    '</style></head><body><img src='${canvasElement.toDataURL()}'>  <h3>${
      this.sealBetween
    }<h3></body></html>`;

    printWindow.document.write(body);
    printWindow.document.close();
    this.sleep(500).then(() => {
      if (printWindow) {
        printWindow.print();
        printWindow.close();
      }
    });
    //await this.sleep(500);
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  addData() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "xl",
    };
    const modalRef = this.modalService.open(
      CrudModalComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = [];
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.service.addSeal(result).subscribe(
          (res: any) => {
            this.spinner.hide();
            swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
            this.getSeal();
          },
          (error: any) => {
            this.spinner.hide();
            swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
