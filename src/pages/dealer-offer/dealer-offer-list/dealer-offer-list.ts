import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController,Loading, NavParams, App } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import {OffersPage } from '../../offers/offers';
import { DealerOfferDetailPage } from '../dealer-offer-detail/dealer-offer-detail';
/**
* Generated class for the DealerOfferListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-dealer-offer-list',
  templateUrl: 'dealer-offer-list.html',
})
export class DealerOfferListPage {
  offer_list: any={};
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: DbserviceProvider,public constant:ConstantProvider, public loadingCtrl:LoadingController,private app:App) {}
  
  getofferList()  {
    this.service.post_rqst({'dealer_id':this.constant.UserLoggedInData.id},'app_karigar/dealerofferList').subscribe(r=>
      {
        console.log(r);
        this.loading.dismiss();
        this.offer_list=r['offer'];
        console.log(this.offer_list[0].id);

      });
    }
    
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: false
      });
      this.loading.present();
    }
    doRefresh(refresher) 
    {
      console.log('Begin async operation', refresher);
      this.getofferList(); 
      refresher.complete();
    }

    
    ionViewDidLoad() {
      console.log('ionViewDidLoad OfferListPage');
      if(this.service.connection!='offline')
      {
        this.getofferList();
        this.presentLoading();
      }
      
    }
    ionViewDidLeave()
    {
      if(this.service.connection!='offline')
      {
        let nav = this.app.getActiveNav();
        if(nav && nav.getActive()) 
        {
          let activeView = nav.getActive().name;
          let previuosView = '';
          if(nav.getPrevious() && nav.getPrevious().name)
          {
            previuosView = nav.getPrevious().name;
          }  
          console.log(previuosView); 
          console.log(activeView);  
          console.log('its leaving');
          if((activeView == 'DealerHomePage' || activeView == 'dealerGiftdetailPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'DealerHomePage' && previuosView != 'DealerGifDetailPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
          {
            
            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }
    }

 

    goOnOffersPage()
    {
      this.getofferList();
      var n = this.offer_list[0].id;
      var num = n.toString() 
      this.navCtrl.push(DealerOfferDetailPage, {'id': num});
    }
  
  }
  