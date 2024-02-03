import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-player',
  templateUrl: './update-player.component.html',
  styleUrl: './update-player.component.css',
})
export class UpdatePlayerComponent implements OnInit {
  firstName: string;
  lastName: string;
  grade: number;
  playerId: number;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.playerId = params['id'];
      this.firstName = params['firstName'];
      this.lastName = params['lastName'];
      this.grade = params['grade'];
      console.log('the player id is', this.playerId);
    });
  }

  updatePlayer() {
    console.log('inside update player');

    if (
      this.playerId !== undefined &&
      this.firstName !== undefined &&
      this.lastName !== undefined &&
      this.grade !== undefined
    ) {
      const dataJSON = {
        id: this.playerId,
        firstName: this.firstName,
        lastName: this.lastName,
        grade: this.grade,
      };

      this.http.get(`http://localhost:8080/players/${this.playerId}`).subscribe(
        (player) => {
          if (player) {
            this.http
              .put(`http://localhost:8080/players`, dataJSON, {
                responseType: 'text',
              })
              .subscribe(
                (response) => {
                  console.log('Player updated successfully:', response);
                  alert('Jucatorul a fost actualizat cu succes');
                },
                (error) => {
                  console.error('Error in updating the player:', error);
                  alert('Eroare la actualizarea jucatorului');
                }
              );
          } else {
            console.error('Player not found or missing necessary properties.');
            alert('Jucatorul nu a fost gasit sau are proprietati lipsa.');
          }
        },
        (error) => {
          console.error('Error in finding the player:', error);
          alert('Eroare la gasirea jucatorului');
        }
      );
    }
  }
}
