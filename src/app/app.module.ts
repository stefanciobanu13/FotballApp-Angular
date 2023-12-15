import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoundComponent } from './round/round.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ScorerDirective } from './scorer.directive';
import { UpdateScoreDirective } from './update-score.directive';


@NgModule({
  declarations: [
    AppComponent,
    RoundComponent,
    ScorerDirective,
    UpdateScoreDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [RoundComponent],
})
export class AppModule {}
