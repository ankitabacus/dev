import { Component, OnInit, Inject } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {
  // data:any={};
  login:any={};

  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:PearlService) { 
console.log(this.data);

  }

  ngOnInit() {
    this.login=JSON.parse(localStorage.getItem('login'));
    console.log(this.login.data.id);
  }
  reason_reject:any
  order_status_change(reason,status){
    console.log(reason,status);
  
    this.serve.fetchData({'reason':reason,'status':status,'id':this.data.order_id,'action_by':this.login.data.id},"Order/orderstatus_change").subscribe((result=>{
      console.log(result);
    }))
    this.dialog.closeAll();

    // this.orderDetail();
  }
}
