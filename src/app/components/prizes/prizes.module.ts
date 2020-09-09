import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrizesComponent } from './prizes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrizesRoutes } from './prizes.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [PrizesComponent];
@NgModule({
  declarations: [PrizesComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PrizesRoutes, SharedModule]
})
export class PrizesModule {}
