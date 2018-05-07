import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../shared/product.service";
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  formModel: FormGroup; // 类型

  categories: any;
  sexes: any;

  constructor(private productService: ProductService) {

    // 对应表单的3个字段
    let fb = new FormBuilder(); // 简化构造数据模型的代码
    this.formModel = fb.group({
      title: [
        '',
        [this.titleValidator, Validators.required]
      ],
      price: [
        null,
        [
          this.positiveNumberValidator,
          Validators.required
        ]
      ],
      category: [
        '0',
        [this.categoryValidator]
      ],
      sex: [
        this.sexes,
        [Validators.required]
      ]
    });
  }

  formErrors = {
    'title': '',
    'price': '',
    'category': '',
    'sex': ''
  };

  validationMessages = {
    'title': {
      'titleValidator': '用户名格式不正确',
      'required': 'yonghuming不能为空'
    },
    'price': {
      'positiveNumberValidator': '价格必须大于0',
      'required': '价格必填'
    },
    'category': {
      'categoryValidator': 'category不能为空'
    },
    'sex': {
      'required': 'sex不能为空'
    }
  };

  onValueChanged(data?: any) {
    console.log(this.formModel);
    if (!this.formModel) {
      return;
    }
    const form = this.formModel;

    for (const field in this.formErrors) {
      this.formErrors[field] = ''; // 清空上一次的错误信息
      const control = form.get(field); // 调用FormGroup的get方法得到某一个需要校验的表单字段
      if (control && control.touched  && !control.valid) { // 给验证不合格的字段赋错误信息值
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  ngOnInit() {
    this.formModel.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.categories = this.productService.getAllCategories();
    this.sexes = this.productService.getAllSexes();
  }

  positiveNumberValidator(control: FormControl): any { // 接受一个control，类型是FormControl
    if (!control.value) {
      return null; // 返回null，就说明校验成功
    }
    const price = parseInt(control.value);

    if (price > 0) {
      return null; // 返回null，就说明校验成功
    } else {
      return {positiveNumberValidator: {valid: false}}; // 除了返回null以外的其他值，都是说明校验失败，
    }
  }

  titleValidator(control: FormControl): any {
    if (!control.value) {
      return null;
    }
    const title = control.value;
    const validateCode = '^[a-zA-Z0-9_-]{4,16}$';
    if (title.match(validateCode)) {
      return null;
    } else {
      return {
        titleValidator: true
    }
      ;
    }
  }

  categoryValidator(control: FormControl):any {
    if (!control.value) {
      return null;
    }
    const category = control.value;
    if (category == 0) {
      return {
        categoryValidator: {valid: false}
      };
    }
  }
  onSearch() {
    if (this.formModel.valid) {
      console.log(this.formModel.value);
    } else {
      this.onValueChanged();
    }
  }
}
