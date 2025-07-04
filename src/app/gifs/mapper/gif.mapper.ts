//clase encargada de mapear la respuesta giphy interface, a los datos que necesitamos gifs interface

import { Gif } from "../interfaces/gif.interfaces";
import { GiphyItem } from "../interfaces/giphy.interfaces";

export class GifMapper {

  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url
    }
  }


  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyItemToGif)
  }

}