import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog-product',
  templateUrl: './catalog-product.component.html',
  styleUrls: ['./catalog-product.component.css']
})
export class CatalogProductComponent implements OnInit {

  Active;

  constructor() { this.Active = 0; }

  ngOnInit() {
  }

}
