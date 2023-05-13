import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  code:string ='883651-883656';
  public myAngularxQrCode: string = null;
  constructor() {
    this.myAngularxQrCode = 'tutsmake.com';
   }

  ngOnInit(): void {
  }

}
