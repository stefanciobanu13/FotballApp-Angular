import { Component } from '@angular/core';
import { RankingService } from '../ranking.service';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingComponent {
  
constructor(public ranking:RankingService){}

}
