import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {

  leave_list:any=[];
  loader:any;
  search:any={};
  skelton:any={}
  data_not_found = false;

  constructor(public serve:PearlService,public dialog:DialogComponent, public dialogs: MatDialog) 
  {
    this.skelton = new Array(10);
  }

  ngOnInit() 
  {
    this.leaveList();
    this.search = {};
  }

  openDialog(leave_id): void {
  
    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '550px', data:{
        
        id : leave_id,
        reason: ''
      }
        
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.leaveList();
    });
  }

  leaveList()
  {
    if(this.search.date_created)
    {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
    }
    
    this.loader=true;
    this.serve.fetchData({filter:this.search},"Leaves/leave_list").subscribe((result=>
    {
      this.loader=false;
      console.log(result);
      this.leave_list = result;

      console.log(this.leave_list.length);
      

      if(this.leave_list.length == 0)
      {
        this.data_not_found = true;
      }
      else
      {
        this.data_not_found = false;
      }
    }));
  }

}
