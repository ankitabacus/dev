import { Component } from '@angular/core';
import { IonicPage, NavController,Loading, LoadingController, NavParams,App } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
/**
 * Generated class for the DealerWalletListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-wallet-list',
  templateUrl: 'dealer-wallet-list.html',
})
export class DealerWalletListPage {
  filter:any={};
  coupon_list:any=[];
  loading:Loading;
  dealer_point: any={};


  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController,public service:DbserviceProvider,public constant:ConstantProvider, public navParams: NavParams,private app:App) {
  }

 
  ionViewDidLoad() {
    this.filter.active_tab = 'points';

    console.log('ionViewDidLoad dealerWalletListPage');
    if(this.service.connection!='offline')
    {
    this.getCoupanHistory();
    this.presentLoading();
    console.log(this.loading);
    }
    
  }

  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getCoupanHistory(); 
    refresher.complete();
  }

 
  getCoupanHistory()
  {
    console.log('coupan');
    this.filter.limit=0;
    console.log( this.loading);

    this.service.post_rqst( {'filter':this.filter,'dealer_id':this.constant.UserLoggedInData.id},'app_karigar/dealercouponHistory').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        console.log( this.loading);

        this.coupon_list=r['coupon'];
        this.dealer_point=r['dealer'];
      });
    }
    conInt(val)
    {
      return parseInt(val)
    }
     
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true,
        enableBackdropDismiss : true
      });
      this.loading.present();
    }

    flag:any='';
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.coupon_list.length;
      this.service.post_rqst( {'filter':this.filter,'dealer_id': this.constant.UserLoggedInData.id},'app_karigar/dealercouponHistory').subscribe( r =>
        {
          console.log(r);
          if(r['coupon'] == '')
          { this.flag=1;}
          else
          {
            setTimeout(()=>{
              this.coupon_list=this.coupon_list.concat(r['coupon']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
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
          if((activeView == 'DealerHomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'DealerHomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
          {
            
            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }
    }

    balance_point:any=0;
    transaction_detail:any=[];
    getTransactionDetail()
    {
        this.filter.limit=0;
        this.service.post_rqst({'dealer_id':this.constant.UserLoggedInData.id,'filter':this.filter},'app_karigar/transaction')
        .subscribe((r)=>
        {
            console.log(r);
            if(r)
            {
                this.loading.dismiss();
                this.transaction_detail=r['transaction']
                this.balance_point=r['dealer'].balance_point;
            }
        });
    }
    change_tab(tab)
    {
        this.filter.active_tab = tab;
        if(this.filter.active_tab == "points")
        {
            this.getCoupanHistory();
        }
        
        if(this.filter.active_tab == "redeem")
        {
            this.getTransactionDetail();
        }
    }
   
}
