import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, switchMap } from 'rxjs';

interface RiskOrControl {
  name: string
  id: string
  type: 'risk' | 'control'
}

export interface Risk extends RiskOrControl {}
export interface Control extends RiskOrControl {}
export type Stripe = {
  riskId: string
  controlId: string
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
    return this.http.get<Stripe[]>(`${this.url}/stripes`).pipe(
      switchMap(stripes => from(stripes))
    )
  }
}
