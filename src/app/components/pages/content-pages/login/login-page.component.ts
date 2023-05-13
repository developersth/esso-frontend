import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import * as swalFunctions from '../../../../shared/services/sweetalert.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {
  errorMessage: string;
  loginFormSubmitted = false;
  swal = swalFunctions;

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
    rememberMe: new UntypedFormControl(true)
  });


  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) { }

 ngOnInit() {
  if (this.authService.isLoggedIn()) {
    this.router.navigate(['dashboard']);
  }
 }
  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (res: any) => {
        this.spinner.hide();
        if(res.user.isActive){
          this.swal.showDialog("success","เข้าสู่ระบบสำเร็จแล้ว");
          this.router.navigate(['/dashboard']);
        }
        else{
          this.swal.showDialog("warning","ชื่อผู้ใช้งานนี้ถูกหยุดใช้งาน");
        }
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        console.log('error: ' + error)
        if (error.status === 401) {
          this.swal.showDialog("warning","ชื่อผู้ใช้งานและรหัสผ่านไม่ถูกต้อง");
        } else {
          this.swal.showDialog("warning",error.message);
        }
      }
    );
  }
}
