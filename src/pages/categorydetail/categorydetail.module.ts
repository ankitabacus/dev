import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorydetailPage } from './categorydetail';

@NgModule({
  declarations: [
    CategorydetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorydetailPage),
  ],
})
export class CategorydetailPageModule {}
