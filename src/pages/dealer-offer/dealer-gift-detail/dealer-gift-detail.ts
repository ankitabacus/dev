import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,ModalController,Loading, LoadingController } from 'ionic-angular';
import { CancelpolicyModalPage } from '../../cancelpolicy-modal/cancelpolicy-modal';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DealerOfferDetailPage } from '../dealer-offer-detail/dealer-offer-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
/**
 * Generated class for the DealerGiftDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-gift-detail',
  templateUrl: 'dealer-gift-detail.html',
})
export class DealerGiftDetailPage {
 gift_id:any={}; 
 gift_detail:any={};
 balance_point:any='';
	loading:Loading;
	star:any='';
	rating_star:any='';
	otp:'';
  offer_balance:any=''
  dealer_detail:any={};

  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController, public modalCtrl: ModalController,public service:DbserviceProvider,public constant:ConstantProvider,public navParams: NavParams,private app:App) {
  }

  ionViewDidLoad() {
		console.log('ionViewDidLoad GiftDetailPage');
		this.gift_id = this.navParams.get('id');
		this.getGiftDetail(this.gift_id)
		this.presentLoading();
  }
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange: false
  });
  this.loading.present();
  }


  presentCancelPolicyModal() {
		let contactModal = this.modalCtrl.create(CancelpolicyModalPage,{'dealer_id':this.constant.UserLoggedInData.id,'gift_id':this.gift_id});
		contactModal.present();
		console.log('otp');
  }

  goOndealerOfferDetailPage(offer_id)
	{
		this.navCtrl.push(DealerOfferDetailPage,{'id':offer_id})
  }


  getGiftDetail(gift_id)
	{
		console.log(gift_id);
		this.service.post_rqst({'gift_id' :gift_id,'dealer_id':this.constant.UserLoggedInData.id},'app_karigar/dealergiftDetail').subscribe( r =>
			{
				console.log(r);
				this.loading.dismiss();
				this.gift_detail=r['gift'];
				this.dealer_detail=r['dealer'];
				this.rating_star=parseInt(r['gift'].rating);
				console.log(this.gift_detail);
				this.offer_balance= parseInt(r['gift'].offer_balance );
				this.balance_point= parseInt(r['dealer'].balance_point );
				this.gift_detail.coupon_points = parseInt( this.gift_detail.coupon_points );
				// if(r['gift_star'])
				// {
				// 	this.star=parseInt(r['gift_star'].star);
				// 	console.log(this.star);
				// }
				
			});
    }
    rating(star)
		{
			this.presentLoading();
			console.log(star);
			this.service.post_rqst({'star':star,'gift_id' :this.gift_id,'karigar_id':this.constant.UserLoggedInData.id,'offer_id':this.gift_detail.offer_id},'app_karigar/giftRating').subscribe(r=>{
				console.log(r);
				if(r)
				{
					this.getGiftDetail(this.gift_id)
				}
			});
    }
    
    ionViewDidLeave() {

			let nav = this.app.getActiveNav();
		
			if(nav && nav.getActive()) {
		
				  let activeView = nav.getActive().name;
		
				  let previuosView = '';
				  if(nav.getPrevious() && nav.getPrevious().name) {
					previuosView = nav.getPrevious().name;
				  }
				
				  console.log(previuosView); 
				  console.log(activeView);  
				  console.log('its leaving');
			  
				  if((activeView == 'DealerHomePage' || activeView == 'dealerGiftdetailtPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'DealerHomePage' && previuosView != 'dealerGiftdetailtPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) {
			  
				      console.log(previuosView);
				      this.navCtrl.popToRoot();
				  }
      }
    }

}
