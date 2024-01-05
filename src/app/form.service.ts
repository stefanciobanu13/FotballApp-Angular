import {
  Injectable,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { Observable, of, shareReplay } from 'rxjs';
import { RankingService } from './ranking.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public footballForm: FormGroup;

  constructor(private fb: FormBuilder, private ranking: RankingService) {
    this.footballForm = this.fb.group({
      game1: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game2: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game3: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game4: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game5: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
      game6: this.fb.group({
        teamOrange: this.fb.array([]),
        teamGreen: this.fb.array([]),
        teamBlue: this.fb.array([]),
        teamGray: this.fb.array([]),
      }),
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
    const gameNr = button.parentNode.querySelector('h3').innerHTML;
    const gamesElements = button.parentElement.querySelectorAll('.match');
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
      }
    });
  }

  removeScorer(i: number, theFormArray: FormArray) {
    theFormArray.removeAt(i);
  }

  onSubmit() {
    console.log(this.footballForm);
  }
}
