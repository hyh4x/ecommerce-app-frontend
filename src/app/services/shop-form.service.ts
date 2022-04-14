import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl: string = environment.resourceApiUrl+'/countries';
  private statesUrl: string = environment.resourceApiUrl+'/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for(let month = startMonth; month <= 12; month++){
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear+10;

    for(let year = startYear; year <= endYear; year++){
      data.push(year);
    }

    return of(data);
  }

  getCountriesList(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStatesByCountryCode(code: string): Observable<State[]> {
    const url = `${this.statesUrl}/search/findByCountryCode?code=${code}`;
    return this.httpClient.get<GetResponseState>(url).pipe(
      map(response => response._embedded.states)
    );
  }
}

interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}