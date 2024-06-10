import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrl: './add-player.component.css',
})
export class AddPlayerComponent {
  firstName: string;
  lastName: string;
  grade: number;

  constructor(private http: HttpClient) {}

  persistPlayer() {
    console.log('inside persist player');

    if (
      this.firstName != undefined &&
      this.lastName != undefined &&
      this.grade != undefined
    ) {
      const dataJSON = {
        firstName: this.firstName,
        lastName: this.lastName,
        grade: this.grade,
      };

      this.http
        .post('http://football-backend.eu-central-1.elasticbeanstalk.com:5000/players', dataJSON, {
          responseType: 'text',
        })
        .subscribe(
          (response) => {
            console.log('Player saved successfully:', response);
            alert('Jucatorul a fost salvat cu succes');
          },
          (error) => {
            console.error('Error in saving the player:', error);
            alert('Eroare la salvarea jucatorului');
          }
        );
    }
  }
}
