import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormControl } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SealinComponent } from './sealin/sealin.component';
import { SealoutComponent } from './sealout/sealout.component';
import { SealsRouteModule } from './seals-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CrudModalComponent } from './sealin/crud-modal/crud-modal.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { QRCodeModule } from 'angularx-qrcode';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SealOutListComponent } from './sealoutlist/sealoutlist.component';
import { RecriptComponent } from './sealoutlist/recript/recript.component';
@NgModule({
  declarations: [
    SealinComponent,
    SealoutComponent,
    CrudModalComponent,
    SealOutListComponent,
    RecriptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SealsRouteModule,
    NgxDatatableModule,
    PipeModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    QRCodeModule,
    DatePipe,
    NgSelectModule,
  ]
})
export class SealsModule { }
