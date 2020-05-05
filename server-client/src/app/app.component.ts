import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { main } from '../game/main';
import { State } from '../game/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((ob) => {
      if (!ob.map) return;
      State.get().setMap(ob.map);
      main();
    });
  }
}
