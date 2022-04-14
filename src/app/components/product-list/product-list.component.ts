import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  previousKeyword: string = '';
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  } 

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!.trim();

    this.resetPageNumberForDifferentKeyword(theKeyword);

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, theKeyword)
        .subscribe(this.processResult());
  }

  handleListProducts() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //default category id
      this.currentCategoryId = 1;
    }

    //reset page number if category is changed
    this.resetPageNumberForDifferentCategory();

    this.productService.getProductListPaginate(this.pageNumber - 1,this.pageSize, this.currentCategoryId)
          .subscribe(this.processResult());
  }

  updatePageSize(pageSize: number){
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }

  private resetPageNumberForDifferentCategory() {
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
  }

  private resetPageNumberForDifferentKeyword(theKeyword: string) {
    if (this.previousKeyword != theKeyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = theKeyword;
  }

  private processResult(){
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
