import { Component, OnInit } from '@angular/core';
import { PearlService } from '../pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  start_attend_time: string;
  loader:any;
  data_not_found=false;
  data:any = {};
  checkins:any = [];
  show_today:boolean = true;
  count_1:any;
  count_2:any;
  pagelimit:any=50; 
  skelton:any={}
  
  
  constructor(public serve:PearlService,public route:Router,public dialog:DialogComponent) { 
    this.distributorList('get_today_checkin_new',1);
    console.log('gfvdb');
    this.skelton = new Array(10);
  }
  
  ngOnInit() {
  }
  
  
  distributorList(func_name,type)
  {
    console.log(this.pagelimit);
    this.loader=1;
    console.log(Object.getOwnPropertyNames(this.data).length);
    
    if( Object.getOwnPropertyNames(this.data).length != 0)
    {
      console.log("yes");
      
      this.pagelimit = 0;
      this.checkins = [];
    }
    if(this.data.date_created)
    {
      this.data.date_created=moment(this.data.date_created).format('YYYY-MM-DD');
    }
    
    this.serve.fetchData({'start':this.checkins.length,'pagelimit':this.pagelimit,'search':this.data},"Distributors/"+func_name)
    .subscribe(((result:any)=>{ 
      console.log(result);
      this.checkins = this.checkins.concat(result['result']);
      
      if(type == 1)
      {
        this.count_1 = this.checkins.length;
        this.count_2 = result.all_count;
        this.show_today = true;    
      }
      else
      {
        this.count_1 = result.all_count;
        this.count_2 = this.checkins.length;    
        this.show_today = false;    
      }
      
      console.log(this.checkins);
      if(this.checkins.length ==0){
        this.data_not_found=true;
      } else {
        this.data_not_found=false;
      }
      setTimeout (() => {
        this.loader='';
        
      }, 100);
    }))
  }
  
  
  change_tab(fn_name,type)
  {
    this.checkins = [];
    this.data = {};
    this.distributorList(fn_name,type);
  }
  excel_data:any=[];
  exportAsXLSX():void {
    for(let i=0;i<this.checkins.length;i++){
      this.excel_data.push({'Date':this.checkins[i].activity_date,'Sales User':this.checkins[i].exec_name,Type:this.checkins[i].dr_type==3?'Dealer':(this.checkins[i].dr_type==''?'other':'Channel Partner'),'Company Name':this.checkins[i].other_name==''?this.checkins[i].company_name:this.checkins[i].other_name,'Check In':this.checkins[i].visit_start,'Check Out':this.checkins[i].visit_end,'Remark':this.checkins[i].description});
      // if(this.checkins[i].dr_type==1){
      //   this.excel_data.push({Type:'Channel Partner','Company Name':this.checkins[i].company_name,'Check In':this.checkins[i].visit_start,'Check Out':this.checkins[i].visit_end,'Remark':this.checkins[i].remark})
      // }
      // if(this.checkins[i].dr_type==3){
      //   this.excel_data.push({Type:this.checkins[i].dr_type==3?'Dealer':(this.checkins[i].dr_type==''?'other':'Channel Partner'),'Company Name':this.checkins[i].company_name,'Check In':this.checkins[i].visit_start,'Check Out':this.checkins[i].visit_end,'Remark':this.checkins[i].remark})
      // }
      // if(this.checkins[i].dr_type==''){
      //   this.excel_data.push({Type:'Other','Company Name':this.checkins[i].other_name,'Check In':this.checkins[i].visit_start,'Check Out':this.checkins[i].visit_end,'Remark':this.checkins[i].remark })
      // }
    }
    console.log(this.excel_data);
    this.serve.exportAsExcelFile(this.excel_data, 'Check IN  Sheet');
  }
  // filter_checkins(data)
  // {
  //   console.log(data);
  //   this.serve.fetchData({company_name:this.data.company_name,user_name:this.data.user_name},"Distributors/get_all_checkin").subscribe((result=>{
  //     console.log(result);
  //     this.checkins = result;
  //     console.log(this.checkins);
  //   }))
  // }
}
