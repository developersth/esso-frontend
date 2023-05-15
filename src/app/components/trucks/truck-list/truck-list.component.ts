import { Component, OnInit } from "@angular/core";
import { Truck } from "../../../models/truck.model";
import { RestService } from "../../../services/rest.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { TruckModalComponent } from "../truck-modal/truck-modal.component";
import { Response } from "../../../models/response.model";
import * as swalFunctions from "../../../shared/services/sweetalert.service";

@Component({
  selector: "app-truck-list",
  templateUrl: "./truck-list.component.html",
  styleUrls: ["./truck-list.component.scss"],
  providers: [RestService],
})
export class TruckListComponent implements OnInit {
  truck: Truck[];
  swal = swalFunctions;
  pageSize:number =10;
  pageSizes = [10, 20, 50, 100];
  currentPage = 1;
  filterItems:Truck[] = [];
  searchTerm:string = "";
  constructor(
    private service: RestService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getTrucks();
  }
  searchItem() {
    this.currentPage = 1; // รีเซ็ตหน้าเป็นหน้าที่ 1 เมื่อทำการกรองข้อมูล
    this.searchTerm = this.searchTerm.trim().toLowerCase();
    if (this.searchTerm === "") {
      // กรณีไม่มีคำค้นหา ให้แสดงข้อมูลทั้งหมด
      this.filterItems = this.truck;
    } else {
      // กรณีมีคำค้นหา ให้กรองข้อมูลตามคำค้นหา
      this.filterItems = this.truck.filter(
        (item) =>
          item.truckId.toString().includes(this.searchTerm) ||
          item.truckHead
            .toString()
            .toLowerCase()
            .includes(this.searchTerm) ||
          item.truckTail
            .toString()
            .toLowerCase()
            .includes(this.searchTerm)
      );
    }
  }
  clearTextSearch() {
    this.searchTerm = "";
    this.getTrucks();
  }
  getTrucks() {
    this.service.getTruck().subscribe((res: any) => {
      this.truck = res.result;
      this.searchItem();
    });
  }
  deleteTruck(id: string) {
    console.log(id);
    this.swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.service.deleteTruck(id).subscribe(
            (res: any) => {
              this.swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getTrucks();
            },
            (error: any) => {
              this.swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  addData() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(TruckModalComponent, ngbModalOptions);
    modalRef.componentInstance.id = ''; // should be the id
    modalRef.componentInstance.data = {
      truckHead: "",
      truckTail: "",
      sealTotal:"0"
    }; // should be the data
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        console.log(result);
        this.service.addTruck(result).subscribe(
          (res: any) => {
            this.spinner.hide();
            if(res.success){
              this.swal.showDialog("success", res.message);
              this.getTrucks();
            }else{
              this.swal.showDialog("warning", "เกิดข้อผิดพลาด : " + res.message);
            }
          },
          (error: any) => {
            this.spinner.hide();
            this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  editData(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(TruckModalComponent, ngbModalOptions);
    modalRef.componentInstance.id = item.id; // should be the id
    modalRef.componentInstance.data = item;
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.service.updateTruck(item.id,result).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.swal.showDialog("success", "แก้ไขข้อมูลสำเร็จแล้ว");
            this.getTrucks();
          },
          (error: any) => {
            this.spinner.hide();
            this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
