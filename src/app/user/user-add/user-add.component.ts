import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  animations: [slideToTop()]
  
})
export class UserAddComponent implements OnInit {
  
  constructor(public serve:PearlService,public rout:Router) {
    this.getStateList();
    this.get_sales_user_type();
   }

   state_list:any=[];
   state:any=[];
   rsm_list:any;
   data:any={};
   district_list:any=[];
   city_list:any=[];
   area_list:any=[];
   pinCode_list:any=[];
   isslected;
   user_type;
   usertype=true;
   basicdetails=false;
   userrole;
  ngOnInit() {
    // this.rsmassign();
    this.userType('MARKET')
  
  }



  
  active:any = {};
  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}

    console.log(this.active);
  }


  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }



  userType(usertype)
  {

    this.user_type=usertype.value
    console.log(this.user_type); 
       
    if(this.user_type)
    {
      this.data.user_type=this.user_type;
      console.log(this.data.user_type);
      this.basicdetails=true;
    }
  }

  submitDetail()
  {
    this.data.assignuser = this.ass_user;
    console.log(this.data);
      this.serve.fetchData(this.data,"User/add_user").subscribe((response=>{
      console.log(response);  

     
        this.rout.navigate(['/sale-user-list']); 
      
    }));
  }
  // rsmassign(){
  //   this.serve.fetchData('',"User/rsm_list").subscribe(response=>{
  //     console.log(response);
  //     this.rsm_list=response['rsm_list'];
  //   });

  // }

  getStateList()
  {
    console.log("addUser");
    this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state=response['query'];
      this.state_list=this.state['state_name'];
      console.log(this.state_list);
      
            
    }));
    
  }
    getDistrict()
    {
      console.log(this.data.state);
      this.serve.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
        // console.log(response);
        this.district_list=response['query']['district_name'];
        console.log(this.district_list);
        
      }));
        
    }

    getCityList()
    {
      console.log(this.data.district);
      let value={"state":this.data.state,"district":this.data.district}
      this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
        console.log(response);
        this.city_list=response['query']['city'];
        console.log(this.city_list);
        
      }));
    }

   getPinCodeList()
    {
      console.log(this.data.state,this.data.city,this.data.district);
      let value={"state":this.data.state,"district":this.data.district,"city":this.data.city}
      this.serve.fetchData(value,"User/pincode_user_list").subscribe((response=>{
        console.log(response);
        this.pinCode_list=response['query']['pincode'];
        console.log(this.pinCode_list);
        
      }));
    }
    sales_type:any =[];
    get_sales_user_type()
    {
      // console.log(this.data.state,this.data.city,this.data.district);
      // let value={"state":this.data.state,"district":this.data.district,"city":this.data.city}
      this.serve.fetchData({},"User/sales_type").subscribe((response=>{
        console.log(response);
        console.log(response['sales']);

        this.sales_type=response['sales'];
        console.log(this.sales_type);
        
      }));
    }
    reporting_sales_type:any=[];
    getreporting_users(user_type){
      console.log(user_type);
      this.serve.fetchData({'user_type':user_type},"User/reportingsales_type").subscribe((response=>{
        console.log(response);
      

        this.reporting_sales_type=response['reportingsales_type'];
        console.log(this.reporting_sales_type);
        
      }));
    }

    assign_users(usertype){
      this.serve.fetchData({'user_type':usertype},"User/assign_users").subscribe((response=>{
        console.log(response);
      

        this.rsm_list=response['assign_users'];
        console.log(this.rsm_list);
        this.tmp_userList = this.rsm_list;
      }));
    }
rsm:any=[];
ass_user:any=[];
    product_Brand(value,index,event)
    {
      if(event.checked)
      {
        this.rsm.push(value);
        console.log(this.rsm);
        
      }
      else
      {
            for( var j=0;j<this.rsm_list.length;j++)
            {
              if(this.rsm_list[index]['id']==this.rsm[j])
              {
                this.rsm.splice(j,1);
              }
            }
          console.log(this.rsm);
      }
     this.ass_user =  this.rsm
      
    }
    tmp_userList:any=[];

  search:any={};
tmpsearch:any={};
getItemsList(search)
{
  console.log(search);
  
  this.rsm_list=[];
  for(var i=0;i<this.tmp_userList.length; i++)
  {
    search=search.toLowerCase();
    this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase() + ' '+ this.tmp_userList[i]['role_name'].toLowerCase();
    if(this.tmpsearch.includes(search))
    {
      this.rsm_list.push(this.tmp_userList[i]);
    }     
  }    
  console.log(this.rsm_list);
  
}
  

}
