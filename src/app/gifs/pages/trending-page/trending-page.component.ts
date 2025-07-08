import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';


@Component({
  selector: 'app-trending',
  imports: [],
  templateUrl: './trending-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPageComponent {

  gifService = inject(GifsService);

  scrollDivRef = viewChild<ElementRef>('groupDiv')

  onScroll(event: Event){
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    console.log({scrollDiv})
  }

}
