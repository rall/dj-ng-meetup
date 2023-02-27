import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LineComponent } from './mapper/line/line.component';
import { RiskComponent } from './mapper/risk/risk.component';
import { MapperComponent } from './mapper/mapper.component';
import { ControlComponent } from './mapper/control/control.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  declarations: [AppComponent, LineComponent, RiskComponent, MapperComponent, ControlComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
