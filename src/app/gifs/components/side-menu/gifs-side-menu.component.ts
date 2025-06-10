import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GifsSideMenuHeaderComponent } from './side-menu-header/gifs-side-menu-header.component';
import { GifsSideMenuOptionsComponent } from './side-menu-options/gifs-side-menu-options.component';


interface MenuOption {
  icon: string;
  label: string;
  route: string;
  sublabel: string;
}

@Component({
  selector: 'gifs-side-menu',
  imports: [GifsSideMenuHeaderComponent, GifsSideMenuOptionsComponent],
  templateUrl: './gifs-side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsSideMenuComponent {

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Gifs populares',
      route: '/dashboard/trending'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      sublabel: 'Buscar gifs',
      route: '/dashboard/search'
    }
  ]

 }
