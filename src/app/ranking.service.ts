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

  public get clasament() {
    return this._clasament;
  }
  public set clasament(value) {
    this._clasament = value;
  }

  getClasamentObs(): Observable<any[]> {
    const clasament = this.clasament;
    return of(clasament).pipe(shareReplay(1));
  }

  getMatchInformations(match: HTMLElement) {
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
  }

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
}
