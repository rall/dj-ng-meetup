import { HttpClient, ɵHttpInterceptorHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface RiskOrControl {
  name: string
  id: number
}

export interface Risk extends RiskOrControl {}
export interface Control extends RiskOrControl {}
export interface Stripe {
  riskId: number
  controlId: number
}

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  readonly url: string = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  get risks() {
    return this.http.get<Risk[]>(`${this.url}/risks`)
  }

  get controls() {
    return this.http.get<Control[]>(`${this.url}/controls`)
  }

  get stripes() {
    return this.http.get<Stripe[]>(`${this.url}/stripes`)
  }
}
