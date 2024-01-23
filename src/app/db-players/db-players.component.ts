import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Player {
  firstName: String;
  lastName: String;
  grade: number;
}

@Component({
  selector: 'app-db-players',
  templateUrl: './db-players.component.html',
  styleUrl: './db-players.component.css',
})
export class DbPlayersComponent implements OnInit {
  constructor(private http: HttpClient) {}

   players:any[];

  ngOnInit(): void {
    this.http
      .get<Player[]>('http://localhost:8080/players')
      .subscribe((response) => {
          this.players = response;        
      });
  }
}
