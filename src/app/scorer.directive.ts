import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appScorer]',
})
export class ScorerDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLButtonElement): void {
    const teamColor: string = this.el.nativeElement.parentElement.querySelector('.selectare').value;
    switch (teamColor) {
      case 'Verde':
        this.addScorerToList(teamColor);
        break;
      case 'Portocaliu':
        this.addScorerToList(teamColor);
        break;
      case 'Albastru':
        this.addScorerToList(teamColor);
        break;
      case 'Gri':
        this.addScorerToList(teamColor);
        break;
    }
  }

  addScorerToList(teamsColor: string) {
    const inputElement = this.el.nativeElement.parentElement.querySelector('.inputs');
    const colorDiv = this.el.nativeElement.parentElement.querySelector(`.${teamsColor}`);
    const ulElement = colorDiv
      .closest('.match-info')
      .querySelector(`.list-${teamsColor}`);
    if (
      inputElement instanceof HTMLInputElement &&
      ulElement instanceof HTMLUListElement
    ) {
      const inputValue = inputElement.value;
      if (inputValue.trim() !== '') {
        const liElement = this.renderer.createElement('li');
        this.renderer.setProperty(liElement, 'textContent', inputValue);
        this.renderer.appendChild(ulElement, liElement);
        this.renderer.setProperty(inputElement, 'value', '');
      }
    }
  }
}
