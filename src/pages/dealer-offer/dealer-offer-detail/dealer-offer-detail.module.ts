import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOfferDetailPage } from './dealer-offer-detail';

@NgModule({
  declarations: [
    DealerOfferDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOfferDetailPage),
  ],
})
export class DealerOfferDetailPageModule {}
