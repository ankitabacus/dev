import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';

@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  // styleUrls: ['./followup-list.component.scss'],
  animations: [slideToTop()]

})
export class FollowupListComponent implements OnInit {

  followup_list:any=[];
  value:any=[];
  tmp_follow_list:any=[];

  constructor(public serve:PearlService) {

    this.followUpList();
   }

  ngOnInit() {
  }

  followUpList()
  {
    this.serve.fetchData(0,"Distributors/followup_list").subscribe((result=>{
      console.log(result);
      this.followup_list=result['followup_list'];
      this.tmp_follow_list=this.followup_list;
    }))
  }
  tmpsearch:any={};
  getItem(search)
  {
    console.log(search);
    console.log(search);
    
    this.followup_list=[];
    for(var i=0;i<this.tmp_follow_list.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch=this.tmp_follow_list[i]['activity_type'].toLowerCase();
      // this.tmpsearch=this.tmp_follow_list[i]['date_created'].toLowerCase();
      // this.tmpsearch=this.tmp_follow_list[i]['next_followup'].toLowerCase();
      // this.tmpsearch=this.tmp_follow_list[i]['next_followup_type'].toLowerCase();

      if(this.tmpsearch.includes(search))
      {
        this.followup_list.push(this.tmp_follow_list[i]);
      }     
    }    
    console.log(this.followup_list);
    
  }

}
