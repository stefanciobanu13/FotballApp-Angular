import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormRecord } from '@angular/forms';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { catchError, find, map } from 'rxjs/operators';
import { OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SaveFormDataService {
  constructor(private http: HttpClient) {}
  form: FormGroup;
  url: string = 'http://localhost:8080/';
  roundId: number;
  teamOrangeId: number;
  teamGreenId: number;
  teamBlueId: number;
  teamGrayId: number;
  teamsRanking: any[];

  async saveFormData(formElement: FormGroup) {
    this.form = formElement;
    this.teamsRanking = this.form.get('teamsRanking').value;
    await this.saveRound();
    await this.saveTeam('Portocaliu');
    await this.saveTeam('Verde');
    await this.saveTeam('Albastru');
    await this.saveTeam('Gri');
    const teamOrange = this.form.get('teamPortocaliu').value;
    await this.savePlayersAttendance(teamOrange, this.teamOrangeId);
    const teamGreen = this.form.get('teamVerde').value;
    await this.savePlayersAttendance(teamGreen, this.teamGreenId);
    const teamBlue = this.form.get('teamAlbastru').value;
    await this.savePlayersAttendance(teamBlue, this.teamBlueId);
    const teamGray = this.form.get('teamGri').value;
    await this.savePlayersAttendance(teamGray, this.teamGrayId);


  }

  convertDateFormat(inputDate: string): string {
    const [year, month, day] = inputDate.split('-');
    const newDateFormat = `${month}.${day}.${year}`;
    return newDateFormat;
  }

  async saveRound() {
    const roundNr = this.form.get('roundNumber').value;
    const roundDate = this.form.get('roundDate').value;
    const formatedDate = this.convertDateFormat(roundDate);
    const roundJSON = {
      date: formatedDate,
      number: roundNr,
    };

    try {
      const response: any = await this.http
        .post(`${this.url}rounds`, roundJSON)
        .toPromise();
      this.roundId = response.id;
      return Promise.resolve();
    } catch (error) {
      console.error('Error in saveRound:', error);
      throw error;
    }
  }

  async saveTeam(teamColor: string) {
    const teamJSON = {
      color: teamColor,
      points: this.findTeamPoints(teamColor),
      goalRate: this.findTeamGoalRate(teamColor),
      roundId: this.roundId,
    };
    try {
      const response: any = await this.http
        .post(`${this.url}teams`, teamJSON)
        .toPromise();
      const teamColor = response.color;
      switch (teamColor) {
        case 'Portocaliu':
          this.teamOrangeId = response.id;
          break;
        case 'Verde':
          this.teamGreenId = response.id;
          break;
        case 'Albastru':
          this.teamBlueId = response.id;
          break;
        case 'Gri':
          this.teamGrayId = response.id;
          break;
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error in saveTeam:', error);
      throw error;
    }
  }
  findTeamPoints(teamColor: string) {
    let punctaj: number;
    this.teamsRanking.forEach((element) => {
      if (element.culoare == teamColor) {
        punctaj = element.punctaj;
      }
    });
    return punctaj;
  }
  findTeamGoalRate(teamColor: string) {
    let golaveraj: number;
    this.teamsRanking.forEach((element) => {
      if (element.culoare == teamColor) {
        golaveraj = element.golaveraj;
      }
    });
    return golaveraj;
  }

  async savePlayersAttendance(team: any[], teamId: number) {
    for (const player of team) {
      const thePL = player;
      const names = this.extractNames(player);
      const playerId = await this.findPlayer(names.firstName, names.lastName);
      if(playerId!=null){
        const data = {
          teamId: teamId,
          playerId: playerId,
        };
        try {
          const response: any = await this.http
            .post(`${this.url}team-players`, data)
            .toPromise();
        } catch (error) {
          // console.error('Error in attendance save:', error);
          // throw error;
        }
      }
    }
  }

  async findPlayer(firstName: string, lastName: string) {
    const theParams = {
      lastName: lastName,
      firstName: firstName,
    };
    try {
      const response: any = await this.http
        .get(`${this.url}players/name`, { params: theParams })
        .toPromise();
      const playerId = response.id;
      return Promise.resolve(playerId);
    } catch (error) {
      throw error;
    }
  }
  async getPlayersId() {}

  extractNames(fullName: string) {
    const parts = fullName.split(/(?=[A-Z])/); // Split on uppercase letters
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return {
      firstName: firstName,
      lastName: lastName,
    };
  }
}
