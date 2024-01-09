import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  constructor() {}

  private _clasament = [
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
  private clasamentTemplate = Object.assign(this.clasament);
  private clasamentSelectiv = [
    { culoare: 'Verde', vs_Portocaliu: 0, vs_Albastru: 0, vs_Gri: 0 },
    { culoare: 'Portocaliu', vs_Verde: 0, vs_Albastru: 0, vs_Gri: 0 },
    { culoare: 'Gri', vs_Portocaliu: 0, vs_Albastru: 0, vs_Verde: 0 },
    { culoare: 'Albastru', vs_Portocaliu: 0, vs_Verde: 0, vs_Gri: 0 },
  ];

  private _finals: Map<string, string> = new Map([
    ['smallFinalLeftTeam', ''],
    ['smallFinalRightTeam', ''],
    ['bigFinalLeftTeam', ''],
    ['bigFinalRightTeam', ''],
  ]);
  public get finals(): Map<string, string> {
    return this._finals;
  }

  public get clasament() {
    return this._clasament;
  }
  public set clasament(value) {
    this._clasament = value;
  }

  getTeamPosition(name: string) {
    let teamPosition: string;
    for (const [key, value] of this.finals.entries()) {
      if (name === value) {
        if (key.includes('Left')) {
          teamPosition = 'leftTeam';
        } else {
          teamPosition = 'rightTeam';
        }
        break;
      }
    }
    return teamPosition;
  }

  getClasamentObs(): Observable<any[]> {
    const clasament = this.clasament;
    return of(clasament).pipe(shareReplay(1));
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
    for (var i = 0; i < this.clasamentTemplate.length; i++) {
      if (this.clasamentTemplate[i].culoare == color) {
        return this.clasamentTemplate[i];
      }
    }
    return null;
  }

  async updateClasament(match: HTMLElement) {
    await this.resetRaking();
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
    this.clasament = this.clasamentTemplate;
    if (
      match.id == 'match12' &&
      match.getAttribute('match-status') == 'played match'
    ) {
      await this.setTheFinals(match);
    }
  }

  noGoalsDraw(event: Event) {
    const targetEl = event.target as HTMLElement;
    const selectElement = targetEl.parentNode.querySelector(
      '.selectare'
    ) as HTMLSelectElement;
    const gamesElements = targetEl.parentElement.querySelectorAll('.match');
    this.changeMatchStatus(gamesElements, selectElement.value);
  }

  changeMatchStatus(games: NodeListOf<Element>, teamColor: string) {
    games.forEach((game) => {
      const divEl = game.querySelector(`.${teamColor}`);
      if (divEl !== null) {
        game.setAttribute('match-status', 'played match');
        if (game.id == 'match12') {
          const game12 = document.getElementById('match12');
          this.setTheFinals(game12);
          this.updateClasament(game12);
        }
      }
    });
  }
  setTheFinals(match: HTMLElement): Promise<void> {
    if (match.id == 'match12') {
      this.clasament.sort(this.teamComparator);
      this.finals.set('smallFinalLeftTeam', this.clasament.at(2).culoare);
      this.finals.set('smallFinalRightTeam', this.clasament.at(3).culoare);
      this.finals.set('bigFinalLeftTeam', this.clasament.at(0).culoare);
      this.finals.set('bigFinalRightTeam', this.clasament.at(1).culoare);
    }
    return Promise.resolve();
  }

  updateClasamentSelectiv() {
    this.resetClasamentSelectiv();
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
  sortClasament() {
    this.clasament.sort(function (team1, team2) {
      if (team1.punctaj == team2.punctaj) {
        //console.log(team1,team2,getBetterTeamByDirectMatch(team1,team2));
        if (this.getBetterTeamByDirectMatch(team1, team2) == 0) {
          if (team1.golaveraj == team2.golaveraj) {
            if (team1.goluri_date == team2.goluri_date) {
              // change table loc with the name PENALTY
              var clasament1 = document.getElementById('clasamentBody');
              var rows = clasament1.querySelectorAll('tr');
              rows.forEach((row) => {
                const teamName = row.children[1].textContent.trim();
                if (teamName === team1.culoare) {
                  row.children[0].textContent = 'PENALTY';
                  // row.children[0].style.color = 'red';
                } else if (teamName === team2.culoare) {
                  row.children[0].textContent = 'PENALTY';
                  //  row.children[0].style.color = 'red';
                }
              }, this);
              return 0;
            } else if (team1.goluri_date > team2.goluri_date) {
              return -1;
            } else {
              return 1;
            }
          } else if (team1.golaveraj > team2.golaveraj) {
            return -1;
          } else {
            return 1;
          }
        } else {
          return this.getBetterTeamByDirectMatch(team1, team2);
        }
      } else if (team1.punctaj > team2.punctaj) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  getBetterTeamByDirectMatch(team1, team2) {
    const leftTeam = this.clasamentSelectiv.find(
      (team) => team.culoare === team1.color
    );
    const rightTeam = this.clasamentSelectiv.find(
      (team) => team.culoare === team2.color
    );
    if (leftTeam && rightTeam) {
      if (leftTeam[`vs_${team2.color}`] > rightTeam[`vs_${team1.color}`]) {
        return -1;
      } else if (
        leftTeam[`vs_${team2.color}`] < rightTeam[`vs_${team1.color}`]
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
        }
        if (team1.goluri_date > team2.goluri_date) {
          return -1;
        } else if (team1.goluri_date < team2.goluri_date) {
          return 1;
        }
      }
      if (team1.golaveraj > team2.golaveraj) {
        return -1;
      } else if (team1.golaveraj < team2.golaveraj) {
        return 1;
      }
      if (team1.goluri_date > team2.goluri_date) {
        return -1;
      } else if (team1.goluri_date < team2.goluri_date) {
        return 1;
      }
    }
    return 0;
  };

  resetRaking(): Promise<void> {
    this.clasamentTemplate = [
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
    return Promise.resolve();
  }

  resetClasamentSelectiv(): Promise<void> {
    this.clasamentSelectiv = [
      { culoare: 'Verde', vs_Portocaliu: 0, vs_Albastru: 0, vs_Gri: 0 },
      { culoare: 'Portocaliu', vs_Verde: 0, vs_Albastru: 0, vs_Gri: 0 },
      { culoare: 'Gri', vs_Portocaliu: 0, vs_Albastru: 0, vs_Verde: 0 },
      { culoare: 'Albastru', vs_Portocaliu: 0, vs_Verde: 0, vs_Gri: 0 },
    ];
    return Promise.resolve();
  }
}
