import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';


const loadFromLocalStorage = () => {
  const gifFromLocalStorage = localStorage.getItem('gifs') ?? '[]';
  const gifs = JSON.parse(gifFromLocalStorage);
  return gifs;
}

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifsLoading = signal(false);
  trendingGifs = signal<Gif[]>([]);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for(let i = 0; i < this.trendingGifs().length; i+=3){
      groups.push(this.trendingGifs().slice(i, i+3))
    }

    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));


  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  })


  loadTrendingGifs() {

    if(this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.gifsBase}/gifs/trending`, {
      params: {
        api_key: environment.gifApiKey,
        limit: 20,
        offset: this.trendingPage() * 20,
      }
    }).subscribe((data) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(data.data)
      console.log({data})
      this.trendingGifs.update((currentGifs) => [...currentGifs,...gifs]); //en el primer arreglo que creamos añade el segundo de gifs
      this.trendingPage.update((page) => page + 1);
      this.trendingGifsLoading.set(false);
      //console.log(this.trendingPage())
    })
  }


  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.gifsBase}/gifs/search`, {
      params: {
        api_key: environment.gifApiKey,
        q: query,
        limit: 20,
        offset: 0
      }
    }).pipe(map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      // Historial
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }


}
