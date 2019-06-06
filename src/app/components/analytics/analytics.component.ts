import {Component, OnInit} from '@angular/core';
import * as jsnx from 'jsnetworkx';
import * as d3 from 'd3';
import {SessionStateService} from "../../services/global/session-state.service";
import {AnalyticsService} from "../../services/analytics/analytics.service";
import {DbService} from "../../services/db.service";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(private sessionStateService: SessionStateService,
              private dbService: DbService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    let G3 = new jsnx.Graph();

    G3.addNodesFrom(['a', 2, 3, 4, 5, 6], {group: 0});
    G3.addNodesFrom([7, 8], {group: 1});

    G3.addPath(['a', 2, 3, 4, 5, 6, 'a']);
    G3.addEdgesFrom([['a', 7], [2, 8]]);

    var color = d3.scale.category20();
    jsnx.draw(G3, {
      element: '#chart3',
      layoutAttr: {
        charge: -120,
        linkDistance: 20
      },
      nodeAttr: {
        r: 5,
        title: function (d) {
          return d.label;
        }
      },
      nodeStyle: {
        fill: function (d) {
          return color(d.data.group);
        },
        stroke: 'none'
      },
      edgeStyle: {
        stroke: '#999'
      }
    }, true);

    this.dbService.getSchools(this.sessionStateService.getUser()['accounts'][0], this.sessionStateService.getUser()['token']).subscribe(response => {
      console.log('schools are ::: ', response);
    });

    this.analyticsService.getLLPCEvents(this.sessionStateService.getUser()['accounts'][0], this.sessionStateService.getUser()['token']).subscribe(response => {
      console.log('events are ::: ', response);
    });
  }

}
