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
import { UpdateFinalScoreDirective } from './update-final-score.directive';
import { ShowRoundComponent } from './show-round/show-round.component';
import { HomeComponent } from './home/home.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { UpdatePlayerComponent } from './update-player/update-player.component';

const appRoute: Routes = [
  { path: 'dd', component: RoundComponent },
  { path: 'Rounds/:id', component: ShowRoundComponent },
  { path: 'Home', component: HomeComponent },
  { path: 'Editii', component: DisplayRoundsComponent },
  { path: 'Players', component: DbPlayersComponent },
  { path: 'AddPlayer', component: AddPlayerComponent },
  { path: 'UpdatePlayer/:id/:firstName/:lastName/:grade', component: UpdatePlayerComponent },
  { path: '', component: HomeComponent },
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
    UpdateFinalScoreDirective,
    ShowRoundComponent,
    HomeComponent,
    AddPlayerComponent,
    UpdatePlayerComponent,
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
