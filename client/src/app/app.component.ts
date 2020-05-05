import { Component, OnInit } from '@angular/core';
import { main } from '../game/main';
import { Inventory } from '../game/ui/gui/inventory';
import { Equipement } from './../game/ui/gui/equipement';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  stats = false;

  ngOnInit(): void {
    const name = Math.random().toString(36).substring(7);
    main(name, 'admin', {
      sex: 'male',
      skin: 'olive',
      eyes: 'blue',
      hair: 'messy1',
      hairColor: 'white-cyan',
      facialHair: '',
      ears: '',
      nose: '',
    });
  }

  login() {}

  toggleStats() {
    this.stats = !this.stats;
    Equipement.hide();
    Inventory.hide();
  }

  toggleInventory() {
    this.stats = false;
    Equipement.hide();
    Inventory.toggle();
  }

  toggleEquipement() {
    this.stats = false;
    Equipement.toggle();
    Inventory.hide();
  }
}
