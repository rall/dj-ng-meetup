import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export type Coordinates = [ number, number ]

@Injectable()
export class CoordinateService {
  coordinates = new ReplaySubject<Coordinates>(1)

}
