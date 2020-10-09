import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerWalletListPage } from './dealer-wallet-list';

@NgModule({
  declarations: [
    DealerWalletListPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerWalletListPage),
  ],
})
export class DealerWalletListPageModule {}
