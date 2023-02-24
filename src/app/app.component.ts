import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import {
  delay,
  tap,
  map,
  merge,
  Subject,
  combineLatest,
  filter,
  share,
  switchMap,
  withLatestFrom,
  startWith,
  take,
  ReplaySubject,
  BehaviorSubject,
} from 'rxjs';

type MCAParams = Params & { username: string };

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  fruitForm = this.fb.group({
    name: ['', Validators.required],
    fruit: ['', Validators.minLength(6)],
    date: [''],
  });

  submitSubject = new Subject<void>();

  // prettier-ignore
  private validFruit$ = this.fruitForm.statusChanges.pipe(
    map((status) => status === 'VALID'),
    filter(Boolean),
  );

  // prettier-ignore
  fruit$ = this.fruitForm.get('fruit').valueChanges.pipe(
    startWith("pomegranate"),
    map((fruit) => `it's a ${fruit}`),
  );

  //prettier-ignore
  fruitSubmit$ = this.submitSubject.pipe(
    withLatestFrom(this.fruit$, (_, fruit) => fruit),
    tap({
      next: (n) => console.log(Date.now(), n),
      error: (e) => console.error(`uh oh something went wrong`, e),
      complete: () => console.error('combinatation completed'),
    }),
    take(1),
    share(),
  )

  fruitSubject = new Subject();

  ngOnInit() {
    this.fruitSubmit$.subscribe(this.fruitSubject);

    this.fruitSubmit$.subscribe((next) => {
      console.log(`first op: ${next}`);
      //
      // operation
      //
    });

  }
}
