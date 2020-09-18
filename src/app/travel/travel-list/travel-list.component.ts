import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import * as moment from 'moment';


@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss']
})
export class TravelListComponent implements OnInit {
  travel_list:any=[];
  loader:any=false;
  page_limit:any=50
  search:any={};
  skelton:any={}
  data_not_found=false;
  
  constructor(public serve:PearlService) 
  { 
    this.skelton = new Array(10);
    
  }
  
  ngOnInit()
  {
    this.getTravelList();
  }
  
  getTravelList(action:any='')
  {
    if(action == "refresh")
    {
      this.search = {};   
    }

    this.loader=true;
    
    this.serve.fetchData({'start':this.travel_list.length,'pagelimit':this.page_limit,'search':this.search},"Travel/travel_list").subscribe((result=>
      {
        console.log(result);
        this.loader= false;
        this.travel_list = result;
        
        if(this.travel_list.length == 0)
        {
          this.data_not_found = true;
        }
        else
        {
          this.data_not_found = false;
        }
      }))
    }
    
    public onDate(event): void 
    {
      this.search.travel_date=moment(event.value).format('YYYY-MM-DD');    
      console.log(this.search.travel_date);
      
      this.getTravelList();
    }
    
  }
  