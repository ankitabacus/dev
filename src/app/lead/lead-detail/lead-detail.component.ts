import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute ,Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { MatDialog } from '@angular/material';
import { EditleadComponent } from 'src/app/editlead/editlead.component';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  animations: [slideToTop()]
})
export class LeadDetailComponent implements OnInit {

  asmList:any=[];
  assignUserList:any=[];
  assignUser:any=[];

  lead_id:any;
  active:any={};

  lead_detail:any=[];
  sales_executive_update: any;
  constructor(public route:ActivatedRoute,public serve:PearlService,public router :Router ,public dialog: MatDialog,public alert:DialogComponent) {

    this.route.params.subscribe( params => {
      console.log(params);
      this.lead_id = params.id;
      console.log(this.lead_id);
      
      });
    this.leadDetail();

      this.salesUserLIst();
   }

  ngOnInit() {
  }
  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}

    console.log(this.active);
  this.salesUserLIst()

  }
  loader:any;

  leadDetail()
  {
    this.loader=1;
    
    this.serve.fetchData({'id':this.lead_id},"Distributors/distributor_detail").subscribe((result=>{
      console.log(result);
      this.lead_detail=result['distributor_detail']['result'];
      this.assignUserList=result['distributor_detail']['result']['assign_user'];
      console.log(this.assignUserList);
      setTimeout (() => {
        this.loader='';
        
    }, 700);
    }))
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
    this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase();
    if(this.tmpsearch.includes(search))
    {
      this.asmList.push(this.tmp_userList[i]);
    }     
  }    
  console.log(this.asmList);
  
}
  tmp_userList:any=[];
  salesUserLIst()
  {
      this.serve.fetchData(0,"User/sales_user_list").subscribe((result=>{
      console.log(result);
      this.asmList=result['sales_user_list'];
        this.tmp_userList=this.asmList;
      console.log(this.assignUserList);
      
      
    //   for(let i=0;i<this.asmList.length;i++)
    //   {

    //     for(let j=0;j<this.assignUserList.length;j++)
    //     {
    //       if(this.asmList[i].id==this.assignUserList[j])
    //       {
    //         this.asmList[i].check=true;
    //         this.assignUser.push(this.asmList[i]);
    //         console.log(this.asmList[i].check);
            
    //       }
    //     }
        
    //   }
    //   console.log(this.assignUser);
    // }))
    console.log(this.assignUserList);

    // console.log(this.assignUserList[0]);
    
    
    for(let i=0;i<this.asmList.length;i++)
    {
      console.log('in')
      console.log(this.assignUserList)

      for(let j=0;j<this.assignUserList.length;j++)
      {
      console.log('in2')

        if(this.asmList[i].id==this.assignUserList[j]['sales_executive'])
        {
      console.log('in23')

          this.asmList[i].check=true;
          this.rsm.push(this.asmList[i].id);
          console.log(this.rsm);
          
        }
        console.log(this.rsm);

      }
      
    }
    console.log(this.assignUser);
  }))
  
    
  }
  editDilog(value,type)
  {
    console.log("hello");
    
    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '350px',
         data:{
           value,
           type,
           id:this.lead_id
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
    this.leadDetail();
      
       
    });
  }

  editAddress(country,state,district,city,pincode,address,type)
  {
    console.log(country,state,district,city,pincode,address,type);
    console.log("hello");
    
    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '750px',
         data:{
          country,
           state,
           district,
           city,
           pincode,
           address,
           type,
           id:this.lead_id
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
    // this.userDetail();
    this.leadDetail();

      
       
    });
  }

  editContact(id,type)
  {
    console.log(id,type);
    
    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '750px',
         data:{
           type,
           id
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
    this.leadDetail();
      
       
    });
  }
  
  addContact(id,type)
  {
    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '750px',
         data:{
           type,
           id
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
    // this.userDetail();
      
       
    });
  }

  deleteContact()
  {
    this.alert.delete('Lead Data !').then((result) => {
      if(result)
      {
        console.log("sucess");
        
        // console.log(id);
        // this.serve.fetchData({"id":id},"Distributors/distributors_delete").subscribe((result=>{
        //   console.log(result);
        //   if(result)
        //   {
        //     this.leadList();
        //   }
        // }))
      }
    })
  }
  confirm_lead(id)
  {
    this.alert.confirm('').then((result) => {
      if(result){
        // console.log(type);
    this.serve.fetchData(id,"Distributors/confirm_lead").subscribe((result=>{
      console.log(result);
      if(this.lead_detail.type==1)
      {
        this.router.navigate(['lead-list']);
      }else{
        this.router.navigate(['dealer-lead-list']);

      }
    }))
  }});
  }
  update_assigned_sales_executive(sales_executive){
    this.sales_executive_update = sales_executive;

  }
  update_assigned_executive(exec_id){
    console.log(this.lead_id);
    console.log(this.ass_user);
    this.serve.fetchData({exec:this.ass_user,dr_id:this.lead_id},"Distributors/update_assigned_sales_executive").subscribe((result=>{

      
      this.leadDetail();


    }))
    this.sales_executive_update='';

  }
  rsm:any=[];
ass_user:any=[];
product_Brand(value,index,event)
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


}
