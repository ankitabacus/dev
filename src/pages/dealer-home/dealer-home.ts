import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,AlertController, ToastController,Loading,LoadingController } from 'ionic-angular';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { FileTransfer } from '@ionic-native/file-transfer';
import * as moment from 'moment/moment';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { CategoryPage } from '../category/category';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';
import { DealerOrderPage } from '../dealer-order/dealer-order';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { NearestDealerPage } from '../nearest-dealer/nearest-dealer';
import { ConstantProvider } from '../../providers/constant/constant';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { DealerDealerListPage } from '../dealer-dealer-list/dealer-dealer-list';

import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { VideoPage } from '../video/video';
import { HomePage } from '../../pages/home/home';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TabsPage } from '../tabs/tabs';


@IonicPage()
@Component({
    selector: 'page-dealer-home',
    templateUrl: 'dealer-home.html',
})
export class DealerHomePage {
    lable:any;
    dealer_detail:any;
    last_point:any;
    today_point:any;
    status:any;
    prodCount:any={}
    loading:Loading;
    data:any;
    data1:any;
    date:any ;
    product_count:any;
    filter:any={};
    constructor(public navCtrl: NavController,public socialSharing:SocialSharing , public events: Events,public constant:ConstantProvider, public navParams: NavParams, public offlineService: OfflineDbProvider,public service:DbserviceProvider ,public db:MyserviceProvider,public locationAccuracy: LocationAccuracy,public geolocation: Geolocation,public toastCtrl:ToastController,
        private barcodeScanner: BarcodeScanner,public alertCtrl:AlertController,public loadingCtrl:LoadingController) {
        events.subscribe('getCountProducts',(data)=>
        {
            if(this.constant.deviceId!='')
            {
                console.log('device id found' + this.constant.UserLoggedInData.id);
                 this.db.addData({'registration_id':this.constant.deviceId ,dr_id: this.constant.UserLoggedInData.id},'DealerData/updateDeviceToken').then((r)=>
                        {
                        });
            }
        this.get_count()

        })
    }
    ionViewWillEnter()
    {
        this.getDashBoardData()
        this.loginBanner()
        this.get_count()
        this.getData()
        this.getverified()
        this.get_details()


       

        if(this.constant.UserLoggedInData.type==1) //that means lohin user is distributor
        {
            this.lable = 'My Dealers'
        } else // that means login user is dealer 
        {
            this.lable = 'My Distributors'
        }
        console.log(this.constant);
        if(this.constant.deviceId!='')
        {
            console.log('device id found' + this.constant.UserLoggedInData.id);
             this.db.addData({'registration_id':this.constant.deviceId ,dr_id: this.constant.UserLoggedInData.id},'DealerData/updateDeviceToken').then((r)=>
                    {
                    });
        }
        // console.log(this.service.karigar_info[0].id);

        
        
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad DealerHomePage');
        this.onProcessSQLDataHandler();
        this.getverified();
        this.getCategory();

           
        }

    onProcessSQLDataHandler() {
        
        if(this.offlineService.localDBCallingCount === 0) {
            
            this.offlineService.localDBCallingCount++;
            this.offlineService.onValidateLocalDBSetUpTypeHandler();
        }
    }
    open_menu()
    {
        this.events.publish('side_menu:navigation_barDealer');
    }
    // goToNewArrivals()
    // {
    //     this.navCtrl.push(NewarrivalsPage);
    // }
    goOnContactPage(){
        this.navCtrl.push(ContactPage,{mode:'dealer'});
    }
    goOnAboutPage(){
        this.navCtrl.push(AboutPage,{mode:'dealer'});
    }
    goToarrivals()
    {
        this.navCtrl.push(NewarrivalsPage)
    }
    goOnProductPage()
    {
        this.navCtrl.push(CategoryPage,{'mode':'home'});
    }
    goToOrders(type)
    {
        console.log(type)
        this.navCtrl.push(DealerOrderPage,{mode:'dealer',type:type});
    }
    
    goto_executive()
    {
        this.navCtrl.push(DealerExecutiveListPage);
    }

    getverified(){

        console.log(this.constant.UserLoggedInData.all_data.dealer_status);
        this.status = this.constant.UserLoggedInData.all_data.dealer_status;

        // this.service.post_rqst({'dealer_id':this.constant.UserLoggedInData.id.toString()},'app_karigar/DealerHome')
        // .subscribe((r:any)=>
        // {
        //     console.log(r);
        //     this.loading.dismiss();
        //     this.dealer_detail=r['karigar'];
            
        //     this.status = this.dealer_detail.dealer_status;
        //     console.log(this.dealer_detail.dealer_status);
        //     console.log(this.dealer_detail);
        // console.log(this.dealer_detail.dealer_status);
        //     console.log(this.dealer_detail);
        // })
    }
    
    banner:any=[]
    loginBanner(){
        console.log('called');
        
        this.service.post_rqst( '', 'app_karigar/loginBannersApp' )
        .subscribe(d => {
            console.log(d);
            
            this.banner = d.banner;
            console.log(this.banner);
        });
    }
    goToNearestDealers(type)
    {
        var data = this.constant.UserLoggedInData.all_data;
        console.log(data);
        
        
        this.navCtrl.push(NearestDealerPage,{pincode:data.pincode,type:type});
        
    }
    newOrder()
    {
        this.navCtrl.push(DealerAddorderPage);
    }
    
    delaerexecutive(type)
    {
        this.navCtrl.push(DealerExecutiveAppPage,{"type":type});
    }
    
    
    ShareApp()
    {
        this.socialSharing.share('Hey There ! here is an awesome app from Gravity Bath Pvt Ltd  ..Give it a try https://play.google.com ')
        .then(() => {
            console.log("success");
        }).catch((e) => {
            console.log(e);
        });
    }
    goToassignedDr()
    {
        this.navCtrl.push(DealerDealerListPage);
    }
    dashboardData:any={}
    getDashBoardData()
    {
        this.db.show_loading()
        setTimeout(() => {
            console.log(this.constant.UserLoggedInData.id)
            this.db.addData({dr_id:this.constant.UserLoggedInData.id,type:this.constant.UserLoggedInData.type},'DealerData/getDashboardData')
            .then((res)=>
            {
                console.log(res);
                this.dashboardData = res;
                console.log(this.dashboardData.secondary);
                console.log(this.dashboardData.primary);
                console.log(this.dashboardData.drCount);
                if(this.dashboardData.secondary.total_amount)
                {
                    this.dashboardData.secondary.total_amount = Math.round(this.dashboardData.secondary.total_amount)
                }
                if(this.dashboardData.secondary.total_amount)
                {
                    this.dashboardData.primary.total_amount = Math.round(this.dashboardData.primary.total_amount)
                }
                this.db.dismiss()
            },err=>
            {
                this.db.dismiss()
                this.db.errToasr()
            })
            
        }, 1000);
    }
    check_location()
    {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        .then(() => {
            let options = {
                maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
            };
            this.geolocation.getCurrentPosition(options)
            .then((resp) => {
                var lat = resp.coords.latitude
                var lng = resp.coords.longitude
                this.db.addData({user_data:this.constant.UserLoggedInData,"lat":lat,"lng":lng},"dealerData/add_location")
                .then(resp=>{
                    console.log(resp);
                    
                })
            },
            error => {
                console.log('Error requesting location permissions', error);
                let toast = this.toastCtrl.create({
                    message: 'Allow Location Permissions',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            });
        });
    }
    doRefresh (refresher)
    {   
        this.getDashBoardData()
        this.loginBanner()
        this.get_count()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
    notification()
    {
        this.db.addData('',"dealerData/send_push_notification")
        .then(resp=>{
            console.log(resp);
            
        })
    }

    dealerwallet:any ;
    getData()
    {
        this.presentLoading();
        // this.loading.present
        console.log("Check");
        this.service.post_rqst({'dealer_id':this.constant.UserLoggedInData.id.toString()},'app_karigar/DealerHome')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.dealer_detail=r['karigar'];
            console.log(this.dealer_detail.dealer_status);
            console.log(this.dealer_detail);
            
            console.log(this.dealer_detail.dealer_wallet);
            this.dealerwallet = this.dealer_detail.dealer_wallet;
            console.log(this.dealerwallet);
            
            this.last_point=r['last_point'];
            this.today_point=r['today_point'];
        },() => {
            this.loading.dismiss();
        });
    }

    get_count()
    {
        this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {
            this.prodCount.total= productCount
        },err=>
        {

        });
    
        this.offlineService.onReturnActiveProductNewArrivalsCountHandler().subscribe(productCount1 => {
            this.prodCount.new= productCount1
            
        },err=>
        {

        });
        console.log(this.prodCount);
        
    }
    goToVideosPage(cat){
        console.log(cat);
        
        this.navCtrl.push(VideoPage,{cat:cat});
      }
      qr_code:any='';
      alertMsg:any={};
      dealer_details:any={};

      showAlert(text)
      {
          let alert = this.alertCtrl.create({
              title:'Alert!',
              cssClass:'action-close',
              subTitle: text,
              buttons: ['OK']
          });
          alert.present();
      }

      showSuccess(text)
      {
          let alert = this.alertCtrl.create({
              title:'Success!',
              cssClass:'action-close',
              subTitle: text,
              buttons: ['OK']
          });
          alert.present();
      }


      presentLoading()
      {
          this.loading = this.loadingCtrl.create({
              content: "Please wait...",
              dismissOnPageChange: true
          });
          this.loading.present();
      }
    //   product_count

    getCategory()
    {
      this.date="";
      this.filter.date = this.date;
      
      this.service.post_rqst({'filter' : this.filter},'app_karigar/productListapp').subscribe((res)=>
      {
        console.log(res);
        this.product_count = res.product_count;
        console.log(this.product_count);
        

      });
    }


    //   getData()
    // {
    //     this.presentLoading();
    //     // this.loading.present
    //     console.log("Check");
    //     this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/karigarHome')
    //     .subscribe((r:any)=>
    //     {
    //         console.log(r);
    //         this.loading.dismiss();
    //         this.dealer_details=r['dealers'];
           
    //     },() => {
    //         this.loading.dismiss();
    //     });
    // }


    get_details()
    {
        // this.db.show_loading()
        this.db.addData({"dr_id":this.constant.UserLoggedInData.id},"dealerData/getdetails")
        .then(resp=>{
            console.log(resp);
            this.data = resp;
            console.log(this.data.dealer_status);
            this.data1 = this.data.dealer_status;
            this.dealer_detail=resp;
            console.log(this.dealer_detail.dealer_status);
            console.log(this.dealer_detail);
            
            console.log(this.dealer_detail.dealer_wallet);
            this.dealerwallet = this.dealer_detail.dealer_wallet;
            console.log(this.dealerwallet);
            
            // this.last_point=resp['last_point'];
            // this.today_point=resp['today_point'];
            
            
        });
    }


      scan(){
        //   alert('ss');
        this.barcodeScanner.scan().then(resp => {
            console.log(resp);
            this.qr_code=resp.text;
            console.log( this.qr_code);
            if(resp.text != '')
            {
                this.service.post_rqst({ dealer_id :this.constant.UserLoggedInData.id,'qr_code':this.qr_code},'app_karigar/dealerCoupon')
                .subscribe((r:any)=>
                {
                    console.log(r);
                    
                    if(r['status'] == 'INVALID'){
                        this.showAlert("Invalid Coupon Code");
                        return;
                    }
                    else if(r['status'] == 'USED'){
                        
                        this.alertMsg.scan_date=r.scan_date;
                        this.alertMsg.karigar_data=r.karigar_data;
                        this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
                        
                        // this.showAlert("Coupon Already Used By "+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date );
                        this.showAlert("Coupon Already Used");
                        return;
                    }
                    else if(r['status'] == 'UNASSIGNED OFFER'){
                        this.showAlert("This Coupon Code is not applicable in your Area");
                        return;
                    }
                    this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
                    // this.getData();
                });
            }
            else{
                console.log('not scanned anything');
            }
           
        });
      }

}