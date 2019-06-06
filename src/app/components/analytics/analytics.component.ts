import {Component, OnInit} from '@angular/core';
import * as jsnx from 'jsnetworkx';
import * as d3 from 'd3';
import {SessionStateService} from "../../services/global/session-state.service";
import {AnalyticsService} from "../../services/analytics/analytics.service";
import {DbService} from "../../services/db.service";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  schools = {};

  constructor(private sessionStateService: SessionStateService,
              private dbService: DbService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    let G3 = new jsnx.Graph();

    /*G3.addNodesFrom(['a', 2, 3, 4, 5, 6], {group: 0});
    G3.addNodesFrom([7, 8], {group: 1});

    G3.addPath(['a', 2, 3, 4, 5, 6, 'a']);
    G3.addEdgesFrom([['a', 7], [2, 8]]);*/

    const color = d3.scale.category20();

    this.registrarService.getIndexContract(this.sessionStateService.getUser()['accounts'][0]).subscribe(indexContract => {

      this.dbService.getSchools(this.sessionStateService.getUser()['accounts'][0], this.sessionStateService.getUser()['token']).subscribe(response => {
        console.log('schools are ::: ', response);
        let schoolNodes = [];
        const schoolsx = response.data.schools;
        for (let i = 0; i < schoolsx.length; i++) {
          const schoolAddress = schoolsx[i].blockchainAddress;
          this.schools[schoolAddress] = schoolsx[i];
          schoolNodes.push(schoolAddress);

          this.indexContractService.getRecordsByLearningProvider(indexContract, schoolAddress).subscribe(llpcs => {
            G3.addNodesFrom(llpcs, {group: 1});
            for (let i = 0; i < llpcs.length; i++) {
              G3.addPath([schoolAddress, llpcs[i]]);
            }
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
          });
        }

        G3.addNodesFrom(schoolNodes, {group: 0});
      });
    });
  }

}
