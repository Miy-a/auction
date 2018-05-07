import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService, Product , Comment} from "../shared/product.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  formModel:FormGroup; // 类型

  categories: string[];

  constructor(private productService:ProductService) {

    // 对应表单的3个字段
    let fb = new FormBuilder(); // 简化构造数据模型的代码
    this.formModel = fb.group({
      title: ['',Validators.minLength(3)], // alidators.minLength(3)，angular提供的默认校验器
      price: [null, this.positiveNumberValidator], // 自定义校验器positiveNumberValidator
      category: ['-1']
    })
  }

  ngOnInit() {
    this.categories = this.productService.getAllCategories();
  }

  positiveNumberValidator(control: FormControl): any { // 接受一个control，类型是FormControl
    if(!control.value){
      return null; // 返回null，就说明校验成功
    }
    let price = parseInt(control.value);

    if(price>0) {
      return null;//返回null，就说明校验成功
    }else{
      return {positiveNumber: true};//除了返回null以外的其他值，都是说明校验失败，
    }
  }

  onSearch() {
    if(this.formModel.valid) {
      console.log(this.formModel.value);
    }
  }
}
