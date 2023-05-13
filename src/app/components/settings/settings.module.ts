import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { SettingsRouteModule } from './settings-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  declarations: [
    QrcodeComponent
  ],
  imports: [
    CommonModule,
    SettingsRouteModule,
    QRCodeModule
  ]
})
export class SettingsModule { }
