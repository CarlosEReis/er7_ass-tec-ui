import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { PoModule } from '@po-ui/ng-components';


@NgModule({
  declarations: [
    CoreComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,

    PoModule
  ]
})
export class CoreModule { }
