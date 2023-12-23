import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoundComponent } from './round/round.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScorerDirective } from './scorer.directive';
import { UpdateScoreDirective } from './update-score.directive';
import { GamesComponent } from './games/games.component';
import { FormService } from './form.service';

@NgModule({
  declarations: [
    AppComponent,
    RoundComponent,
    ScorerDirective,
    UpdateScoreDirective,
    GamesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FormService],
  bootstrap: [RoundComponent],
})
export class AppModule {}
