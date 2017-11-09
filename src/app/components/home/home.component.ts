import { Component, OnInit } from '@angular/core';
import {DbService} from '../../services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showAddForm: boolean;
  registeredParticipants: [any];

  constructor(private dbService: DbService) { }

  ngOnInit() {
    this.dbService.getRegisteredNodes().subscribe(response => {
      console.log(response);
      this.registeredParticipants = response.data;
    });
  }

  setShowAddForm(show) {
    console.log('sssss', show);
    this.showAddForm = show;
  }

}
