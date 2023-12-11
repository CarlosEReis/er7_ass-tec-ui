import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutosPesquisaComponent } from './produtos-pesquisa/produtos-pesquisa.component';
import { PoModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProdutoFormComponent } from './produto-form/produto-form.component';


@NgModule({
  declarations: [
    ProdutosPesquisaComponent,
    ProdutoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProdutosRoutingModule,

    PoModule
  ]
})
export class ProdutosModule { }
