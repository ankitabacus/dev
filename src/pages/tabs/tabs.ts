import { Component,ViewChild } from '@angular/core';
import { NavController,Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ProfilePage } from '../profile/profile';
import { MainHomePage } from '../main-home/main-home';
import { TransactionPage } from '../transaction/transaction';
import { Storage } from '@ionic/storage';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfferListPage } from '../offer-list/offer-list';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { SelectRegistrationTypePageModule } from '../select-registration-type/select-registration-type.module';
import { ConstantProvider } from '../../providers/constant/constant';
// import { DealerHomePage } from '../dealer-home/dealer-home';
// import { DealerOfferListPage } from '../dealer-offer/dealer-offer-list/dealer-offer-list'





@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  index:any='';
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  tab1Root = HomePage;
  tab2Root = NewarrivalsPage;
  tab3Root = ContactPage;
  tab4Root = AboutPage;

  tab5Root = OfferListPage;
  tab6Root = MainHomePage;
  tab7Root = PointListPage;
  tab8Root =ProfilePage;

  // tab9Root =DealerOfferListPage;
  // tab10Root =DealerHomePage;









  constructor( public storage: Storage,public navParams: NavParams, public service:DbserviceProvider, public navCtrl: NavController,public constant:ConstantProvider ) 
  {

    if(this.constant.deviceId!='')
    {
        console.log('device id found' + this.constant.UserLoggedInData.id);

    }
    this.index = this.navParams.get('index')
    console.log(this.index);
    
    console.log(service);

    // if(this.index==0)
    // {
    //   this.rootPage==HomePage;
    //   // this.index=1
    // }
    
    storage.get('token').then((val) => {
      console.log(val);
      if(val == '' || val == null || val == undefined)
      {
        this.rootPage = SelectRegistrationTypePageModule;
        // this.nav.setRoot(MobileLoginPage);
      }else{
         

        if(this.index=='5')
        {
          console.log('index 5');
          
        this.navCtrl.setRoot(ProfilePage);
        // this.rootPage = ProfilePage;
        return;

        }
        // this.navCtrl.setRoot(HomePage);

        this.rootPage = HomePage;

      }
      
    });

  }

}
