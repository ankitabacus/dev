import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvertLeadPage } from './convert-lead';

@NgModule({
  declarations: [
    ConvertLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(ConvertLeadPage),
  ],
})
export class ConvertLeadPageModule {}
