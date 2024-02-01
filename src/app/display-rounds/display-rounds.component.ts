import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scorer } from '../model/scorer';

interface GameInfo {
  gameNumber: number;
  team1Color: string;
  team2Color: string;
  team1Goals: number;
  team2Goals: number;
}

@Component({
  selector: 'app-display-rounds',
  templateUrl: './display-rounds.component.html',
  styleUrl: './display-rounds.component.css',
})
export class DisplayRoundsComponent implements OnInit {
  games: any[];
  leftTeamSF: string;
  rightTeamSF: string;
  leftTeamBF: string;
  rightTeamBF: string;
  clasament = [
    {
      culoare: 'Verde',
      meciuri_jucate: 0,
      victorii: 0,
      egaluri: 0,
      infrangeri: 0,
      goluri_date: 0,
      goluri_primite: 0,
      golaveraj: 0,
      punctaj: 0,
    },
    {
      culoare: `Portocaliu`,
      meciuri_jucate: 0,
      victorii: 0,
      egaluri: 0,
      infrangeri: 0,
      goluri_date: 0,
      goluri_primite: 0,
      golaveraj: 0,
      punctaj: 0,
    },
    {
      culoare: `Albastru`,
      meciuri_jucate: 0,
      victorii: 0,
      egaluri: 0,
      infrangeri: 0,
      goluri_date: 0,
      goluri_primite: 0,
      golaveraj: 0,
      punctaj: 0,
    },
    {
      culoare: `Gri`,
      meciuri_jucate: 0,
      victorii: 0,
      egaluri: 0,
      infrangeri: 0,
      goluri_date: 0,
      goluri_primite: 0,
      golaveraj: 0,
      punctaj: 0,
    },
  ];
  clasamentSelectiv = [
    { culoare: 'Verde', vs_Portocaliu: 0, vs_Albastru: 0, vs_Gri: 0 },
    { culoare: 'Portocaliu', vs_Verde: 0, vs_Albastru: 0, vs_Gri: 0 },
    { culoare: 'Gri', vs_Portocaliu: 0, vs_Albastru: 0, vs_Verde: 0 },
    { culoare: 'Albastru', vs_Portocaliu: 0, vs_Verde: 0, vs_Gri: 0 },
  ];
  attendanceList: any[];
  table: any;
  teams = ['Portocaliu', 'Verde', 'Albastru', 'Gri'];
  scorersList: any[];
  ownGoalScorers: any[];
  goalgetters: Scorer[];
  @ViewChildren('matchRef') matchRefs: QueryList<ElementRef>;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.http
        .get<GameInfo[]>('http://localhost:8080/games/byRoundId/11')
        .toPromise()
        .then((response) => {
          this.games = response;
          this.populateGames();
          this.leftTeamSF = response[12].team1Color;
          this.rightTeamSF = response[12].team2Color;
          this.leftTeamBF = response[13].team1Color;
          this.rightTeamBF = response[13].team2Color;
          this.matchRefs.forEach((element) => {
            let matchElement = element.nativeElement;
            this.updateClasament(matchElement);
          });
          console.log(this.games);
        }),

      this.http
        .get<GameInfo[]>('http://localhost:8080/players/byRoundId/11')
        .toPromise()
        .then((response) => {
          this.attendanceList = response;
          this.attendPlayers();
          console.log(this.attendanceList);
        }),

      this.http
        .get<GameInfo[]>('http://localhost:8080/players/scorersByRoundId/11')
        .toPromise()
        .then((response) => {
          this.scorersList = response;
          console.log(this.scorersList);
          this.appendGoals();
        }),
      this.http
        .get<GameInfo[]>(
          'http://localhost:8080/players/ownGoalscorersByRoundId/11'
        )
        .toPromise()
        .then((response) => {
          this.ownGoalScorers = response;
          console.log(this.ownGoalScorers);
          this.appendOwnGoals();
        }),
    ]).then(() => {
      this.clasament.sort(this.teamComparator);
      this.goalgetters = this.setGoalgettersList(this.scorersList);
      this.goalgetters.sort(this.compareScorers);
    });
  }
  populateGames() {
    let index = 1;
    this.games.forEach((element) => {
      const scoreEl = document.getElementById(`scorG${index}`);
      const team1Score = element.team1Goals;
      const team2Score = element.team2Goals;
      const scoreText = `${team1Score} - ${team2Score}`;
      this.renderer.setProperty(scoreEl, 'innerText', scoreText);
      index++;
    });
  }

  attendPlayers() {
    this.attendanceList.forEach((element) => {
      let emptyPosition = this.findFirstEmptyPosition();
      this.table = document.getElementById('teams') as HTMLTableElement;
      if (emptyPosition && this.table) {
        const { row, column } = emptyPosition;
        const cell = this.table.rows[row].cells[column];
        cell.innerHTML = '';
        cell.textContent = element.playerName;
      }
    });
  }

  findFirstEmptyPosition() {
    const table = document.getElementById('teams');
    if (table) {
      const rows = table.getElementsByTagName('tr');
      for (let j = 0; j < rows[0].cells.length; j++) {
        for (let i = 0; i < rows.length; i++) {
          const cellContent = rows[i].cells[j].innerText.trim();
          if (cellContent === '') {
            return { row: i, column: j };
          }
        }
      }
    }
    return null;
  }

  async updateClasament(match: HTMLElement) {
    const matchInformations = this.getMatchInformations(match);
    const leftTeamName = matchInformations[0];
    const rightTeamName = matchInformations[1];
    const score = matchInformations[2];
    const scoreInt = score.split('-');
    const leftTeamGoals = parseInt(scoreInt[0]);
    const rightTeamGoals = parseInt(scoreInt[1]);
    const leftTeam = this.getTeamName(leftTeamName);
    const rightTeam = this.getTeamName(rightTeamName);
    const result = leftTeamGoals - rightTeamGoals;
    leftTeam.goluri_date += leftTeamGoals;
    leftTeam.goluri_primite += rightTeamGoals;
    leftTeam.golaveraj = leftTeam.goluri_date - leftTeam.goluri_primite;
    rightTeam.goluri_date += rightTeamGoals;
    rightTeam.goluri_primite += leftTeamGoals;
    rightTeam.golaveraj = rightTeam.goluri_date - rightTeam.goluri_primite;
    if (result == 0) {
      leftTeam.egaluri++;
      rightTeam.egaluri++;
      leftTeam.punctaj++;
      rightTeam.punctaj++;
    } else if (result < 0) {
      leftTeam.infrangeri++;
      rightTeam.victorii++;
      rightTeam.punctaj += 3;
    } else {
      leftTeam.victorii++;
      rightTeam.infrangeri++;
      leftTeam.punctaj += 3;
    }
    leftTeam.meciuri_jucate++;
    rightTeam.meciuri_jucate++;
  }

  getMatchInformations(match: Element) {
    const leftTeamName =
      match.children[0].children[0].children[0].textContent.trim();
    const rightTeamName =
      match.children[0].children[2].children[0].textContent.trim();
    const score = match.children[0].children[1].textContent;
    return [leftTeamName, rightTeamName, score];
  }
  getTeamName(color: string) {
    for (var i = 0; i < this.clasament.length; i++) {
      if (this.clasament[i].culoare == color) {
        return this.clasament[i];
      }
    }
    return null;
  }

  getBetterTeamByDirectMatch(team1, team2) {
    const leftTeam = this.clasamentSelectiv.find(
      (team) => team.culoare === team1.culoare
    );
    const rightTeam = this.clasamentSelectiv.find(
      (team) => team.culoare === team2.culoare
    );
    if (leftTeam && rightTeam) {
      if (leftTeam[`vs_${team2.culoare}`] > rightTeam[`vs_${team1.culoare}`]) {
        return -1;
      } else if (
        leftTeam[`vs_${team2.culoare}`] < rightTeam[`vs_${team1.culoare}`]
      ) {
        return 1;
      }
    }
    return 0;
  }
  teamComparator = (team1, team2) => {
    if (team1.punctaj > team2.punctaj) {
      return -1;
    } else if (team1.punctaj < team2.punctaj) {
      return 1;
    } else if (team1.punctaj == team2.punctaj) {
      this.updateClasamentSelectiv.bind(this)();
      if (this.getBetterTeamByDirectMatch(team1, team2) == 0) {
        if (team1.golaveraj > team2.golaveraj) {
          return -1;
        } else if (team1.golaveraj < team2.golaveraj) {
          return 1;
        } else if (team1.golaveraj == team2.golaveraj) {
          if (team1.goluri_date > team2.goluri_date) {
            return -1;
          } else if (team1.goluri_date < team2.goluri_date) {
            return 1;
          }
        }
      } else {
        return this.getBetterTeamByDirectMatch(team1, team2);
      }
    }
    return 0;
  };
  updateClasamentSelectiv() {
    const matches = document.querySelectorAll('.match');
    matches.forEach((match) => {
      const matchInformations = this.getMatchInformations(match);
      const leftTeamName = matchInformations[0];
      const rightTeamName = matchInformations[1];
      const score = matchInformations[2];
      const scoreInt = score.split('-');
      const leftTeamGoals = parseInt(scoreInt[0]);
      const rightTeamGoals = parseInt(scoreInt[1]);
      const leftTeam = this.clasamentSelectiv.find(
        (team) => team.culoare === leftTeamName
      );
      const rightTeam = this.clasamentSelectiv.find(
        (team) => team.culoare === rightTeamName
      );
      if (leftTeam && rightTeam) {
        leftTeam[`vs_${rightTeamName}`] += leftTeamGoals - rightTeamGoals;
        rightTeam[`vs_${leftTeamName}`] += rightTeamGoals - leftTeamGoals;
      }
    });
  }

  setGoalgettersList(scorerData: any[]): Scorer[] {
    const scorerMap = new Map<string, Scorer>();
    for (const scorerInfo of scorerData) {
      const { playerName, numberOfGoals, matchNumber } = scorerInfo;
      if (scorerMap.has(playerName)) {
        const scorer = scorerMap.get(playerName)!;
        scorer.totalGoluri += numberOfGoals;
        if (matchNumber === 13 || matchNumber === 14) {
          scorer.goluriFinala += numberOfGoals;
        }
      } else {
        const newScorer = new Scorer(playerName);
        newScorer.totalGoluri = numberOfGoals;
        newScorer.goluriFinala =
          matchNumber === 13 || matchNumber === 14 ? numberOfGoals : 0;
        scorerMap.set(playerName, newScorer);
      }
    }
    return Array.from(scorerMap.values());
  }

  appendGoals() {
    this.scorersList.forEach((element) => {
      const matchNumber = element.matchNumber;
      const game = document.getElementById(`match${matchNumber}`);
      const teamColor = element.teamColor;
      const goalsNr = element.numberOfGoals;
      for (let i = 1; i <= goalsNr; i++) {
        const ulEl = game.querySelector(`.list-${teamColor}`);
        const ilElement = this.renderer.createElement('il');
        ilElement.textContent = element.playerName;
        ulEl.appendChild(ilElement);
      }
    });
  }

  appendOwnGoals() {
    this.ownGoalScorers.forEach((element) => {
      const matchNumber = element.matchNumber;
      const game = document.getElementById(`match${matchNumber}`);
      const teamColor = element.teamColor;
      const goalsNr = element.numberOfGoals;
      for (let i = 1; i <= goalsNr; i++) {
        const ulEl = game.querySelector(`.list-${teamColor}`);
        const ilElement = this.renderer.createElement('il');
        ilElement.textContent = element.playerName + "(autogol)";
        ilElement.style.color = 'red';
        ulEl.appendChild(ilElement);
      }
    });
  }

  compareScorers(scorer1: Scorer, scorer2: Scorer): number {
    if (scorer1.totalGoluri > scorer2.totalGoluri) {
      return -1;
    } else if (scorer1.totalGoluri < scorer2.totalGoluri) {
      return 1;
    } else if (scorer1.totalGoluri == scorer2.totalGoluri) {
      if (scorer1.goluriFinala > scorer2.goluriFinala) {
        return -1;
      } else if (scorer1.goluriFinala < scorer2.goluriFinala) {
        return 1;
      }
    }
    return 0;
  }
}
