import {
  Injectable,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { Observable, of, shareReplay } from 'rxjs';
import { RankingService } from './ranking.service';
import { Scorer } from './model/scorer';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public footballForm: FormGroup;
  private _scorersList: Array<Scorer> = [];
  public get scorersList() {
    return this._scorersList;
  }

  constructor(private fb: FormBuilder, private ranking: RankingService) {
    this.footballForm = this.fb.group({
      game1: this.fb.group({
        teamGreen: this.fb.array([]),
        teamOrange: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game2: this.fb.group({
        teamOrange: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
        teamGreen: this.fb.array([]),
      }),
      game3: this.fb.group({
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamOrange: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game4: this.fb.group({
        teamBlue: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamGray: this.fb.array([]),
        teamOrange: this.fb.array([]),
      }),
      game5: this.fb.group({
        teamGreen: this.fb.array([]),
        teamGray: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamOrange: this.fb.array([]),
      }),
      game6: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamGray: this.fb.array([]),
        teamBlue: this.fb.array([]),
      }),
      smallFinal: this.fb.group({
        leftTeam: this.fb.array([]),
        rightTeam: this.fb.array([]),
      }),
      bigFinal: this.fb.group({
        leftTeam: this.fb.array([]),
        rightTeam: this.fb.array([]),
      }),
      teamPortocaliu: this.fb.array([]),
      teamVerde: this.fb.array([]),
      teamAlbastru: this.fb.array([]),
      teamGri: this.fb.array([]),
      roundNumber: this.fb.control(''),
      roundDate: this.fb.control(''),
      teamsRanking: this.fb.control([]),
    });
  }

  getTeamArray(gameNr: string, teamName: string): FormArray {
    return this.footballForm.get(`${gameNr}`).get(`${teamName}`) as FormArray;
  }

  getScorerArrayObs(gameNr: string, teamName: string): Observable<FormArray> {
    const formArray = this.getTeamArray(gameNr, teamName) as FormArray;
    return of(formArray).pipe(shareReplay(1));
  }

  adaugaMarcator(event: Event) {
    const button = event.target as HTMLElement;
    const selectElement = button.parentNode.querySelector(
      '.selectare'
    ) as HTMLSelectElement;
    const inputListElement = button.parentNode.querySelector(
      '.inputs'
    ) as HTMLInputElement;
    const scorerName = inputListElement.value;
    if (scorerName != '') {
      inputListElement.value = '';
      const gameNr = button.parentNode.querySelector('h3').innerHTML;
      const gamesElements = button.parentElement.querySelectorAll('.match');
      this.addScorerToTheList(scorerName);
      this.changeMatchStatus(gamesElements, selectElement.value);
      const selectValue = selectElement.value;
      let selectedScorers: FormArray;
      switch (selectValue) {
        case 'Verde':
          selectedScorers = this.getTeamArray(
            `game${gameNr.charAt(gameNr.length - 1)}`,
            'teamGreen'
          );
          break;
        case 'Portocaliu':
          selectedScorers = this.getTeamArray(
            `game${gameNr.charAt(gameNr.length - 1)}`,
            'teamOrange'
          );
          break;
        case 'Albastru':
          selectedScorers = this.getTeamArray(
            `game${gameNr.charAt(gameNr.length - 1)}`,
            'teamBlue'
          );
          break;
        case 'Gri':
          selectedScorers = selectedScorers = this.getTeamArray(
            `game${gameNr.charAt(gameNr.length - 1)}`,
            'teamGray'
          );
          break;
      }
      selectedScorers.push(this.fb.control(`${scorerName}`));
    }
  }

  adaugaMarcatorFinala(event: Event) {
    const button = event.target as HTMLElement;
    const selectElement = button.parentNode.querySelector(
      '.selectare'
    ) as HTMLSelectElement;
    const inputListElement = button.parentNode.querySelector(
      '.inputs'
    ) as HTMLInputElement;
    const scorerName = inputListElement.value;
    if (scorerName != '') {
      inputListElement.value = '';
      const gameNr = button.parentNode.querySelector('h3').innerHTML;
      const gamesElements = button.parentElement.querySelectorAll('.match');
      this.addScorerToTheList(scorerName, true);
     // this.changeMatchStatus(gamesElements, selectElement.value);
      const selectValue = selectElement.value;
      let selectedScorers: FormArray;
      const teamPosition = button.parentNode.querySelector(`.${selectValue}`);
      switch (selectValue) {
        case 'Verde':
          selectedScorers = this.getTeamArray(
            `${this.convertFinalName(gameNr)}`,
            `${this.ranking.getTeamPosition(selectValue)}`
          );
          break;
        case 'Portocaliu':
          selectedScorers = this.getTeamArray(
            `${this.convertFinalName(gameNr)}`,
            `${this.ranking.getTeamPosition(selectValue)}`
          );
          break;
        case 'Albastru':
          selectedScorers = this.getTeamArray(
            `${this.convertFinalName(gameNr)}`,
            `${this.ranking.getTeamPosition(selectValue)}`
          );
          break;
        case 'Gri':
          selectedScorers = this.getTeamArray(
            `${this.convertFinalName(gameNr)}`,
            `${this.ranking.getTeamPosition(selectValue)}`
          );
          break;
      }
      selectedScorers.push(this.fb.control(`${scorerName}`));
    }
  }

  convertFinalName(name: string) {
    let finalName: string;
    switch (name) {
      case 'Finala mica':
        finalName = 'smallFinal';
        break;
      case 'Finala mare':
        finalName = 'bigFinal';
        break;
    }
    return finalName;
  }

  addScorerToTheList(name: string, finalGame?: boolean) {
    const scorer = new Scorer(name);
    let scorerExists = false;
    this.scorersList.forEach((element) => {
      if (element.name == name) {
        scorerExists = true;
        element.totalGoluri++;
        if (finalGame) {
          element.goluriFinala++;
        }
      }
    });
    if (!scorerExists) {
      if (finalGame) {
        scorer.goluriFinala++;
      }
      this.scorersList.push(scorer);
    }
  }

  removeGoalFromScorer(
    index: number,
    formArray: FormArray,
    finalMatch?: boolean
  ) {
    const playerNameToRemove = formArray.at(index)?.value;
    for (let i = this.scorersList.length - 1; i >= 0; i--) {
      const scorer = this.scorersList[i];
      if (scorer.name === playerNameToRemove) {
        if (scorer.totalGoluri === 1) {
          this.scorersList.splice(i, 1);
        } else {
          scorer.totalGoluri--;
          if (finalMatch == true ) {
            scorer.goluriFinala--;
          }
        }
      }
    }
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

  changeMatchStatus(games: NodeListOf<Element>, teamColor: string) {
    games.forEach((game) => {
      const divEl = game.querySelector(`.${teamColor}`);
      if (divEl !== null) {
        game.setAttribute('match-status', 'played match');
      }
    });
  }

  removeScorer(i: number, theFormArray: FormArray, finalMatch?: boolean) {
    if (!finalMatch) {
      this.removeGoalFromScorer(i, theFormArray, true);
      theFormArray.removeAt(i);
    } else {
      this.removeGoalFromScorer(i, theFormArray);
      theFormArray.removeAt(i);
    }
  }

  onSubmit() {
    console.log(this.footballForm);
  }
}
