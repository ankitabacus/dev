import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOfferListPage } from './dealer-offer-list';

@NgModule({
  declarations: [
    DealerOfferListPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOfferListPage),
  ],
})
export class DealerOfferListPageModule {}
