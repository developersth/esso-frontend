import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SealinComponent } from './sealin/sealin.component';
import { SealoutComponent } from './sealout/sealout.component';
import { SealOutListComponent } from './sealoutlist/sealoutlist.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sealin',
        component: SealinComponent,
        data: {
          title: 'รายการซีลเข้าระบบ'
        }
      },
      {
        path: 'sealout',
        component: SealoutComponent,
        data: {
          title: 'การจ่ายซีล'
        }
      },
      {
        path: 'sealout/:id',
        component: SealoutComponent,
        data: {
          title: 'การจ่ายซีล'
        }
      },
      {
        path: 'sealoutlist',
        component: SealOutListComponent,
        data: {
          title: 'รายการจ่ายซีล'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SealsRouteModule { }
