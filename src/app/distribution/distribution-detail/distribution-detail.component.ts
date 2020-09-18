import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { UserEmailModalComponent } from 'src/app/user/user-email-modal/user-email-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DistributionEditComponent } from '../distribution-edit/distribution-edit.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { AddPrimaryOrderValueComponent } from '../add-primary-order-value/add-primary-order-value.component';
import { DialogComponent } from 'src/app/dialog.component';
import { DistributionLegderModelComponent } from '../distribution-legder-model/distribution-legder-model.component';
import { DrDiscountComponent } from '../dr-discount/dr-discount.component';
import { DisOtpVarificationComponent } from '../dis-otp-varification/dis-otp-varification.component';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { DisExecutiveModelComponent } from '../dis-executive-model/dis-executive-model.component';

@Component({
    selector: 'app-distribution-detail',
    templateUrl: './distribution-detail.component.html',
    animations: [slideToTop()]
    
})
export class DistributionDetailComponent implements OnInit {
    public barChartLabels: Label = [];
    public barChartData: ChartDataSets[] = [];
    public barChartType: ChartType = 'bar';
          public barChartLegend = true;
    brand_list1:any=[];
    temp_order:any=[];
    brand_list:any=[];
    dr_id:any;
    dr_detail:any;
    asmList:any=[];
    assignUserList:any=[];
    assignDelaerList:any=[];
    assignUser:any=[];
    assignUserId:any=[];
    userDiscountList=[];
    active:any={};
    loader:any;
    order_data:any=[];
    login_data:any={};
    primary_ord_data:any=[];
    order_type:any=0;
    ledger_data:any=[];
    assignedDealers:any=[]
    orderTabActive:any={}
    count:any=[];
    orderdata:any=[];
    dashboardCounts:any={}
  
    today_date:any;
    constructor(public route:ActivatedRoute,public rout:Router,public toast:ToastrManager,public serve:PearlService,public alert : DialogComponent,public dialog: MatDialog,public session:sessionStorage,public renderer:Renderer2,public alrt:DialogComponent)
    {
        
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value;
        this.login_data = this.login_data.data;
        console.log(this.login_data);
        
        this.route.params.subscribe( params => {
            console.log(params);
            this.dr_id = params.id;
            console.log(this.dr_id);
            
        });
        
        this.retailerDetail();
        this.ledger_list();
        this.salesUserLIst()
        // this.count_data();
        this.order_dashboard();
    
        this.today_date = moment(new Date()).format("MMM - Y"); 
        // this.dealer_list()
        this.session.getSession()
        .subscribe(resp=>{
            console.log(resp);
            this.login_data = resp.data;
            console.log(this.login_data);
            
            if(this.login_data.type == '1' && this.login_data.lead_type == 'Dr' )
            {
                this.renderer.addClass(document.body, 'chanel-patner');
            }
            else
            {
                this.renderer.removeClass(document.body, 'chanel-patner');
            }
        })
        
        this.get_primary_ord();
        
    }
    
    ngOnInit() {
    }
    
    temp_disc:any={};
    temp_checkin:any={};
    // active:any = {};
    toggleterritory(key,action)
    {
        console.log(action);
        console.log(key);
        
        if(action == 'open')
        { this.active[key] = true; }
        if(action == 'close')
        { this.active[key] = false;
        }
        
        console.log(this.active);
    }
    
    deal_list:any = [];
    dealer_list()
    {
        this.loader = true;
        this.serve.fetchData({},"Distributors/get_assign_dealer")
        .subscribe(resp=>{
            console.log(resp);
            this.deal_list = resp['dealer_list'];
            
            this.deal_list.map(resp=>{
                this.assignDelaerList.map(row=>{
                    
                    if(row.dealer_id == resp.id)
                    {
                        console.log(resp.id);
                        console.log(row.dealer_id);
                        resp.check = true;
                        this.assign_dealer.push({"id":resp.id,"company_name":resp.company_name})
                    }
                });
            });
            this.loader = false;
            console.log(this.deal_list);
            console.log(this.assign_dealer);
        })
    }
    
    scrollHandler(eve)
    {
        console.log(eve);
        console.log("called");
        
    }
    
    verify()
    {
        this.serve.fetchData({"dr_id":this.dr_id},"Distributors/verify_dealer")
        .subscribe(resp=>{
            console.log(resp);
            this.toast.successToastr("Verified");
        })
    }
    
    assign_brand:any=[];
    totalOrders:any={}
    orderTabCounters:any={}
    getOrders(type,status)
    {
        console.log(this.search4);
        
        var orderType
        if(type=='pOrder')
        {
            orderType='Primary'
        }
        else
        {
            orderType='Secondary'
        }
        this.orderTabActive.active = status ; 
        this.loader=true;       
        
        let data={"id":this.dr_id,'type':orderType,'status':status,'search':this.search4}
        this.serve.fetchData(data,"Distributors/getOrders")
        .subscribe((result)=>
        {
            console.log(result);
            this.order_data=result['data']
            this.totalOrders=result['count']
            this.orderTabCounters=result['tabCounters']
            console.log(this.order_data);
            
            setTimeout (() => {
                this.loader=false;
                
            }, 700);
            
        })
    }
    dealersCount:any
    retailerDetail()
    {
        this.loader=true;       
        
        let id={"id":this.dr_id}
        this.serve.fetchData(id,"Distributors/distributor_detail")
        .subscribe((result)=>
        {
            console.log(result);
            this.dr_detail=result['distributor_detail']['result'];
            this.temp_order=this.order_data;
            this.assignUserList=result['distributor_detail']['result']['assign_user'];
            this.assignDelaerList=result['distributor_detail']['result']['assign_dealer'];
            this.assign_brand=result['distributor_detail']['result']['brand'];
            this.dealersCount=result['distributor_detail']['dealersCount'];
            this.assignUserId=this.assignUserList;
            this.temp_disc=this.dr_detail.discount_data;
            this.temp_checkin=this.dr_detail.checkin;
            
            console.log(this.dr_detail);
            
            this.getBrandList();
            
            this.salesUserLIst();
            this.dealer_list();
            this.discountList();
            setTimeout (() => {
                this.loader=false;
                
            }, 700);
            
        })
    }
    tmp_userList:any=[];
    salesUserLIst()
    {
        this.serve.fetchData(0,"User/sales_user_list")
        .subscribe((result)=>{
            console.log(result);
            this.asmList=result['sales_user_list'];
            this.tmp_userList=result['sales_user_list'];
            
            console.log(this.assignUser);
            
            for(let i=0;i<this.asmList.length;i++)
            {                
                for(let j=0;j<this.assignUserList.length;j++)
                {
                    if(this.asmList[i].id==this.assignUserList[j]['sales_executive'])
                    {
                        this.asmList[i].check=true;
                        this.rsm.push(this.asmList[i].id);
                        console.log(this.rsm);
                        
                    }
                }
                
            }
            console.log(this.assignUser);
        })
        
    }
    
    
    assign_to_distributor(id,index,e)
    {
        
        if(e.checked)
        {
            this.assignUserId.push(id);
            console.log(this.assignUserId);
            this.assignUser.push(this.asmList[index]);
            console.log(this.assignUserId);
            let value={'dr_id':this.dr_id,'data':this.assignUserId};
            console.log(value);
            
            this.serve.fetchData(value,"Distributors/user_assign")
            .subscribe((response)=>{
                console.log(response);
                
            })
        }
        else
        {
            console.log(this.asmList);
            console.log(index);
            var index_val = index;
            
            for( var j=0;j<this.assignUserId.length;j++)
            {
                if(this.asmList[index].id==this.assignUserId[j])
                {
                    this.assignUserId.splice(j,1);
                }
                
            }
            console.log(this.assignUserId);
            let value={'dr_id':this.dr_id,'data':this.assignUserId};
            console.log(value); 
            this.serve.fetchData({'dr_id':this.dr_id,'data':this.assignUserId},"Distributors/user_assign")
            .subscribe((response=>{
                console.log(response);
                
            }))
        }
        
    }
    
    removeUser(index)
    {
        this.assignUser.splice(index,1);
        this.assignUserId.splice(index,1);
    }
    
    discountList()
    {
        this.serve.fetchData(0,"Discount/discount_list").subscribe((result=>{
            console.log(result['Discount_list']['discount_list']);
            this.userDiscountList=result['Discount_list']['discount_list']
        }))
    }
    
    editDialog(value1,value2,type)
    {
        
        console.log(value1,value2,type);
        
        const dialogRef = this.dialog.open(UserEmailModalComponent, {
            width: '450px',
            data:{
                id:this.dr_id,
                value1,
                value2,
                type
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();
            
        });
    }
    search:any={};
    tmpsearch:any={};
    getItemsList(search)
    {
        console.log(search);
        
        this.asmList=[];
        for(var i=0;i<this.tmp_userList.length; i++)
        {
            search=search.toLowerCase();
            console.log(this.tmp_userList[i]['name']);
            
            this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase();
            if(this.tmpsearch.includes(search))
            {
                this.asmList.push(this.tmp_userList[i]);
            }     
        }    
        console.log(this.asmList);
        
    }
    
    
    search2:any={};
    tmpsearch2:any={};
    getItemsdisc(search)
    {
        console.log(search);
        
        this.dr_detail.discount_data=[];
        for(var i=0;i<this.temp_disc.length; i++)
        {
            search=search.toLowerCase();
            this.tmpsearch2=this.temp_disc[i]['category'].toLowerCase();
            if(this.tmpsearch2.includes(search))
            {
                this.dr_detail.discount_data.push(this.temp_disc[i]);
            }     
        }    
        console.log(this.dr_detail.discount_data);
        
    }
    editAddress(country,state,district,city,pincode,address,type)
    {
        console.log(country,state,district,city,pincode,address,type);
        console.log(this.dr_id);
        
        const dialogRef = this.dialog.open(DistributionEditComponent, {
            width: '768px',
            data:{
                country,
                state,
                district,
                city,
                pincode,
                address,
                type,
                id:this.dr_id
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();
            
            
        });
    }
    MobileNumber(event: any) 
    {
        console.log(event);
        
        const pattern = /[0-9\+\-\.\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if ( !pattern.test(inputChar)) 
        {event.preventDefault(); }
    }
    
    edit_dr_detail(company_name,mobile,email,gst,landline,name,dob,doa,password,type,target,opening_balance,Whatsapp,username)
    { 
        const dialogRef = this.dialog.open(DistributionEditComponent, {
            width: '750px',
            data:{
                company_name,
                mobile,
                email,
                gst,
                landline,
                name,
                dob,
                doa,
                password,
                username,
                type,
                id:this.dr_id,
                target,
                opening_balance,
                ledger_length:this.ledger_data.length,
                Whatsapp
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.retailerDetail();
            this.ledger_list();
        });
    }
    
    add_order_value()
    {
        console.log(this.dr_id);
        
        const dialogRef = this.dialog.open(AddPrimaryOrderValueComponent,{
            width: '750px',
            data:{ id:this.dr_id }
        });
        
        dialogRef.afterClosed()
        .subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.get_primary_ord();
        });
    }
    
    get_primary_ord()
    {
        this.loader=1;
        this.serve.fetchData({'dr_id':this.dr_id},"Distributors/get_primary_ord")
        .subscribe((result)=>
        {
            console.log(result);
            this.loader='';
            if(result)
            {
                this.primary_ord_data = result['get_primary_ord'];
            }
        });
    }
    editDiscount()
    {
        const dialogRef = this.dialog.open(UserEmailModalComponent, {
            width: '520px',
            data:{
                id:this.dr_id,
                'dealer_discount':this.dr_detail.dealer_discount,
                type:'DealerDiscountEdit'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.retailerDetail()
        });
    }
    sales_executive_update:any;
    
    update_assigned_sales_executive(sales_executive){
        this.sales_executive_update = sales_executive;
    }
    update_assigned_executive(exec_id)
    {
        console.log(this.rsm);
        console.log(this.asmList)
        
        this.serve.fetchData({'exec':this.rsm,'dr_id':this.dr_id},"Distributors/update_assigned_sales_executive")
        .subscribe((result=>{
            console.log(result);
            this.asmList = this.tmp_userList;
            this.asmList.map((el)=>{ el.check = false});
            
            if(this.rsm)
            {
                for(var i=0;i<this.rsm.length;i++)
                {
                    var index_val = this.asmList.map((el) => el.id).indexOf(this.rsm[i]);
                    console.log(index_val);
                    
                    this.asmList[index_val].check = !this.asmList[index_val].check;
                }
            }
            console.log(this.asmList);
            
            
            this.retailerDetail();
        }))
        this.sales_executive_update='';
        this.rout.navigate(['/distribution-detail/'+this.dr_id]);
        
    }
    temp_dis:any;
    
    discountedit(dr_id,discount){
        console.log(dr_id);
        this.temp_dis = discount;
    }
    disc_edit:any=false;
    
    
    
    
    edit_discount(i)
    {
        console.log(i);
        this.active[i] = Object.assign({'discount':'1'});
        console.log(this.active[i]);
        
    }
    list:any={};
    update_discount(category,id,discount){
        console.log(category,id,discount)
        this.serve.fetchData({'id':this.dr_id,'category':category,'dis':discount},"Distributors/update_discount")
        .subscribe((response=>{
            console.log(response);
            this.active={};
            this.retailerDetail();
        }));
    }
    view_tab:any='profile';
    related_tabs(tab){
        console.log(tab);
        this.view_tab=tab;
        
    }
    view_order:any='primary';
    order_filter(type){
        this.view_order = type;
        if(type=='primary'){
            this.order_data=this.dr_detail['primary_order'];
            this.temp_order=this.order_data;
            console.log(type);
            
        }
        if(type=='secondary'){
            console.log(type);
            
            this.order_data=this.dr_detail['secondary_order'];
            this.temp_order=this.order_data;
        }
    }
    
    
    
    
    search3:any={};
    tmpsearch3:any={};
    getItemscheckin(search)
    {
        console.log(search);
        
        this.dr_detail.checkin=[];
        for(var i=0;i<this.temp_checkin.length; i++)
        {
            search=search.toLowerCase();
            this.tmpsearch3=this.temp_checkin[i]['exec_name'].toLowerCase();
            if(this.tmpsearch3.includes(search))
            {
                this.dr_detail.checkin.push(this.temp_checkin[i]);
            }     
        }    
        console.log(this.dr_detail.checkin);
        
    }
    search4:any={};
    tmpsearch4:any={};
    getItemsorder(search)
    {
        console.log(search);
        
        this.order_data=[];
        for(var i=0;i<this.temp_order.length; i++)
        {
            search=search.toLowerCase();
            this.tmpsearch4=this.temp_order[i]['id'].toLowerCase();
            if(this.tmpsearch4.includes(search))
            {
                this.order_data.push(this.temp_order[i]);
            }     
        }    
        console.log(this.order_data);
        
    }
    tmpsearch5:any={};
    getItemsorder1(search)
    {
        console.log(search);
        
        this.order_data=[];
        for(var i=0;i<this.temp_order.length; i++)
        {
            search=search.toLowerCase();
            this.tmpsearch5=this.temp_order[i]['company_name'].toLowerCase()
            if(this.tmpsearch5.includes(search))
            {
                this.order_data.push(this.temp_order[i]);
            }     
        }    
        console.log(this.order_data);
        
    }
    tmpsearch6:any={};
    getItemsorder2(search)
    {
        console.log(search);
        
        this.order_data=[];
        for(var i=0;i<this.temp_order.length; i++)
        {
            search=search.toLowerCase();
            this.tmpsearch6=this.temp_order[i]['created_by_name'].toLowerCase()
            if(this.tmpsearch6.includes(search))
            {
                this.order_data.push(this.temp_order[i]);
            }     
        }    
        console.log(this.order_data);
        
    }
    rsm:any=[];
    ass_user:any=[];
    product_Brandassign(value,index,event)
    {
        if(event.checked)
        {
            if(this.rsm.indexOf(this.asmList[index]['id']) === -1) {
                
                this.rsm.push(value);
                console.log(this.rsm);
            }
        }
        else
        {
            for( var j=0;j<this.asmList.length;j++)
            {
                if(this.asmList[index]['id']==this.rsm[j])
                {
                    this.rsm.splice(j,1);
                }
            }
            console.log(this.rsm);
        }
        this.ass_user =  this.rsm
        
    }
    // rsm:any=[];
    // ass_user:any=[];
    product_Brand(value,index,event)
    {
        if(event.checked)
        {
            if(this.rsm.indexOf(this.asmList[index]['id']) === -1) 
            {
                this.rsm.push(value);
                console.log(this.rsm);
            }
        }
        else
        {
            for( var j=0;j<this.asmList.length;j++)
            {
                if(this.asmList[index]['id']==this.rsm[j])
                {
                    this.rsm.splice(j,1);
                }
            }
            console.log(this.rsm);
        }
        this.ass_user =  this.rsm
    }  
    
    
    assign_dealer:any=[];
    select_dealer(data,event)
    {
        console.log(this.assign_dealer);
        
        if(data.check)
        {
            this.assign_dealer.push(data)
        }
        else
        {
            let index = this.assign_dealer.findIndex(row=>row.id == data.id);
            
            this.assign_dealer.splice(index,1);
        }
        console.log(this.assign_dealer);
    }
    
    
    save_assign_dealer()
    {
        console.log(this.assign_dealer)
        this.loader = true;
        this.serve.fetchData({'dealer_list':this.assign_dealer,'dr_id':this.dr_id},"Distributors/assign_dealer")
        .subscribe((result=>{
            console.log(result);
            
            if(result['msg'] == 'success')
            {
                this.active.dealer = false;
                this.retailerDetail();
                // this.dealer_list();
                this.loader = false;
                this.toast.successToastr("Dealers Updated");
            }
        }))
    }
    
    
    brand1:any=[];
    product_Brand1(value,index,event)
    {
        if(event.checked)
        {
            this.brand1.push(value);
            console.log(this.brand1);
            this.serve.fetchData({'brand':this.brand1,'dr_id':this.dr_id},"Distributors/dr_brand_update").subscribe((result=>{
                console.log(result);
                this.toast.successToastr("Brands Updated");
            }))
            
        }
        else
        {
            console.log('in');
            
            for( var j=0;j<this.brand_list1.length;j++)
            {
                console.log('in');
                if(this.brand_list1[index].brand_name==this.brand1[j])
                {
                    this.brand1.splice(j,1);
                    this.serve.fetchData({'brand':this.brand1,'dr_id':this.dr_id},"Distributors/dr_brand_update").subscribe((result=>{
                        console.log(result);
                        this.toast.successToastr("Brands Updated");
                    }))
                }
            }
            console.log(this.brand1);
        }
        
        
    }
    getBrandList()
    {
        this.serve.fetchData(0,"/Product/product_brand_list/")
        .subscribe((result)=>{
            console.log(result);
            this.brand_list1=result;
            console.log(this.brand_list1);
            console.log(this.assign_brand);
            
            for(let i=0;i<this.brand_list1.length;i++)
            {
                for(let j=0;j<this.assign_brand.length;j++)
                {
                    console.log(this.assign_brand[j]);
                    if(this.brand_list1[i].brand_name==this.assign_brand[j]['brand'])
                    {
                        console.log(this.assign_brand[j]['brand']);
                        this.brand_list1[i].check=true;
                        this.brand1.push(this.brand_list1[i].brand_name);
                        console.log(this.brand1);
                        
                    }
                }
                console.log(this.brand1);
                
            }
        });
    }
    
    
    convert_dr(type){

        this.alert.confirm("Convert").then((result) => {
            if(result)
            {
                console.log(type);
                this.serve.fetchData({type:type,dr_id:this.dr_id},"Category_master/sendOtp").subscribe((result=>{
                    console.log(result);
                   
                    const dialogRef = this.dialog.open(DisOtpVarificationComponent, {
                        width: '350px',
                        data:{
                            id:this.dr_id,
                            type:type,
                            otp:result
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        console.log('The dialog was closed');
                        
                    });
                }))
                // console.log(type);
                // this.serve.fetchData({type:type,dr_id:this.dr_id},"Category_master/dr_type_update").subscribe((result=>{
                //     console.log(result);
                //     if(type == 1){
                //         this.rout.navigate(['/distribution-list']);
                //     }
                //     if(type==7){
                //         this.rout.navigate(['/direct-dealer']);
                        
                //     }
                   
                // }))
            }
        });

        
        
    }
    
    deleteOrder(id,i)
    {
        console.log(id);
        
        this.alrt.delete('Order Data').then((result) => {
            if(result)
            {
                this.serve.fetchData({id},"order/directOrderdelete")
                .subscribe((response)=>
                {
                    if(response)
                    {
                        this.primary_ord_data.splice(i,1);
                        this.get_primary_ord();
                    }
                    
                })
            }
            
        });
        
    }
    
    add_ledger(type)
    {
        const dialogRef = this.dialog.open(DistributionLegderModelComponent, {
            width: '520px',
            data:{
                id:this.dr_id,
                type
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
            this.ledger_list();
            
        });
    }
    
    ledger_list()
    {
        this.serve.fetchData({dr_id:this.dr_id},"DistributionNetwork/ledger_list")
        .subscribe((result)=>
        {
            console.log(result);
            this.ledger_data = result['ledger_list'];
        });
    }
    
    deleteUser(id)
    {
        this.alrt.delete('Ledger Data !').then((result) => {
            if(result){
                this.serve.fetchData({id:id,dr_id:this.dr_id},"DistributionNetwork/delete_ledger")
                .subscribe((result)=>
                {
                    console.log(result);
                    this.ledger_list();
                    this.retailerDetail();
                });
            }
        })
    }
    
    delete_cp_order(order_id)
    {
        this.alrt.delete('Order Data').then((result) => {
            if(result)
            {
                this.serve.fetchData({order_id:order_id},"Order/delete_channel_partner_ord")
                .subscribe((result)=>
                {
                    console.log(result);
                    this.ledger_list();
                    this.retailerDetail();
                });
            }
            
        });
    }
    getDealersData()
    {
        console.log(this.dr_id);
        this.loader = true;
        
        this.serve.fetchData({id:this.dr_id},"Distributors/getDealersData")
        .subscribe((result)=>
        {
            console.log(result);
            this.assignedDealers = result['dr_list']
            this.loader = false;
            
        },err=>
        {
            this.loader = false;
            
        });
    }
    assignedExecutives:any=[]
    getExecutivesData()
    {
        console.log(this.dr_id);
        this.loader = true;
        
        this.serve.fetchData({id:this.dr_id},"Distributors/getExecutivesData")
        .subscribe((result)=>
        {
            console.log(result);
            this.assignedExecutives = result['user']
            this.loader = false;
            
        },err=>
        {
            this.loader = false;
            
        });
    }

    disExecutive(type,userId)
    {
        const dialogRef = this.dialog.open(DisExecutiveModelComponent, {
            width: '800px',
            data:{type:type , userId:userId}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getExecutivesData();
        });
    }

    openDiscountModal(dealerId)
    {
        console.log(dealerId);
        
        const dialogRef = this.dialog.open(DrDiscountComponent, {
            width: '800px',
            data:{
                dealerId : dealerId
            }});
            dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                console.log('The dialog was closed');
                this.getDealersData()
            });
            
            
            
        }
        //dashboard code start
        // order_data:any=[];
      
        order_dashboard(){
          console.log('test');
          this.serve.fetchData({id:this.dr_id},"Order/dashboard_order_dr").subscribe((result=>{
            console.log(result);
            this.orderdata=result;
            //       console.log(this.orderdata);
            // for(let i =0;i<10;i++){
            // this.order_data.cat.i=this.orderdata.cat.i;
            // this.order_data.amount.i=this.orderdata.amount.i;
            // }
            //       console.log(this.order_data);
            this.order_data.cat=this.orderdata.cat.slice(1,2,3,4,5,6,7,8,9);
            this.order_data.amount=this.orderdata.amount.slice(1,2,3,4,5,6,7,8,9);
            console.log(this.order_data);
            
            
            
            this.barChartLabels = this.orderdata.cat;
            this.barChartType = 'bar';
            this.barChartLegend = true;
            // public barChartPlugins = [pluginDataLabels];
            
            this.barChartData = [
              { data: this.orderdata.amount, label: 'Order Value' },
              // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
            ];
            
          }))
        }
        public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
            console.log(event, active);
          }
          
          public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
            console.log(event, active);
          }
          
          
          public barChartOptions: ChartOptions = {
            responsive: true,
            // We use these empty structures as placeholders for dynamic theming.
            scales: { xAxes: [{}], yAxes: [{}] },
            plugins: {
              datalabels: {
                anchor: 'end',
                align: 'end',
              }
            }
          };
          
          
          
          
          public randomize(): void {
            // Only Change 3 values
            const data = [
              Math.round(Math.random() * 100),
              59,
              80,
              (Math.random() * 100),
              56,
              (Math.random() * 100),
              40];
              
              
              this.barChartData[0].data = data;
            }
            
        count_data(){
            console.log('test');
            this.serve.fetchData({id:this.dr_id},"Distributors/count_data_dr").subscribe((result=>{
              console.log(result);
              this.dashboardCounts=result;
              console.log(this.dashboardCounts);
              
            //   this.user_filter();
              
            }))
          }
//           tmp:any=[];
//   user_list:any=[];
//           user_filter(){
//             console.log(this.dashboardCounts);
//             for(let i=0;i<this.dashboardCounts['user_data'].length;i++){
//               this.tmp=this.dashboardCounts.user_data[i]['user_type'];
              
//               if(this.tmp.includes('MARKET'))
//               {
//                 this.user_list.push(this.dashboardCounts.user_data[i]);  
//               }  
//             }
//           }
          
    }
    