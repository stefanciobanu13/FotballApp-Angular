import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public footballForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.footballForm = this.fb.group({
      game1: this.fb.group({
        scorers1: this.fb.array([]),
        scorers2: this.fb.array([]),
        scorers3: this.fb.array([]),
        scorers4: this.fb.array([]),
      }),
    });
  }

  public arrayPlayers: string[] = ['messi', 'ronaldo', 'curtois'];

  get foptballForm() {
    return this.footballForm;
  }

  get scorers1(): FormArray {
    console.log('get scorers1');
    return this.footballForm.get('game1').get('scorers1') as FormArray;
  }

  get scorers2(): FormArray {
    console.log('get scorers2');
    return this.footballForm.get('game1').get('scorers2') as FormArray;
  }

  get scorers3(): FormArray {
    console.log('get scorers3');
    return this.footballForm.get('game1').get('scorers3') as FormArray;
  }

  get scorers4(): FormArray {
    console.log('get scorers4');
    return this.footballForm.get('game1').get('scorers4') as FormArray;
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
    const selectValue = selectElement.value;

    let selectedScorers: FormArray;

    switch (selectValue) {
      case 'Verde':
        selectedScorers = this.scorers1;
        break;
      case 'Portocaliu':
        selectedScorers = this.scorers2;
        break;
      case 'Albastru':
        selectedScorers = this.scorers3;
        break;
      case 'Gri':
        selectedScorers = this.scorers4;
        break;
    }
    selectedScorers.push(this.fb.control(`${scorerName}`));
  }

  removeScorer(i: number, theFormArray: FormArray) {
    theFormArray.removeAt(i);
  }

  onSubmit() {
    console.log(this.footballForm);
  }
}
