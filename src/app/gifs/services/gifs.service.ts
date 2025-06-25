import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

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
    }).pipe(map((data => GifMapper.mapGiphyItemsToGifArray(data.data))))

    // .subscribe((data) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(data.data)
    //   console.log('Search', {gifs})
    // })
  }


}
