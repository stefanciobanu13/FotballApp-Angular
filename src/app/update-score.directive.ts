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

    const leftList = this.el.nativeElement.querySelector('#marcatori-stanga');
    const rightList = this.el.nativeElement.querySelector('#marcatori-dreapta');
    this.mutationObserver = new MutationObserver(callback);
    this.mutationObserver.observe(leftList, { childList: true, subtree: true });
    this.mutationObserver.observe(rightList, { childList: true, subtree: true });

    this.updateScore();
  }

  updateScore() {
    const leftList = this.el.nativeElement.querySelector('#marcatori-stanga');
    const rightList = this.el.nativeElement.querySelector('#marcatori-dreapta');
    const scoreElement = this.el.nativeElement.querySelector('.scor');

    if (leftList && rightList && scoreElement) {
      const leftCount = leftList.children.length;
      const rightCount = rightList.children.length;
      const scoreText = `${leftCount} - ${rightCount}`;
      this.renderer.setProperty(scoreElement, 'innerText', scoreText);
    }
  }
  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }}