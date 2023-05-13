import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

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
import { SealOut } from "../../../models/seal.model";
import { forEach } from "core-js/core/array";
import { RecriptComponent } from "./recript/recript.component";
import { map } from "rxjs/operators";

let swal = swalFunctions;
@Component({
  selector: "app-sealoutlist",
  templateUrl: "./sealoutlist.component.html",
  styleUrls: [
    "./sealoutlist.component.scss",
    "../../../../assets/sass/libs/datepicker.scss",
  ],
  providers: [RestService],
})
export class SealOutListComponent implements OnInit {
  window: any;
  private mediaQueryList: MediaQueryList;
  constructor(
    private modalService: NgbModal,
    private service: RestService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.selectToday();
    this.getSeal();
    this.window = window;
    this.now = new Date();
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
  sealNo: string;
  sealItem: SealOut[] = [];
  filterItems: SealOut[] = [];
  now:Date = new Date();
  pageChanged(event: any): void {
    this.page = event.page;
  }
  searchItem() {
    this.page = 1; // รีเซ็ตหน้าเป็นหน้าที่ 1 เมื่อทำการกรองข้อมูล
    this.searchTerm = this.searchTerm.trim().toLowerCase();
    if (this.searchTerm === "") {
      // กรณีไม่มีคำค้นหา ให้แสดงข้อมูลทั้งหมด
      this.filterItems = this.sealItem;
    } else {
      // กรณีมีคำค้นหา ให้กรองข้อมูลตามคำค้นหา
      this.filterItems = this.sealItem.filter(
        (item) =>
          item.id.increment.toString().includes(this.searchTerm) ||
          item.truckLicense
            .toString()
            .toLowerCase()
            .includes(this.searchTerm) ||
          item.sealItem.some((seal) =>
            seal.sealNo?.toLowerCase().includes(this.searchTerm)
          ) ||
          item.sealItem.some((seal) =>
            seal.pack?.toString().includes(this.searchTerm)
          ) ||
          item.sealItem.some((seal) =>
            seal.type?.toLowerCase().includes(this.searchTerm)
          )
        // item.sealItem.pack.toString().includes(this.searchTerm.toLowerCase()) ||
        // item.sealItem.type.toString().includes(this.searchTerm.toLowerCase())||
        // item.sealTotal.toString().includes(this.searchTerm.toLowerCase())||
        // item.sealTotalExtra.toString().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  clearTextSearch() {
    this.searchTerm = "";
    this.getSeal();
  }
  checkAllItems() {
    for (let item of this.sealItem) {
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
    let tomorrow:Date = this.now;
    tomorrow.setDate(tomorrow.getDate() + 1)
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
    let startDate = new Date(
      this.dtStart.year,
      this.dtStart.month - 1,
      this.dtStart.day
    );
    let endDate = new Date(
      this.dtEnd.year,
      this.dtEnd.month - 1,
      this.dtEnd.day
    );
    this.service.getSealOutAll(startDate, endDate).subscribe((res: any) => {
      this.sealItem = res;
      this.searchItem();
    });
  }

  deleteData(id: string) {
    console.log(id);
    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.service.deleteSealOut(id).subscribe(
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
  printSlip(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(RecriptComponent, ngbModalOptions);
    modalRef.componentInstance.id = item._id;
    modalRef.componentInstance.data = item;
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
