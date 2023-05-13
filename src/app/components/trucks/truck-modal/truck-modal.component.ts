import { Component, Input, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Truck } from "../../../models/truck.model";
import { RestService } from "../../../services/rest.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { th } from "date-fns/locale";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-truck-modal",
  templateUrl: "./truck-modal.component.html",
  styleUrls: ["./truck-modal.component.scss"],
  providers: [RestService],
})
export class TruckModalComponent implements OnInit {
  truckForm: FormGroup;
  id: string = "";
  truck: Truck[];
  @Input() data: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: RestService,
    public toastr: ToastrService,
  ) {
    this.truckForm = this.formBuilder.group({
      truckIdHead: ["", Validators.required],
      truckIdTail: [""],
      fixSeal: ["0"]
    });
  }
  ngOnInit(): void {
    this.buildItemForm(this.data);
  }
  private buildItemForm(item) {
    this.truckForm = this.formBuilder.group({
      truckIdHead: [item.truckIdHead || "", Validators.required],
      truckIdTail: [item.truckIdTail||""],
      fixSeal: [item.fixSeal||""]
    });
  }
  getTrimmedValues(formGroup: FormGroup): any {
    const values = {};
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control.value && typeof control.value === 'string') {
        values[key] = control.value.trim();
      } else {
        values[key] = control.value;
      }
    });
    return values;
  }

  onSubmit() {
    console.log("dfdf");
    if(this.truckForm.value.truckIdHead===''){
      this.toastr.warning("กรุณาระบุทะเบียนหัว ด้วยครับ");
      return;
    }
    if(this.truckForm.value.truckIdHead===this.truckForm.value.truckIdTail){
      this.toastr.warning("หมายเลขทะเบียนหัวกับทะเบียนหางเหมือนกัน");
      return;
    }
    this.truckForm.value.truckIdHead = this.truckForm.value.truckIdHead.trim()
    this.truckForm.value.truckIdTail = this.truckForm.value.truckIdTail.trim()
    this.activeModal.close(this.truckForm.value);
  }
}
