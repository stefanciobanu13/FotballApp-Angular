import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveFormDataService {
  constructor(private http: HttpClient) {}

  url: string = 'http://localhost:8080/';

  saveFormData(form: FormGroup): Observable<any> {
    console.log('inside the post method');

    const roundNr = form.get('roundNumber').value;
    const roundDate = form.get('roundDate').value;
    const formatedDate = this.convertDateFormat(roundDate);
    const roundJSON = {
      date: formatedDate,
      number: roundNr,
    };
    return this.http.post(`${this.url}rounds`, roundJSON);
  }

  convertDateFormat(inputDate: string): string {
    const [year, month, day] = inputDate.split('-');
    const newDateFormat = `${month}.${day}.${year}`;
    return newDateFormat;
  }

  saveRound(roundData: any): Observable<any> {
    return this.http.post(`${this.url}round`, roundData);
  }

  saveTeam(teamData: any): Observable<any> {
    return this.http.post(`${this.url}teams`, teamData);
  }
}
