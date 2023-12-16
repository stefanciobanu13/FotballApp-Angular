import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appUpdateScore]',
})
export class UpdateScoreDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  private mutationObserver!: MutationObserver;

  ngOnInit(): void {
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
  }
  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}
