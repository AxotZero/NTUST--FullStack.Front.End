import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
declare let $: any;

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  Product;
  Quantity = 1;
  get Index() {
    return this.route.snapshot.params['i'];
  }
  relatedProducts = [{}];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              public dataService: DataService,
              private httpClient: HttpClient) {
    this.init();
  }
  ngOnInit() {
    this.init();
  }

  change(n) {
    this.router.navigate(['/catalog/product-view', n]);
    setTimeout(() => {
      this.init();
    }, 50);
  }

  init() {
    this.dataService.getProduct(this.Index).subscribe(data => {
      this.Product = data;
    });
    this.dataService.getProducts().subscribe((data: any) => {
      const l = data.length;
      this.relatedProducts[0] = data[(this.Index - 3 + l) % l];
      this.relatedProducts[1] = data[(this.Index - 2 + l) % l];
      this.relatedProducts[2] = data[(this.Index ) % l];
      this.relatedProducts[3] = data[(this.Index + 1) % l];
      this.js();
    });
  }

  js() {
    $('#list_product').carouFredSel({
      prev: '#prev_c1',
      next: '#next_c1',
      scroll: 1,
      auto: false,
      swipe: {
          onMouse: true,
          onTouch: true}
  });
  }

  addToCart(e) {

    if (this.Quantity < 1 || this.Quantity % 1 !== 0) {
      alert('Quantity must be integer and greater than 1');
      this.Quantity = 1;
      return;
    }
    if (this.authService.isLogin()) {
      const info = {
        user_id: this.dataService.User.id,
        product_id: e.id,
        quantity: this.Quantity
      };
      const user_exp = this.dataService.User.exp;
      if (e.level_id === 1) {
        if (user_exp < 20000) { alert('你買不起啦，你層次太低 ~!');  return; }
      } else if (e.level_id === 2) {
        if (user_exp < 3000) { alert('你買不起啦，你層次太低 ~!'); return; }
      } else if (e.level_id === 3) {
        if (user_exp < 500) { alert('你買不起啦，你層次太低 ~!');  return; }
      } else if (e.level_id === 4) {
        if (user_exp < 100) { alert('你買不起啦，你層次太低 ~!'); return; }
      }
      this.httpClient.post('http://localhost:8000/api/shopping_carts', info, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).subscribe((data: any) => {
        if ( data.success) {
          alert('Adding Successfully');
          this.dataService.getTotalPrice();
        }});
    } else {
      alert('Please Login');
      this.router.navigate(['/login']);
    }
  }
}
