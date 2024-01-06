import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ViewChildren,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  QueryList,
} from '@angular/core';
import { FormService } from '../form.service';
import { RankingService } from '../ranking.service';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';
import { UpdateScoreDirective } from '../update-score.directive';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit, AfterViewInit {
  @Input() players: string[];
  @Input() selectedPlayers: string[] = [];
  @ViewChildren('matchRef') matchRefs: QueryList<ElementRef>;
  @ViewChildren(UpdateScoreDirective)updateScoreDirectives: QueryList<UpdateScoreDirective>;

  clasament: Observable<any[]>;
  teamOrangeG1: Observable<FormArray>;
  teamGreenG1: Observable<FormArray>;
  teamBlueG1: Observable<FormArray>;
  teamGrayG1: Observable<FormArray>;
  teamOrangeG2: Observable<FormArray>;
  teamGreenG2: Observable<FormArray>;
  teamBlueG2: Observable<FormArray>;
  teamGrayG2: Observable<FormArray>;
  teamOrangeG3: Observable<FormArray>;
  teamGreenG3: Observable<FormArray>;
  teamBlueG3: Observable<FormArray>;
  teamGrayG3: Observable<FormArray>;
  teamOrangeG4: Observable<FormArray>;
  teamGreenG4: Observable<FormArray>;
  teamBlueG4: Observable<FormArray>;
  teamGrayG4: Observable<FormArray>;
  teamOrangeG5: Observable<FormArray>;
  teamGreenG5: Observable<FormArray>;
  teamBlueG5: Observable<FormArray>;
  teamGrayG5: Observable<FormArray>;
  teamOrangeG6: Observable<FormArray>;
  teamGreenG6: Observable<FormArray>;
  teamBlueG6: Observable<FormArray>;
  teamGrayG6: Observable<FormArray>;
  matchStatus1: string = 'unplayed match';

  constructor(
    public form: FormService,
    public ranking: RankingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.teamOrangeG1 = this.form.getScorerArrayObs('game1', 'teamOrange');
    this.teamGreenG1 = this.form.getScorerArrayObs('game1', 'teamGreen');
    this.teamBlueG1 = this.form.getScorerArrayObs('game1', 'teamBlue');
    this.teamGrayG1 = this.form.getScorerArrayObs('game1', 'teamGray');
    this.teamOrangeG2 = this.form.getScorerArrayObs('game2', 'teamOrange');
    this.teamGreenG2 = this.form.getScorerArrayObs('game2', 'teamGreen');
    this.teamBlueG2 = this.form.getScorerArrayObs('game2', 'teamBlue');
    this.teamGrayG2 = this.form.getScorerArrayObs('game2', 'teamGray');
    this.teamOrangeG3 = this.form.getScorerArrayObs('game3', 'teamOrange');
    this.teamGreenG3 = this.form.getScorerArrayObs('game3', 'teamGreen');
    this.teamBlueG3 = this.form.getScorerArrayObs('game3', 'teamBlue');
    this.teamGrayG3 = this.form.getScorerArrayObs('game3', 'teamGray');
    this.teamOrangeG4 = this.form.getScorerArrayObs('game4', 'teamOrange');
    this.teamGreenG4 = this.form.getScorerArrayObs('game4', 'teamGreen');
    this.teamBlueG4 = this.form.getScorerArrayObs('game4', 'teamBlue');
    this.teamGrayG4 = this.form.getScorerArrayObs('game4', 'teamGray');
    this.teamOrangeG5 = this.form.getScorerArrayObs('game5', 'teamOrange');
    this.teamGreenG5 = this.form.getScorerArrayObs('game5', 'teamGreen');
    this.teamBlueG5 = this.form.getScorerArrayObs('game5', 'teamBlue');
    this.teamGrayG5 = this.form.getScorerArrayObs('game5', 'teamGray');
    this.teamOrangeG6 = this.form.getScorerArrayObs('game6', 'teamOrange');
    this.teamGreenG6 = this.form.getScorerArrayObs('game6', 'teamGreen');
    this.teamBlueG6 = this.form.getScorerArrayObs('game6', 'teamBlue');
    this.teamGrayG6 = this.form.getScorerArrayObs('game6', 'teamGray');
    this.clasament = this.ranking.getClasamentObs();
  }

  ngAfterViewInit(): void {
    this.updateScoreDirectives.forEach((directive) => {
      directive.directiveExecuted.subscribe(() => {
        this.matchRefs.forEach((element) => {
          let matchElement = element.nativeElement;
          if (matchElement.getAttribute('match-status') == 'played match') {
            this.ranking.updateClasament(matchElement);
            this.cdr.markForCheck();
          }
        });
      });
    });
  }

  triggerUpdate() {
    this.matchRefs.forEach((element) => {
      let matchElement = element.nativeElement;
      if (matchElement.getAttribute('match-status') == 'played match') {
        this.ranking.updateClasament(matchElement);
        this.cdr.markForCheck();
      }
    });
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
