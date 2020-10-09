import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerGiftDetailPage } from './dealer-gift-detail';

@NgModule({
  declarations: [
    DealerGiftDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerGiftDetailPage),
  ],
})
export class DealerGiftDetailPageModule {}
