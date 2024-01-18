import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray } from '@angular/forms';

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
    await this.saveGame(this.form.get('game1') as FormGroup, 1);
    await this.saveGame(this.form.get('game2') as FormGroup, 2);
    await this.saveGame(this.form.get('game3') as FormGroup, 3);
    await this.saveGame(this.form.get('game4') as FormGroup, 4);
    await this.saveGame(this.form.get('game5') as FormGroup, 5);
    await this.saveGame(this.form.get('game6') as FormGroup, 6);
    await this.saveGame(this.form.get('smallFinal') as FormGroup, 13);
    await this.saveGame(this.form.get('bigFinal') as FormGroup, 14);
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
    const parts = fullName.split(/\s+/);
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
        team1 = game.get('teamGreen') as FormArray;
        team2 = game.get('teamOrange') as FormArray;
        const game1Id = await this.postGame(
          team1,
          team2,
          1,
          this.teamGreenId,
          this.teamOrangeId
        );
        await this.saveGoals(game1Id, team1, team2);
        team3 = game.get('teamBlue') as FormArray;
        team4 = game.get('teamGray') as FormArray;
        const game2Id = await this.postGame(
          team3,
          team4,
          2,
          this.teamBlueId,
          this.teamGrayId
        );
        await this.saveGoals(game2Id, team3, team4);

        break;
      case 2:
        team1 = game.get('teamOrange') as FormArray;
        team2 = game.get('teamBlue') as FormArray;
        const game3Id = await this.postGame(
          team1,
          team2,
          3,
          this.teamOrangeId,
          this.teamBlueId
        );
        await this.saveGoals(game3Id, team1, team2);
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamGreen') as FormArray;
        const game4Id = await this.postGame(
          team3,
          team4,
          4,
          this.teamGrayId,
          this.teamGreenId
        );
        await this.saveGoals(game4Id, team3, team4);
        break;
      case 3:
        team1 = game.get('teamGreen') as FormArray;
        team2 = game.get('teamBlue') as FormArray;
        const game5Id = await this.postGame(
          team1,
          team2,
          5,
          this.teamGreenId,
          this.teamBlueId
        );
        await this.saveGoals(game5Id, team1, team2);
        team3 = game.get('teamOrange') as FormArray;
        team4 = game.get('teamGray') as FormArray;
        const game6Id = await this.postGame(
          team3,
          team4,
          6,
          this.teamOrangeId,
          this.teamGrayId
        );
        await this.saveGoals(game6Id, team3, team4);
        break;
      case 4:
        team1 = game.get('teamBlue') as FormArray;
        team2 = game.get('teamGreen') as FormArray;
        const game7Id = await this.postGame(
          team1,
          team2,
          7,
          this.teamBlueId,
          this.teamGreenId
        );
        await this.saveGoals(game7Id, team1, team2);
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamOrange') as FormArray;
        const game8Id = await this.postGame(
          team3,
          team4,
          8,
          this.teamGrayId,
          this.teamOrangeId
        );
        await this.saveGoals(game8Id, team3, team4);
        break;
      case 5:
        team1 = game.get('teamGreen') as FormArray;
        team2 = game.get('teamGray') as FormArray;
        const game9Id = await this.postGame(
          team1,
          team2,
          9,
          this.teamGreenId,
          this.teamGrayId
        );
        await this.saveGoals(game9Id, team1, team2);
        team3 = game.get('teamBlue') as FormArray;
        team4 = game.get('teamOrange') as FormArray;
        const game10Id = await this.postGame(
          team3,
          team4,
          10,
          this.teamBlueId,
          this.teamOrangeId
        );
        await this.saveGoals(game10Id, team3, team4);
        break;
      case 6:
        team1 = game.get('teamOrange') as FormArray;
        team2 = game.get('teamGreen') as FormArray;
        const game11Id = await this.postGame(
          team1,
          team2,
          11,
          this.teamOrangeId,
          this.teamGreenId
        );
        await this.saveGoals(game11Id, team1, team2);
        team3 = game.get('teamGray') as FormArray;
        team4 = game.get('teamBlue') as FormArray;
        const game12Id = await this.postGame(
          team3,
          team4,
          12,
          this.teamGrayId,
          this.teamBlueId
        );
        await this.saveGoals(game12Id, team3, team4);
        break;
      case 13:
        team1 = game.get('leftTeam') as FormArray;
        team2 = game.get('rightTeam') as FormArray;
        const teamsRanking = this.form.get('teamsRanking').value;
        let team1SfId;
        let team2SfId;
        for (let i = 0; i < teamsRanking.length; i++) {
          if (i == 2) {
            const team1Color = teamsRanking[i].culoare;
            team1SfId = this.getTeamsId(team1Color);
          } else {
            if (i == 3) {
              const team2Color = teamsRanking[i].culoare;
              team2SfId = this.getTeamsId(team2Color);
            }
          }
        }
        const game13SfId = await this.postGame(
          team1,
          team2,
          13,
          team1SfId,
          team2SfId
        );
        await this.saveGoals(game13SfId, team1, team2);
        break;
      case 14:
        team1 = game.get('leftTeam') as FormArray;
        team2 = game.get('rightTeam') as FormArray;
        const teams2Ranking = this.form.get('teamsRanking').value;
        let team1BfId;
        let team2BfId;
        for (let i = 0; i < teams2Ranking.length; i++) {
          if (i == 1) {
            const team1Color = teams2Ranking[i].culoare;
            team1BfId = this.getTeamsId(team1Color);
          } else {
            if (i == 0) {
              const team2Color = teams2Ranking[i].culoare;
              team2BfId = this.getTeamsId(team2Color);
            }
          }
        }
        const game14BfId = await this.postGame(
          team1,
          team2,
          14,
          team1BfId,
          team2BfId
        );
        await this.saveGoals(game14BfId, team1, team2);
    }
  }

  getTeamsId(teamColor: string) {
    let teamId: number;
    switch (teamColor) {
      case 'Portocaliu':
        teamId = this.teamOrangeId;
        break;
      case 'Verde':
        teamId = this.teamGreenId;
        break;
      case 'Albastru':
        teamId = this.teamBlueId;
        break;
      case 'Gri':
        teamId = this.teamGrayId;
        break;
    }
    return teamId;
  }
  async saveGoals(gameId: number, team1: FormArray, team2: FormArray) {
    for (let i = 0; i < team1.controls.length; i++) {
      if (team1.controls[i].value != '') {
        const names1 = this.extractNames(team1.controls[i].value);
        const playerId1 = await this.findPlayer(
          names1.firstName,
          names1.lastName
        );
        await this.postGoal(playerId1, gameId);
      }
    }
    for (let j = 0; j < team2.controls.length; j++) {
      if (team2.controls[j].value != '') {
        const names2 = this.extractNames(team2.controls[j].value);
        const playerId2 = await this.findPlayer(
          names2.firstName,
          names2.lastName
        );
        await this.postGoal(playerId2, gameId);
      }
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
      const gameId = response.id;
      return Promise.resolve(gameId);
    } catch (error) {
      console.error('Error in save game:', error);
      throw error;
    }
  }
  async postGoal(playerId: number, gameId: number) {
    const jsonData = {
      playerId: playerId,
      gameId: gameId,
    };
    try {
      const response: any = await this.http
        .post(`${this.url}goals`, jsonData, { responseType: 'text' })
        .toPromise();
      return Promise.resolve();
    } catch (error) {
      console.log('Error in saving goal', error);
      throw error;
    }
  }
}
