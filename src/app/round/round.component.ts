import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModel } from '@angular/forms';


interface Player {
  firstName: String;
  lastName: String;
  grade: number;
}

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})

export class RoundComponent implements OnInit, AfterViewInit{
  constructor(private http: HttpClient) {}

 selectedPlayer: string = '';
 selectedPlayers: string[] = [];
 table : any;

  ngOnInit() :void {
    this.http.get<Player[]>("http://localhost:8080/players")
      .subscribe(response => {
        const playersListElement = document.getElementById('playersList');
        if (playersListElement) {
          response.forEach(player => {
            const option = document.createElement('option');
            option.value = `${player.firstName}${player.lastName}`;
            playersListElement.appendChild(option);
          })
        }
      });
  }

ngAfterViewInit(){

}

 findFirstEmptyPosition() {
  const table = document.getElementById('teams');
  if(table){
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

  if (emptyPosition&&this.table) {
    const { row, column } = emptyPosition;
    const cell = this.table.rows[row].cells[column];

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');

    cell.innerHTML = '';
    cell.textContent = this.selectedPlayer;
    cell.appendChild(deleteIcon);
    this.selectedPlayer=''
  }
}

trashIconDelete(event:Event){
  const targetElement = event.target as HTMLElement
   if (targetElement.classList.contains('delete-button')) {
  const cell = targetElement.parentNode as HTMLElement;
  if(cell){
  cell.innerHTML = '';
  }
 }
}

}

















