import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, NavParams,App } from 'ionic-angular';
import { DealerGiftDetailPage } from '../dealer-gift-detail/dealer-gift-detail';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
/**
 * Generated class for the DealerOfferDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-offer-detail',
  templateUrl: 'dealer-offer-detail.html',
})
export class DealerOfferDetailPage {
  offer_id:any="";
  loading:Loading;
  offer_detail:any={};
  offer_balance:any={};
  gift_list:any=[];
  balance_point:any={};
  id:any="";
  
  

  constructor(public navCtrl: NavController, public loadingCtrl:LoadingController,public service:DbserviceProvider,public constant:ConstantProvider, public navParams: NavParams, private app:App,) {
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    this.presentLoading();
    this.offer_id=this.navParams.get('id');
    console.log(this.navParams.get('id'));
    this.getofferDetail(this.offer_id);
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
    this.getofferDetail(this.offer_id); 
    refresher.complete();
  }

  toInt(i){
    console.log(i);
    
    return parseInt(i);
  }
  
  goOnGiftDetail(id)
  {
    console.log(id);
    
    this.navCtrl.push(DealerGiftDetailPage,{'id':id});
  }


  gift1 = {};

  getofferDetail(offer_id)
  {
   console.log(offer_id);
   this.service.post_rqst({'dealer_id':this.constant.UserLoggedInData.id,'offer_id':offer_id},'app_karigar/dealerofferDetail').subscribe(r=>
    {
      console.log(r);
      this.gift_list=r.gift;

      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
      this.offer_detail=r['offer'];

      console.log(this.gift_list);

      this.gift1 = this.gift_list[0].image;

      // this.offer_balance=parseInt(r['gift'][0].offer_balance);
      
      // this.gift1 = {"gifts":this.gift_list};
      // console.log(this.gift1);
      
      // this.balance_point=parseInt(r['dealer'].balance_point);
      // for (let i = 0; i < this.gift_list.length; i++) 
      // {
      //   this.gift_list[i].coupon_points = parseInt( this.gift_list[i].coupon_points);
      // }

      // let Server = this.gift_list;
      
      // gift1 = this.gift_list;
      // let servers: any = JSON.parse(this.gift_list) as any;
      // let json = gift1.reduce((json, value, key) => { json[key] = value; return json; }, {});

      // let json2 = [];
      // json2.push(json);
      // this.gift_list= json2
    //   Object.keys(gift1).map(function(key){  
    //     gift_detail.push({[key]:gift1[key]})  
    //     return gift_detail;  
    // });
    });
    
  }

  // getgiftlist(){

  //   this.getofferDetail(this.offer_id);

  //   console.log(this.gift_list);
    

  // }

  


  ionViewDidLeave()
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
       if((activeView == 'DealerHomePage' || activeView == 'DealerGiftdetailPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'DealerHomePage' && previuosView != 'DealerGifdetailPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
       {
     
           console.log(previuosView);
           this.navCtrl.popToRoot();
       }
   }
  }

}
