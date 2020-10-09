import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App} from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { ProductDetailPage } from '../product-detail/product-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { CategorydetailPage } from '../categorydetail/categorydetail';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
<<<<<<< Updated upstream
  skelton:any={}
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service:DbserviceProvider,
    public loadingCtrl:LoadingController,
    private app:App,
    public offlineService: OfflineDbProvider,
    private sqlite: SQLite) {
      
=======
  skelton:any={};
  date:any ;
  products:any;
  status1:boolean=false;
  productfilter:any=[];
  uniqueProduct:any=[];
  data:any = [];
  category_img:any;
  check:any ;
  
  activeMode: any;
  constructor(public navCtrl: NavController,public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App,public offlineService: OfflineDbProvider,private sqlite: SQLite, public common: CommonModule) {

    // this.filter.main_category = [];
>>>>>>> Stashed changes
      this.skelton = new Array(10);

      this.activeMode = 1;
      this.check = false; 
      // this.data = '';
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ProductsPage');
      this.presentLoading();
    }
    
    ionViewWillEnter()
    {
      this.getProductCategoryList();
    }
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.getProductCategoryList();
      this.filter.main_category = "";
      this.getCategory();
      this.flag='';
      refresher.complete();
    }
    goToNewArrivals()
    {
      console.log('newArrivals')
      this.navCtrl.push(NewarrivalsPage);
    }
    
    showdropdown(){
      this.status1 = !this.status1;
    }
    
    hidedropdown(){
      this.status1 = !this.status1;
      console.log("hello");
      
    }

    // doRefresh (refresher)
    // {   
    //     this.getCategory()
    //     // this.loginBanner()
    //     // this.get_count()
    //   refresher.complete();

    //     // setTimeout(() => {
    //     //     refresher.complete();
    //     // }, 1000);
    // }

    clear(){
      console.log("hello");
      
      // this.filter =[];
      // for (let x=0;x<f.elements.length;x++)
      //       {
      //       if (f.elements[x].type == "radio")
      //       {
      //       f.elements[x].checked = false; 
      //       }
      //       }

      for (let index = 0; index < this.uniqueProduct.length; index++) {
          //  this.uniqueProduct[index].checked = false;
           this.uniqueProduct[index].value = false;

      }
      this.getCategory();
    }

    // checkedd(){
    //   if(this.uniqueProduct.filter(row => row.checked).length == 1)
    //   {
    //     console.log("1 click");
        
    //   }
    //   else{

    //     for (let index = 0; index < this.uniqueProduct.length; index++) {
    //       this.uniqueProduct[index].checked = false;
    //  }
    //   }

    // }

    // category_Filter = [];
    selectfilterproduct(data,check){
      console.log(data);
      console.log(check);
      
      this.data = data;
      this.check = check;
    }

    gofilterproduct(){

      // console.log(this.uniqueProduct.filter(row => row.checked).length);
      // // let array1 :any= [];
      // // array1.push(data);

      // this.category_Filter = this.uniqueProduct.filter(row => row.checked === true);
      this.selectfilterproduct(this.data,this.check);
      console.log(this.data);
      this.filter.main_category= this.data;

      // console.log(this.category_Filter[0].main_category);
     
      // // this.filter.main_category= this.category_Filter;
      // this.filter.main_category= this.category_Filter[0].main_category;

            // this.filter.main_category= array1;
      // function onlyUnique(value, index, self) {
      //   return self.indexOf(value) === index;
      // }

      // this.filter.main_category.filter(onlyUnique);

      this.getCategory();
    }

    goOnCategoryListPage(name) {
      
      this.presentLoading2();
      this.filter.name = name;
      
      this.offlineService.onReturnLocalDBHandler().subscribe((db) => {
        
        this.offlineService.onGetCategoryRowsHandler(db, name).subscribe(categoryData => {
          
          this.loading.dismiss();
          
          const categoryLength = categoryData.rows.length;
          
          if(categoryLength == 1) {
            
            console.log('list length is one');
            
            const item = categoryData.rows.item(0);
            console.log(item);
            const categoryId = item.id;
            this.navCtrl.push(ProductDetailPage,{'id':categoryId,src: 'mainCategory'});
            
          } else {
            
            console.log('list length is two');
            this.navCtrl.push(ProductsPage,{'name':name})
          }
        });
      });
    }
    
    goOnCategoryDetail()
    {
<<<<<<< Updated upstream
      this.navCtrl.push(CategorydetailPage)
=======
      this.navCtrl.push(CategorydetailPage,{'id':id})
    }

    getCategory()
    {
      this.date="";
      this.filter.date = this.date;
      
      // if(this.filter.value=='cord'){

      // }
      this.service.post_rqst({'filter' : this.filter},'app_karigar/productListapp').subscribe((res)=>
      {
        console.log(res);
        this.products = res.products;
        console.log(this.products);
        this.category_img =this.products[0].image;
        console.log(this.category_img);
        // console.log(this.category_img.image);
        // for (let index = 0; index < this.products.length; index++) {

        //     const categoryIndex = this.productfilter.findIndex(row => row.main_category == this.products[index].main_category);

        //     if(categoryIndex === -1) {

        //           this.productfilter.push({
        //                 main_category: this.products[index].main_category,
        //                 checked: false
        //           });
        //     }
        // }

        for (let index = 0; index < this.products.length; index++) {

              this.productfilter.push(this.products[index].main_category);
              }
          
        console.log(this.productfilter);
        
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        this.uniqueProduct = this.productfilter.filter(onlyUnique);

          console.log(this.uniqueProduct);
        
      })
>>>>>>> Stashed changes
    }
    
    
    goOnCategoryListPageWithLiveServer(name){
      this.presentLoading2();
      this.filter.limit = 0;
      this.filter.name = name;
      this.service.post_rqst({'filter' : this.filter},'app_master/checkCategoryLength')
      .subscribe((r)=>
      {
        console.log(r);
        this.loading.dismiss();
        if(r['categories'].length == 1)
        {
          console.log('list length is one');
          this.navCtrl.push(ProductDetailPage,{'id':r['categories'][0].id})
          
        }
        else{
          console.log('list length is two');
          
          this.navCtrl.push(ProductsPage,{'name':name})
        }
      },(error: any) => {
        this.loading.dismiss();
      })
    }
    
    
    getProductCategoryList(name = '') {
      
      this.filter.name = name;
      if(name) {
        this.filter.name = '%' +name + '%';
      }
      this.no_rec=false
      this.offlineService.onGetMainCategoryListHandler(this.filter).subscribe(data => {
        
        console.log(data);
        this.prod_cat_list = [];
        
        for (let i = 0; i < data.rows.length; i++) {
          
          let item = data.rows.item(i);
          this.prod_cat_list.push(item);
          console.log(item);
          console.log(item.id);
          this.offlineService.onReturnImagePathHandler('mainCategoryImage', item.image, item.id).subscribe((imageResultData) => {
            
            console.log(imageResultData);
            
            const categoryIndex = this.prod_cat_list.findIndex(row => row.id == imageResultData.recordId);
            
            console.log(this.prod_cat_list);
            console.log('categoryIndex ' + categoryIndex);
            
            this.prod_cat_list[categoryIndex].imageCompletePath = imageResultData['imagePath'];
            
          });
        }
        
        console.log(this.prod_cat_list);
        if(!this.prod_cat_list.length)
        {
          this.no_rec=true
        }
      });
    }
    
    getCategoryImages(categoryId,index)
    {
      console.log(categoryId)
      //  this.prod_cat_list[index]['image'] = 'http://app.gravitybath.com/dd_api/app/uploads/newarrival.jpg';
      this.service.post_rqst({'categoryid':categoryId},'app_master/getcategoryImage').subscribe((res)=>
      {
        console.log(res)
        console.log(res['categories'][0]['image'])
        this.prod_cat_list[index]['image'] = res['categories'][0]['image']
      })
    }
    
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      
      this.filter.limit=this.prod_cat_list.length;
      this.service.post_rqst({'filter' : this.filter},'app_master/parentCategoryList').subscribe( r =>
        {
          console.log(r);
          if(r['categories']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              for (let index = this.prod_cat_list.length; index < r['categories'].length; index++) {
                console.log(r['categories'][index])
                this.getCategoryImages(r['categories'][index]['main_category'],index)
              }
              this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      presentLoading()
      {
        // this.loading = this.loadingCtrl.create({
        //   content: "Please wait...",
        //   dismissOnPageChange: true
        // });
        // this.loading.present();
      }
      presentLoading2()
      {
        this.loading = this.loadingCtrl.create({
          content: "",
          dismissOnPageChange: true
        });
        this.loading.present();
      }
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
          if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
          {
            
            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }
      //master search start
      goToProductsWithSearch(globalSearchData)
      {
        setTimeout(() => {
          
          this.navCtrl.push(ProductDetailPage, {'id':'', categoryName:'', globalSearchData: globalSearchData, src: 'mainCategory'})
        }, 500);
      }
      
    }
    