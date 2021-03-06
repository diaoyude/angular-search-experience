import { debounceTime, map, filter } from 'rxjs/operators';
import { Directive, AfterViewInit, HostListener, EventEmitter, Output, Inject } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { merge } from 'rxjs/internal/observable/merge';
import { DOCUMENT } from '@angular/platform-browser';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit {
  @Output() scroll = new EventEmitter();

  private scrollEvent$;
  private userScrolledDown$;
  threshold = 300;

  constructor(@Inject(DOCUMENT) private document) {
    this.scrollEvent$ = fromEvent(window, 'scroll');
    this.userScrolledDown$ = this.scrollEvent$.pipe(
      map(() => window.scrollY),
      debounceTime(200),
      filter((current: number) => current >= document.body.clientHeight - window.innerHeight - this.threshold)
    );
  }

  ngAfterViewInit() {
    this.userScrolledDown$.subscribe(event => {
      this.scroll.emit();
    });
  }
}
