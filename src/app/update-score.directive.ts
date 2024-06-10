import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { RankingService } from './ranking.service';

@Directive({
  selector: '[appUpdateScore]',
})
export class UpdateScoreDirective implements AfterContentInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ranking: RankingService
  ) {}
  private mutationObserver!: MutationObserver;
  @Output() directiveExecuted: EventEmitter<void> = new EventEmitter<void>();

  ngAfterContentInit(): void {
    this.observeListChanges();
  }
  private observeListChanges() {
    const callback: MutationCallback = () => {
      this.updateScore();
    };

    const leftList = this.el.nativeElement.querySelector('.left-team-info');
    const rightList = this.el.nativeElement.querySelector('.right-team-info');
    this.mutationObserver = new MutationObserver(callback);
    this.mutationObserver.observe(leftList, { childList: true, subtree: true });
    this.mutationObserver.observe(rightList, {
      childList: true,
      subtree: true,
    });
    this.updateScore();
  }

  updateScore() {
    const leftList = this.el.nativeElement.querySelector('.left-team-info');
    const rightList = this.el.nativeElement.querySelector('.right-team-info');
    const scoreElement = this.el.nativeElement.querySelector('.scor');

    if (leftList && rightList && scoreElement) {
      const leftCount = leftList.querySelectorAll('input').length;
      const rightCount = rightList.querySelectorAll('input').length;
      const scoreText = `${leftCount} - ${rightCount}`;
      this.renderer.setProperty(scoreElement, 'innerText', scoreText);
    }
    this.directiveExecuted.emit();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}
