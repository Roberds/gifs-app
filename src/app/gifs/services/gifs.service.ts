import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }


  loadTrendingGifs() {

    this.http.get<GiphyResponse>(`${environment.gifsBase}/gifs/trending`, {
      params: {
        api_key: environment.gifApiKey,
        limit: 20,
        ofsset: 0
      }
    }).subscribe((data) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(data.data)
      this.trendingGifs.set(gifs)
      // console.log('Trending', {gifs})
    })
  }


  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.gifsBase}/gifs/search`, {
      params: {
        api_key: environment.gifApiKey,
        q: query,
        limit: 20,
        ofsset: 0
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


}
