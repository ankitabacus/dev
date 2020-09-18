import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PearlService } from 'src/app/pearl.service';

@Component({
    selector: 'app-order-dispatch',
    templateUrl: './order-dispatch.component.html',
})
export class OrderDispatchComponent implements OnInit {
    loader:any=1;
    order_id:any=0;
    order_detail:any=[];
    order_item:any=[];
    constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:PearlService) {
        console.log(data);
        this.order_id = data['order_id'];
    }
    
    ngOnInit() {
        this.orderDetail();
    }
    
    orderDetail()
    {
        this.loader=1;
        let id={'order_id':this.order_id}
        this.serve.fetchData(id,"Order/order_detail").subscribe((result=>{
            console.log(result);
            this.order_detail=result['order_detail'];
            this.order_item=result['order_detail']['order_item'];
            this.order_detail.order_cgst = this.order_detail.order_gst/2;  
            this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
            setTimeout (() => {
                this.loader='';
                
            }, 700);
        }))
    }
    
    
    
    update_order()
    {
        console.log(this.order_item);
        this.serve.fetchData({'order_id':this.order_id,"data":this.order_item},"Order/dispatch_order")
        .subscribe(resp=>{
            console.log(resp);
            if(resp['dispatch_order'] == 'success')
            {
                this.dialog.closeAll();
            }
        })
    }
    
    check_qty(indx)
    {
        console.log(this.order_item[indx]);
        
        if(this.order_item[indx]['dispatchQty'] == null)
        {
            this.order_item[indx]['dispatchQty'] = 0;
        }
        
        if(this.order_item[indx]['dispatchQty'] > this.order_item[indx]['pending_qty'])
        {
            this.order_item[indx]['dispatchQty'] = this.order_item[indx]['pending_qty'];
        }               
    }
}
