import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { FormService } from '../form.service';
import { Observable } from 'rxjs';
import { FormArray, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit {
  @Input() players: string[];
  @Input() selectedPlayers: string[] = [];
  formArrayData: Observable<FormArray>;
  formArrayData2: Observable<FormArray>;
  formArrayData3: Observable<FormArray>;
  formArrayData4: Observable<FormArray>;

  constructor(public form: FormService) {}

  ngOnInit(): void {
    this.formArrayData = this.form.getScorerArrayObs('game1', 'teamOrange');
    this.formArrayData2 = this.form.getScorerArrayObs('game1', 'teamGreen');
    this.formArrayData3 = this.form.getScorerArrayObs('game1', 'teamBlue');
    this.formArrayData4 = this.form.getScorerArrayObs('game1', 'teamGray');

  }

  getFormArrayData(gameNr: string, teamName: string): Observable<FormArray> {
    return this.form.getScorerArrayObs(gameNr, teamName);
  }

  trashIconDelete(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('delete-button')) {
      const cell = targetElement.parentNode as HTMLElement;
      if (cell) {
        cell.innerHTML = '';
        cell.remove;
      }
    }
  }
}
