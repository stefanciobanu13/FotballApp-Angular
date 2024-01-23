import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoundComponent } from './round/round.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateScoreDirective } from './update-score.directive';
import { GamesComponent } from './games/games.component';
import { FormService } from './form.service';
import { RankingComponent } from './ranking/ranking.component';
import { TeamSortPipe } from './team-sort.pipe';
import { RouterModule, Routes } from '@angular/router';
import { DisplayRoundsComponent } from './display-rounds/display-rounds.component';
import { DbPlayersComponent } from './db-players/db-players.component';

const appRoute: Routes = [
  { path: 'dd', component: RoundComponent },
  { path: 'Rounds', component: DisplayRoundsComponent },
  { path:'Players',component:DbPlayersComponent},
  { path: '', component: RoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RoundComponent,
    UpdateScoreDirective,
    GamesComponent,
    RankingComponent,
    TeamSortPipe,
    DisplayRoundsComponent,
    DbPlayersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoute),
  ],
  providers: [FormService],
  bootstrap: [AppComponent],
})
export class AppModule {}
