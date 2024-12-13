import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Player {
  id:number;
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
  constructor(private http: HttpClient, private router: Router) {}

  players: Player[];

  navigateToRoute() {
    this.router.navigate(['/AddPlayer']);
  }

  ngOnInit(): void {
    this.fetchPlayers();
  }

  fetchPlayers() {
    this.http.get<Player[]>('http://football-backend.eu-central-1.elasticbeanstalk.com:5000/players').subscribe(
      (response) => {
        this.players = response;
      },
      (error) => {
        console.error('Error fetching players:', error);
      }
    );
  }

  deletePlayer(id: number) {
    const confirmDelete = window.confirm(
      'Sunteti sigur(a) ca doriti sa stergeti acest jucator?'
    );

    if (confirmDelete) {
      this.http.get<Player>(`http://football-backend.eu-central-1.elasticbeanstalk.com:5000/players/${id}`).subscribe(
        (response) => {
          if (response) {
            this.http
              .delete(`http://football-backend.eu-central-1.elasticbeanstalk.com:5000/players/${id}`, {
                responseType: 'text',
              })
              .subscribe(
                () => {
                  console.log('Player deleted successfully');
                  alert('Jucatorul a fost sters cu succes');
                  this.fetchPlayers();
                },
                (error) => {
                  console.error('Error in deleting the player:', error);
                  alert('Eroare la stergerea jucatorului');
                }
              );
          } else {
            alert('Jucatorul nu a fost gasit.');
          }
        },
        (error) => {
          console.error('Error in checking player existence:', error);
        }
      );
    }
  }
}
