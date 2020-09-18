import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]
  
})
export class OrderListComponent implements OnInit {
  view_tab:any='all';
  value:any={};
  
  orderlist:any=[];
  start:any=0;
  count:any;
  total_page:any; 
  pagenumber:any;
  page_limit:any=50;
  loader:any;
  tmp_list:any=[];
  tmp_orderlist:any=[];
  data:any=[];
  search_val:any={};
  data_not_found:any=false;
  login_data:any=[];
  login_dr_id:any;
  skelton:any={};
  
  constructor(public serve:PearlService,public route:Router,public dialog:DialogComponent,public session:sessionStorage) 
  { 
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    
    if(this.login_data.access_level !='1')
    {
      this.login_dr_id = this.login_data.id;
    }
  }
  
  ngOnInit() {
    this.search_val =this.serve.orderFilterPrimary;
    this.orderList();

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
    this.serve.fetchData({'start':this.orderlist.length,'pagelimit':this.page_limit,'search':this.search_val,'login_user':this.login_dr_id},"Order/order_list")
    .subscribe((result=>{
      
      console.log(result);
      this.count=result['order_list']['data'];
      this.tmp_orderlist=result['order_list']['result'];
      this.orderlist = this.orderlist.concat(result['order_list']['result']);
      console.log(this.tmp_orderlist);
      
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
    this.serve.orderFilterPrimary = this.search_val ;
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
    tmpsearch:any={};
    tmpsearch1:any={};
    
    filter_order_data(status){
      console.log(status);
      this.view_tab=status;
      if(status!='all'){
        this.orderlist=[];
        for(var i=0;i<this.tmp_orderlist.length; i++)
        {
          // status=status.toLowerCase();
          this.tmpsearch=this.tmp_orderlist[i]['order_status'];
          if(this.tmpsearch.includes(status))
          {
            // console.log(this.orderlist);
            
            this.orderlist.push(this.tmp_orderlist[i]);
          }     
        }    
        console.log(this.orderlist);
      }else if(status=='all'){
        this.orderlist=this.tmp_orderlist;
      }
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
          this.serve.fetchData({ 'check' : this.orderlist } , 'Order/primary_delete')
          .subscribe(result => {
            if(result)
            {
              this.orderList();
            }
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

      this.serve.FileData({'search':this.search_val},"Order/primary_order_excel")
      .subscribe(resp=>{
        console.log(resp);
        this.exp_data = resp['primary_order_excel'].result;
        console.log(this.exp_data);

        for(let i=0;i<this.exp_data.length;i++)  
        {
          this.excel_data.push({'Date':this.exp_data[i].date_created,'Created By':this.exp_data[i].created_by_name,'Order Id':this.exp_data[i].id,'Company Name':this.exp_data[i].company_name,'Total Item':this.exp_data[i].order_item,'Order Value':this.exp_data[i].order_total,'Status':this.exp_data[i].order_status});
        }
        this.exp_loader = false;
        
        this.serve.exportAsExcelFile(this.excel_data, 'Primary-Order');
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
  