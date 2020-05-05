import { Component, OnInit } from '@angular/core';
import { State } from '../../../game/data/state';
import { tuple } from 'simple-structures';
import {
  COMBAT_STATS,
  GATHERING_STATS,
  ARTISAN_STATS,
  SUPPORT_STATS,
} from 'src/game/shared';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public get name() {
    return State.get().player.name;
  }

  public get threat() {
    return State.get().player.threat;
  }

  public get stats() {
    const stats = State.get().player.stats;

    const combat = this.split(
      COMBAT_STATS.map((k) =>
        tuple(this.icon(k), this.ucfirst(k), this.romanize(stats[k].level))
      )
    );

    const gathering = this.split(
      GATHERING_STATS.map((k) =>
        tuple(this.icon(k), this.ucfirst(k), this.romanize(stats[k].level))
      )
    );

    const artisan = this.split(
      ARTISAN_STATS.map((k) =>
        tuple(this.icon(k), this.ucfirst(k), this.romanize(stats[k].level))
      )
    );

    const support = this.split(
      SUPPORT_STATS.map((k) =>
        tuple(this.icon(k), this.ucfirst(k), this.romanize(stats[k].level))
      )
    );

    return { combat, gathering, artisan, support };
  }

  private split<T>(arr: T[]) {
    const part2 = arr;
    const part1 = part2.splice(0, Math.ceil(part2.length / 2));
    return [part1, part2];
  }

  private icon(k: string) {
    return `./assets/interactions/${k}.svg`;
  }

  private ucfirst(k: string) {
    return k.charAt(0).toUpperCase() + k.slice(1);
  }

  public romanize(num: number) {
    if (isNaN(num)) return '';
    const digits = String(+num).split('');
    const key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ];
    let roman = '';
    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  }
}
