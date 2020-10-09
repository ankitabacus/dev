import { Component } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { urlToNavGroupStrings } from 'ionic-angular/umd/navigation/url-serializer';
import { AddLeadsPage } from '../sales-app/add-leads/add-leads';

/**
 * Generated class for the ConvertLeadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-convert-lead',
  templateUrl: 'convert-lead.html',
})
export class ConvertLeadPage {
data: any={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConvertLeadPage');
  }
  submit(){
  

   
     this.navCtrl.push(AddLeadsPage, {leadType: this.data.leadType})
    
  
  }
  close(){

    this.viewCtrl.dismiss();
      
    
  }
}
