import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
// import { isObjectEmpty } from 'ngx-bootstrap/chronos/utils/type-checks';

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  animations: [slideToTop()]
  
})
export class DistributionListComponent implements OnInit {
  value:any={};
  dr_list_temp:any=[];
  distributor_list:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50
  exp_loader:any=false;
  loader:any=false;
  data:any=[];
  data_not_found=false;
  type:any=1;
  brand_master:any=[];
  state_values:any=[];
  search_val:any={};
  login_data:any=[];
  login_dr_id:any;
  skelton:any={}
  
  constructor(public serve:PearlService,public route:Router,public dialog:DialogComponent,public session:sessionStorage) { 
  
  }
  
  ngOnInit() {
    this.search_val = this.serve.distributorListSearch
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    
    if(this.login_data.access_level !='1')
    {
      this.login_dr_id = this.login_data.id;
    }
    
    this.distributorList();
  }
  
  dr_count:any;
  public onDate(event): void 
  {
    this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');    
    this.distributorList();
  }
  distributorList(action:any='')
  {
    console.log(this.search_val);
    
    if(action == "refresh")
    {
      this.search_val = {};
      this.distributor_list = [];
      
    }
    
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 0;
      this.distributor_list = [];
    }
    
    if((this.dr_count != 0) && (this.dr_count == this.distributor_list.length))
    {
      return false;
    }
    
    this.loader=true;
    this.serve.fetchData({'start':this.distributor_list.length,'pagelimit':this.page_limit,'search':this.search_val ,'type':this.type,'login_user':this.login_dr_id},"Distributors/distributor")
    .subscribe((result=>{
      console.log(result);
      this.dr_list_temp=result['distributor']['distributor'];
      this.brand_master = result['distributor']['brand'];
      this.state_values = result['distributor']['states'];
      this.dr_count = result['distributor']['count'];
      // this.loader=false;
      this.distributor_list=this.distributor_list.concat(result['distributor']['distributor']);
      setTimeout (() => {
        this.loader=false;
        
      }, 500);
      console.log(this.distributorList.length);
      
      
      if(this.distributor_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  
  onScrollDown()
  {
    console.log("scrolled down");
    
  }
  // onUp(data)
  // {
  //   console.log(data);
  
  //   console.log("scrolled up");
  //   console.log(this.val);
  
  // }
  
  deleteUser(id)
  {
    this.dialog.delete('Distributor Data !').then((result) => {
      if(result){
        this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
          console.log(result);
          this.distributorList();
          
        }))
      }})
      
    }
    refresh()
    {
      this.distributorList();
    }
    userDetail(id)
    {
      console.log(id);
    this.serve.distributorListSearch = this.search_val

      this.route.navigate(['/distribution-detail/'+id]);
      
    }
    // getItemsList(index,search)
    // {
    //   console.log(search);
    //   this.distributor_list=[];
    //   if(index=='created_by'){
    //     for(var i=0;i<this.dr_list_temp.length; i++)
    //     {
    //       search=search.toLowerCase();
    //       this.tmpsearch1=this.dr_list_temp[i]['created_name']['name'].toLowerCase();
    //       if(this.tmpsearch1.includes(search))
    //       {
    //         console.log(search);
    //         this.distributor_list.push(this.dr_list_temp[i]);
    //       }     
    
    //     }
    //   }
    //   if(index!='created_by'){
    //     for(var i=0;i<this.dr_list_temp.length; i++)
    //     {
    //       search=search.toLowerCase();
    //       if(this.dr_list_temp[i][index]!=null){
    //         this.tmpsearch1=this.dr_list_temp[i][index].toLowerCase();
    //       }
    //       if(this.dr_list_temp[i][index]==null){
    //         this.tmpsearch1='';
    //       }
    //       if(this.tmpsearch1.includes(search))
    //       {
    //         console.log(search);
    //         this.distributor_list.push(this.dr_list_temp[i]);
    //       }     
    //     }
    //   }
    //   console.log(this.distributor_list);
    // }
    tmpsearch1:any={};
    excel_data:any=[];
    exp_data:any=[];
    exportAsXLSX():void {
      this.exp_loader = true;
      this.serve.FileData({'search':this.search_val,'type':this.type},"Distributors/distributor")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['distributor'].distributor;
        console.log(this.exp_data);
        for(let i=0;i<this.exp_data.length;i++)
        {
          this.excel_data.push({'Distributor Id':this.exp_data[i].id,'Company Name':this.exp_data[i].company_name,'GST':this.exp_data[i].gst,'Contact Person':this.exp_data[i].name,Mobile:this.exp_data[i].mobile,'WhatsApp No.':this.exp_data[i].whatsapp_no,Email:this.exp_data[i].email,'Address ':this.exp_data[i].address,'State ':this.exp_data[i].state,'District ':this.exp_data[i].district,'City ':this.exp_data[i].city,'Pincode ':this.exp_data[i].pincode,'Assigned Sales User ':this.exp_data[i].assign_user,'Date of Birth':this.exp_data[i].date_of_birth,'Date of Anniversary':this.exp_data[i].date_of_anniversary});
        }
        this.exp_loader = false;
        
        this.serve.exportAsExcelFile(this.excel_data, 'CHANNEL PARTNER SHEET');
        this.excel_data = [];
        this.exp_data = [];
        
      })
      
      
    }
  }
  