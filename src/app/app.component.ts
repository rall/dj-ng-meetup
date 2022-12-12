import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, delay, tap } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  fruitForm = this.fb.group({
    name: ['', Validators.required],
    fruit: [''],
    date: [''],
  });

  ngOnInit() {
    this.fruitForm.statusChanges.subscribe(console.log);
  }
}
