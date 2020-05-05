import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StatsComponent } from './components/stats/stats.component';
import { InventoryComponent } from './components/inventory/inventory.component';

@NgModule({
  declarations: [AppComponent, StatsComponent, InventoryComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
