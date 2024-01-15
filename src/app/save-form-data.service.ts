import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  FormRecord,
  AbstractControl,
} from '@angular/forms';
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
    await this.saveGame(this.form.get('game1')as FormGroup, 1);
    await this.saveGame(this.form.get('game2') as FormGroup, 2);
    await this.saveGame(this.form.get('game3') as FormGroup, 3);
    await this.saveGame(this.form.get('game4') as FormGroup, 4);
    await this.saveGame(this.form.get('game5') as FormGroup, 5);
    await this.saveGame(this.form.get('game6') as FormGroup, 6);
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
      const playersName = player;
      let playerId = 0;
      let names;
      if (playersName != '') {
        names = this.extractNames(player);
        playerId = await this.findPlayer(names.firstName, names.lastName);
      }
      if (playerId != 0) {
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
      console.log(
        'there has been an error in finding player:',
        lastName,
        firstName
      );
      throw error;
    }
  }
  extractNames(fullName: string) {
    const parts = fullName.split(/(?=[A-Z])/); // Split on uppercase letters
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return {
      firstName: firstName,
      lastName: lastName,
    };
  }

  async saveGame(game: FormGroup, gameNr: number) {
    let team1: FormArray;
    let team2: FormArray;
    let team3: FormArray;
    let team4: FormArray;

    switch (gameNr) {
      case 1:
        team1 = game.get('teamGreen') as FormArray
        team2 = game.get('teamOrange') as FormArray;
        await this.postGame(
          team1,
          team2,
          1,
          this.teamGreenId,
          this.teamOrangeId
        );
        team3 = game.get('teamBlue') as FormArray;
        team4 = game.get('teamGray') as FormArray;
        await this.postGame(team3, team4, 2, this.teamBlueId, this.teamGrayId);
        break;
      case 2:
        team1 = game.get('teamOrange') as FormArray;
        team2 = game.get('teamBlue') as FormArray;
        await this.postGame(
          team1,
          team2,
          3,
          this.teamOrangeId,
          this.teamBlueId
        );
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamGreen') as FormArray;
        await this.postGame(team3, team4, 4, this.teamGrayId, this.teamGreenId);
        break;
      case 3:
        team1 = game.get('teamGreen') as FormArray;
        team2 = game.get('teamBlue') as FormArray;
        await this.postGame(team1, team2, 5, this.teamGreenId, this.teamBlueId);
        team3 = game.get('teamOrange') as FormArray;
        team4 = game.get('teamGray') as FormArray;
        await this.postGame(
          team3,
          team4,
          6,
          this.teamOrangeId,
          this.teamGrayId
        );
        break;
      case 4:
        team1 = game.get('teamBlue') as FormArray;
        team2 = game.get('teamGreen') as FormArray;
        await this.postGame(team1, team2, 7, this.teamBlueId, this.teamGreenId);
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamOrange') as FormArray;
        await this.postGame(
          team3,
          team4,
          8,
          this.teamGrayId,
          this.teamOrangeId
        );
        break;
      case 5:
        team1 = game.get('teamGreen') as FormArray;
        team2 = game.get('teamGray') as FormArray;
        await this.postGame(team1, team2, 9, this.teamGreenId, this.teamGrayId);
        team3 = game.get('teamBlue') as FormArray;
        team4 = game.get('teamOrange') as FormArray;
        await this.postGame(
          team3,
          team4,
          10,
          this.teamBlueId,
          this.teamOrangeId
        );
        break;
      case 6:
        team1 = game.get('teamOrange') as FormArray;
        team2 = game.get('teamGreen') as FormArray;
        await this.postGame(
          team1,
          team2,
          11,
          this.teamOrangeId,
          this.teamGreenId
        );
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamBlue') as FormArray;
        await this.postGame(team3, team4, 12, this.teamGrayId, this.teamBlueId);
        break;
    }
  }

  async postGame(
    team1: FormArray,
    team2: FormArray,
    matchNr: number,
    team1Id: number,
    team2Id: number
  ) {
    let team1GoalsNr: number = 0;
    let team2GoalsNr: number = 0;
    for (let i = 0; i < team1.controls.length; i++) {
      team1GoalsNr++;
    }
    for (let i = 0; i < team2.controls.length; i++) {
      team2GoalsNr++;
    }
    const jsonData = {
      number: matchNr,
      team1Id: team1Id,
      team2Id: team2Id,
      team1Goals: team1GoalsNr,
      team2Goals: team2GoalsNr,
      roundId: this.roundId,
    };
    try {
      const response: any = await this.http
        .post(`${this.url}games`, jsonData)
        .toPromise();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in save game:', error);
      throw error;
    }
  }
}
