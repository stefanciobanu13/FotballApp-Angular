import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Output,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Form, FormArray, FormBuilder, NgModel } from '@angular/forms';
import { concat } from 'rxjs';
import { FormService } from '../form.service';

interface Player {
  firstName: String;
  lastName: String;
  grade: number;
}

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public form: FormService,
    private fb: FormBuilder
  ) {}

  selectedPlayer: string = '';
  @Output() selectedPlayers: string[] = [];
  @Output() players: string[] = [];
  teamOrange: string[] = [];
  teamGreen: string[] = [];
  teamBlue: string[] = [];
  teamGray: string[] = [];
  scorer: string = '';
  table: any;
  roundNr: string;
  roundDate: string;

  ngOnInit(): void {
    this.http
      .get<Player[]>('http://localhost:8080/players')
      .subscribe((response) => {
        const playersListElement = document.getElementById('playersList');
        if (playersListElement) {
          response.forEach((player) => {
            const option = document.createElement('option');
            option.value = `${player.firstName}${player.lastName}`;
            playersListElement.appendChild(option);
          });
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

  attendPlayer() {
    this.table = document.getElementById('teams') as HTMLTableElement;
    const emptyPosition = this.findFirstEmptyPosition();
    if (emptyPosition && this.table && this.selectedPlayer !== '') {
      const { row, column } = emptyPosition;
      const cell = this.table.rows[row].cells[column];
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');
      cell.innerHTML = '';
      cell.textContent = this.selectedPlayer;
      cell.appendChild(deleteIcon);
      this.selectedPlayer = '';
    }
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

 async submitTeams() {
    this.removeDeleteButtons();
    const table = document.getElementById('teams');
    if (table) {
      const rows = table.getElementsByTagName('tr');
      for (let j = 0; j < rows[0].cells.length; j++) {
        for (let i = 0; i < rows.length; i++) {
          const cellContent = rows[i].cells[j].innerText;
          if (cellContent !== '') {
            this.players.push(cellContent);
          }
          // else {
          //   // alert('The number of players should be 24');
          //   //   this.players = [];    DECOMMENT THIS IS THE FURURE
          //   return;
          // }
        }
      }
    }
   await this.createTeams();
   await  this.submitTeamsToForm(this.teamOrange, 'teamPortocaliu');
   await this.submitTeamsToForm(this.teamGreen, 'teamVerde');
   await this.submitTeamsToForm(this.teamBlue, 'teamAlbastru');
   await this.submitTeamsToForm(this.teamGray, 'teamGri');
   await this.submitRoundInfo();
  }

 async submitRoundInfo() {
    this.form.footballForm.get('roundNumber').setValue(this.roundNr);
    this.form.footballForm.get('roundDate').setValue(this.roundDate);
  }

 async createTeams() {
    const rows = this.table.getElementsByTagName('tr');
    let cellContent;
    for (let j = 0; j < rows[0].cells.length; j++) {
      for (let i = 0; i < rows.length; i++) {
        cellContent = rows[i].cells[j].innerText;
        switch (j) {
          case 0:
            this.teamOrange.push(cellContent);
            break;
          case 1:
            this.teamGreen.push(cellContent);
            break;
          case 2:
            this.teamBlue.push(cellContent);
            break;
          case 3:
            this.teamGray.push(cellContent);
        }
      }
    }
  }

  removeDeleteButtons() {
    const rows = this.table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const deleteButton = cells[j].querySelector('.delete-button');
        if (deleteButton) {
          deleteButton.remove();
        }
      }
    }
  }

  async submitTeamsToForm(team: any[], teamName: string) {
    const formArrayTeam = this.form.footballForm.get(
      `${teamName}`
    ) as FormArray;
    team.forEach((scorer) => {
      formArrayTeam.push(this.fb.control(`${scorer}`));
    });
  }
}
