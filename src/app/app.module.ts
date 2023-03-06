import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LineComponent } from './mapper/line/line.component';
import { MapperComponent } from './mapper/mapper.component';
import { MappableItemComponent } from './mapper/mappable-item/mappable-item.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  declarations: [AppComponent, LineComponent, MappableItemComponent, MapperComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
