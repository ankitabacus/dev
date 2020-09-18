import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  animations: [slideToTop()]
})
export class DiscountListComponent implements OnInit {

discountList:any=[];
value:any=[];
start:any=0;
count:any;
total_page:any; 
pagenumber:any;
page_limit:any=10
tmp_discountlist:any=[];
loader:any;
skelton:any={}
  constructor(public rout:Router,public serve:PearlService,public dialog:DialogComponent) {
    this.mydiscountList();
    this.skelton = new Array(10);
   }

  ngOnInit() {
  }

  mydiscountList()
  {

    // this.start=start;
    // this.page_limit=end;
    // console.log(end,start);
    this.loader=1;
    console.log("hello discount");
    this.serve.fetchData({'start':this.start,'pagelimit':this.page_limit},"Discount/discount_list").subscribe((result=>{
      console.log(result);
      this.discountList=result['Discount_list']['discount_list'];
      this.count=result['Discount_list']['count'];
      // this.temp
      this.tmp_discountlist = this.discountList;
            this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      console.log(this.total_page);
      console.log(this.pagenumber);
      setTimeout (() => {
        this.loader='';
        
    }, 700);
    }))
    
  }

  discountDetail(id)
  {
    console.log(id);
    let value={"id":id}
    this.serve.fetchData(value,"Discount/discount_detail").subscribe((result=>{
      console.log(result);
      // this.serve.setdiscountdata(result);
      this.rout.navigate(['/add-discount/'+id]);
      
    }))
    
  }

  deletediscount(id)
  {
    this.dialog.delete("This Category").then((result) => {
      if(result)
      {
        console.log(id);
        let data={'id':id}
        this.serve.fetchData(data,"Discount/delete_discount").subscribe((result=>{
          console.log(result);
          if(result)
          {
            this.mydiscountList();
          }
        }));
      }
  });
  }


tmp:any=[];  
  getItemsList()
  {
    console.log(this.value.search);
    console.log(this.tmp_discountlist);
    
    this.discountList=[];
    for(var i=0;i<this.tmp_discountlist.length; i++)
    {
      this.value.search=this.value.search.toLowerCase();
      
      this.tmp=this.tmp_discountlist[i]['category'].toLowerCase();
      if(this.tmp.includes(this.value.search))
      {
        this.discountList.push(this.tmp_discountlist[i]);
      }     
    }    
  }

  refresh()
  {
    this.mydiscountList();
  }
  
}
