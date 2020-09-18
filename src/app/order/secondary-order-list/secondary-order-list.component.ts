import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-secondary-order-list',
  templateUrl: './secondary-order-list.component.html',
  styleUrls: ['./secondary-order-list.component.scss']
})
export class SecondaryOrderListComponent implements OnInit {
  
  
  orderlist:any=[];
  tmp_orderlist:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50
  loader:any;
  tmp_list:any=[];
  data:any=[];
  value:any={};
  search_val:any={}
  data_not_found:any=false;
  login_data:any=[];
  login_dr_id:any;
  skelton:any={}
  
  constructor(public serve:PearlService,public route:Router,public dialog:DialogComponent,public session:sessionStorage) 
  {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    
    if(this.login_data.access_level !='1')
    {
      this.login_dr_id = this.login_data.id;
    }
    this.search_val =this.serve.orderFilterSecondary;
    this.orderList();
  }
  
  ngOnInit() {
  }
  
  orderList()
  { 
    this.loader=1;
    console.log(this.data.search);
    if( Object.getOwnPropertyNames(this.search_val).length != 0)
    {
      this.page_limit = 0;
      this.orderlist = [];
    }
    this.serve.fetchData({'start':this.orderlist.length,'pagelimit':this.page_limit,'search':this.search_val,'login_user':this.login_dr_id},"Order/secondary_order_list")
    .subscribe((result=>{
      
      console.log(result);
      this.tmp_orderlist=result['order_list']['result'];
      this.count=result['order_list']['data'];
      
      this.orderlist = this.orderlist.concat(result['order_list']['result']);
      
      setTimeout (() => {
        this.loader='';
        
      }, 700);
      if(this.orderlist.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
        
      }
    }))
  }
  refresh()
  {
    this.orderList();
  }
  detailOrder(id)
  {
    this.serve.orderFilterSecondary = this.search_val ;

    this.route.navigate(['/order-detail/'+id]);
  }
  
  deleteOrder(id)
  {
    this.dialog.delete('Order Data !').then((result) => {
      if(result){
        console.log("order deleted");
        
        this.serve.fetchData({'order_id':id},"Order/order_delete").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.orderList();
          }
        }))
      }});
    }
    getItemsList(index,search)
    {
      console.log(search);
      this.orderlist=[];
      for(var i=0;i<this.tmp_orderlist.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch1=this.tmp_orderlist[i][index].toLowerCase();
        if(this.tmpsearch1.includes(search))
        {
          // console.log(this.orderlist);
          
          this.orderlist.push(this.tmp_orderlist[i]);
        }     
      }    
      console.log(this.orderlist);
      
    }
    tmpsearch1:any={};
    // getItemsList(search)
    // {
    //   console.log(search);
    //   this.orderlist=[];
    //   for(var i=0;i<this.tmp_list.length; i++)
    //   {
    //     search=search.toLowerCase();
    //     this.tmpsearch=this.tmp_list[i]['company_name'].toLowerCase();
    //     if(this.tmpsearch.includes(search))
    //     {
    //       this.orderlist.push(this.tmp_list[i]);
    //     }     
    //   }    
    //   console.log(this.orderlist);
    
    // }
    
    
    allCount:any;
    selected_order:any ='';
    
    allOrderdata(){
      this.allCount = 0;
      
      if( !this.search_val.allStates ){
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = false)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }
        
      }else{
        for (let i = 0; i < this.orderlist.length; i++) {
          if(this.orderlist[i].selected_order = true)
          {
            this.allCount++;
          }
          console.log(this.allCount);
        }
      }
    }
    
    countSelected(){
      this.allCount = 0;
      for (let i = 0; i < this.orderlist.length; i++) {
        if( this.orderlist[i].selected_order )
        {
          this.allCount++;
        }
      }
    }
    
    deletecheckavailable() {
      this.dialog.delete('').then((result) => {
        if(result) {
          this.serve.fetchData({ 'check' : this.orderlist } , 'Order/secondary_delete')
          .subscribe(d => {
            console.log(d);
            this.orderList();
            // this.dialog.successfully();
          });
        }
      });
    } 
    
    exp_loader:any=false;
    exp_data:any=[];
    excel_data:any=[];
    
    exportAsXLSX():void 
    {
      this.exp_loader = true;
      
      this.serve.FileData({'search':this.search_val},"Order/secondary_order_excel")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['order_list'].result;
        
        for(let i=0;i<this.exp_data.length;i++)
        {
          this.excel_data.push({'Date':this.exp_data[i].date_created,'Created By':this.exp_data[i].created_by_name,'Order Id':this.exp_data[i].id,'Company Name':this.exp_data[i].company_name,'Company Id':this.exp_data[i].dr_id,'Total Item':this.exp_data[i].order_item,'Dealer Order Value':this.exp_data[i].order_total,'Company Order Value':this.exp_data[i].sec_ord_background_amt,'Channel Partner':this.exp_data[i].distributor_name,'Status':this.exp_data[i].order_status});
        }
        this.exp_loader = false;
        
        this.serve.exportAsExcelFile(this.excel_data, 'Secondary-Order');
        this.excel_data = [];
        this.exp_data = [];
      });
    }
    
    public onDate(event): void 
    {
      this.search_val.date_created=moment(event.value).format('YYYY-MM-DD');    
      this.orderList();
    }
  }
  
  
  
  