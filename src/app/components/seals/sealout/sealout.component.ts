import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { forEach } from "core-js/core/array";
import { RestService } from "../../../services/rest.service";
import { ToastrService } from "ngx-toastr";
import { th } from "date-fns/locale";
import { NgxSpinnerService } from "ngx-spinner";
import {ActivatedRoute, Router } from "@angular/router"
import {
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { RecriptComponent } from "../sealoutlist/recript/recript.component";
import { TruckModalComponent } from "app/components/trucks/truck-modal/truck-modal.component";
import * as swalFunctions from "../../../shared/services/sweetalert.service";
import { NgOption } from "@ng-select/ng-select";

@Component({
  selector: "app-sealout",
  templateUrl: "./sealout.component.html",
  styleUrls: [
    "./sealout.component.scss",
    "../../../../assets/sass/libs/select.scss",
  ],
  providers: [RestService],
  encapsulation: ViewEncapsulation.None,
})
export class SealoutComponent implements OnInit {
  getId:string;
  ngSelect: any;
  constructor(
    private router: Router,
    private service: RestService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute
  ) {
    this.getId = this.activateRoute.snapshot.paramMap.get('id')
  }
  swal = swalFunctions;
  keyword = "name";
  @Input() txtSealTotal: string = "0";
  @Input() txtSealExtraTotal: string = "0";
  @Input() txtTruckNo: string;
  @Input() sealNoExt: any[] = [];
  @Input() sealItemExtra: any[] = [];
  selectedOptionsQRCode: any[] = [];
  itemSealNo: any[] = [];
  itemSealOutList: any[] = [];
  trucks: any[] = [];
  //seal no item
  sealNoItem:any[] = [];
  cities = [
    { id: 1, name: "Vilnius" },
    { id: 2, name: "Kaunas" },
    { id: 3, name: "Pavilnys", disabled: true },
    { id: 4, name: "Pabradė" },
    { id: 5, name: "Klaipėda" },
  ];

  clearSelectionQRCode() {
    this.selectedOptionsQRCode = [];
  }
  getSealNo() {
    this.service.getSealNoQRCode().subscribe((res: any) => {
      this.itemSealNo = res;
    });
  }
  getTrucks() {
    this.service.getTrucks().subscribe(
      (trucks) => {
        this.trucks = trucks;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  isValidChkAddItemSeal(id, pack) {
    const result = this.itemSealOutList.find((item) => item.id === id);
    if (result) {
      this.toastr.warning("มีหมายเลขซีลนี้ในตารางแล้ว");
      return false;
    }
    //check seal > total seal
    if (pack + this.subTotalSeal() > this.txtSealTotal) {
      this.toastr.warning("จำนวนซีลรวม มากกว่าซีลที่ต้องการ");
      return false;
    }
    return true;
  }
  genSealExtra(txt: number) {
    this.sealNoExt = [];
    if (this.txtSealExtraTotal) {
      let vCount: number = parseInt(this.txtSealExtraTotal);
      for (let index = 0; index < vCount; index++) {
        this.sealNoExt.push({
          id: this.generator(),
          sealNo:"",
        });
      }
    }
  }
  selectTruckSeal(){
    if(this.txtTruckNo){
      const found = this.trucks.find(element => element._id === this.txtTruckNo);
      if(found){
        this.txtSealTotal = found.fixSeal;
      }
    }
  }
  delSealExtra(index) {
    if (this.sealNoExt.length > 1) {
      this.sealNoExt.splice(index, 1);
    }
  }

  selectEvent() {
    let id = this.selectedOptionsQRCode;
    this.clearSelectionQRCode();
    if (!this.txtSealTotal || parseInt(this.txtSealTotal) <= 0) {
      this.toastr.warning("กรุณาระบุ จำนวนซีล");
      return;
    }
    if (this.selectedOptionsQRCode) {
      const result = this.itemSealNo.find((item) => item._id === id);
      console.log(result);
      if (!this.isValidChkAddItemSeal(id, result.pack)) {
        return;
      }
      this.itemSealOutList.push({
        id: result._id,
        sealBetween:result.sealBetween,
        sealNoItem: result.sealNoItem,
        pack: result.pack,
        type: "ปกติ",
      });
    } else {
      this.toastr.warning("กรุณาเลือก หมายเลขซีล/QR Code");
    }
    // do something with selected item
  }
  removeItem(item: any) {
    let index = this.itemSealOutList.indexOf(item);
    this.itemSealOutList.splice(index, 1);
  }

  onChangeSearch(val: string) {
    console.log(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    console.log("focused", e.value);
    // do something when input is focused
  }
  onKeyDownQrcode(txt:string){
    console.log(txt);

  }
  subTotalSeal() {
    let total: number = 0;
    for (const key in this.itemSealOutList) {
      if (this.itemSealOutList[key].pack)
        total += parseInt(this.itemSealOutList[key].pack);
    }
    return total;
  }
  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;

    return isString;
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  editSealNo(item:any){
    if(item){
      this.sealNoItem =[];
      item.forEach(element => {
        this.sealNoItem.push({sealNo:element.sealNo})
      });
    }
  }
  clearSealNoItem(){
    this.sealNoItem =[];
  }
  validateData() {
    //check จำนวนซีล
    if (!this.txtSealTotal || this.txtSealTotal === "0") {
      this.toastr.warning("กรุณากรอก จำนวนซีล");
      return false;
    }
    //check ซีลพิเศษ
    if (parseInt(this.txtSealExtraTotal) > 0) {
      const result = this.sealNoExt.find((item) => item.sealNo === "");
      if (result) {
        this.toastr.warning("กรุณากรอก หมายเลขซีลพิเศษ");
        return false;
      }
    }
    //check ทะเบียรถ
    if (!this.txtTruckNo) {
      this.toastr.warning("กรุณาเลือก ทะเบียนรถ");
      return false;
    }
    //check item SealQrcode
    if (this.itemSealOutList.length === 0) {
      this.toastr.warning("กรุณาเลือก หมายเลขซีล/QR Code");
      return false;
    }
    //check count seal==txtSealTotal
    if (this.subTotalSeal() !== parseInt(this.txtSealTotal)) {
      this.toastr.warning("จำนวนซีลไม่เท่ากับจำนวนซีลรวม");
      return false;
    }
    //check sealExtra ซ้ำ
    if (this.sealNoExt.length>1) {
      let valueArr = this.sealNoExt.map(function (item) { return item.sealNo });
      let isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.toastr.warning("หมายเลขซีลพิเศษซ้ำกัน");
        return false;
      }
    }
    return true;
  }
  addTruck() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(
      TruckModalComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = ""; // should be the id
    modalRef.componentInstance.data = {
      truckIdHead: "",
      TruckIdTail: "",
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
  bindData(){
    if(this.getId){
      this.service.getSealOutById(this.getId).subscribe((response: any) => {
        console.log(response);
        this.txtSealTotal =response.sealTotal;
        this.txtSealExtraTotal =response.sealTotalExtra;
        this.txtTruckNo = response.truckId;
        this.itemSealOutList =response.sealItem;
        this.sealNoExt = [];
        if(response.sealItemExtra){
          response.sealItemExtra.forEach(el => {
            this.sealNoExt.push({
              id:el.id,
              sealNo:el.sealNoItem[0].sealNo
            })
          });
        }
      });
    }
  }
  onSubmit(){
    //แปลงซีลพิเศษในรูป
    if (this.sealNoExt) {
      this.sealNoExt.forEach(el => {
        this.sealItemExtra.push({
          id:this.generator(),
          sealBetween:el.sealNo,
          sealNoItem: [{sealNo:el.sealNo,isUsed:true}],
          pack: 1,
          type: "พิเศษ",
      })
      });
    }
    if(this.getId){
      this.editData();
    }else{
      this.addData();
    }
  }
  editData(){
    //validation before save
    if (!this.validateData()) return;

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    const result = this.trucks.find((item) => item._id === this.txtTruckNo);
    const body = {
      sealTotal: this.txtSealTotal,
      sealTotalExtra: this.txtSealExtraTotal,
      truckId: result._id,
      truckLicense: `${result.truckIdHead}/${result.truckIdTail}`,
      sealItem: this.itemSealOutList,
      sealItemExtra: this.sealItemExtra,
    };
    this.service.updateSealOut(this.getId,JSON.stringify(body)).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.swal.showDialog("success", "แก้ไขข้อมูลสำเร็จแล้ว");
        this.showRecript(res);
        this.router.navigate(['/seals/sealoutlist']);
      },
      (error: any) => {
        this.spinner.hide();
        this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
      }
    );
  }
  addData() {
    //validation before save
    if (!this.validateData()) return;

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    const result = this.trucks.find((item) => item._id === this.txtTruckNo);
    const body = {
      sealTotal: this.txtSealTotal,
      sealTotalExtra: this.txtSealExtraTotal,
      truckId: result._id,
      truckLicense: `${result.truckIdHead}/${result.truckIdTail}`,
      sealItem: this.itemSealOutList,
      sealItemExtra: this.sealItemExtra,
    };
    this.service.addSealOut(JSON.stringify(body)).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
        this.showRecript(res);
        this.router.navigate(['/seals/sealoutlist']);
      },
      (error: any) => {
        this.spinner.hide();
        this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
      }
    );
  }
  showRecript(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(RecriptComponent, ngbModalOptions);
    modalRef.componentInstance.id = item._id;
    modalRef.componentInstance.data = item;
  }
  ngOnInit(): void {
    this.getSealNo();
    this.getTrucks();
    this.bindData();
  }
}
