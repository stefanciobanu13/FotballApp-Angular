import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Round {
  id: number;
  date: string;
  number: number;
}

@Component({
  selector: 'app-display-rounds',
  templateUrl: './display-rounds.component.html',
  styleUrl: './display-rounds.component.css',
})
export class DisplayRoundsComponent implements OnInit {
  rounds: any[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Round[]>('http://localhost:8080/rounds')
      .toPromise()
      .then((response) => {
        this.rounds = response;
      });
  }
}
