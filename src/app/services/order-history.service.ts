import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private baseUrl = environment.resourceApiUrl+'/orders';


  constructor(private httpClient: HttpClient) { }

  getOrderHistory(userEmail: string): Observable<GetResponseOrderHistory> {

    const url = `${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(url);
  }
}

interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[]
  }
}
