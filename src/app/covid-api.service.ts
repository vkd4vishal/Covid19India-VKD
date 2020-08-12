import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  constructor(private http: HttpClient) { }  
  
  getStateCodes(){
    return this.http.get('https://api.covid19india.org/state_district_wise.json');
  }
  getStateCases(){
    return this.http.get('https://api.covid19india.org/v4/data.json');
  }
}
