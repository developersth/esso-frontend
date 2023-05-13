import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormControl } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TruckModalComponent } from './truck-modal/truck-modal.component';
import { TruckListComponent } from './truck-list/truck-list.component';
import { TruckRouteModule } from './truck-routing.module';
@NgModule({
  declarations: [
    TruckModalComponent,
    TruckListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    PipeModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    DatePipe,
    NgSelectModule,
    TruckRouteModule,
    NgxPaginationModule,

  ]
})
export class TruckModule { }
