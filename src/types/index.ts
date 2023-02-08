import { View } from "../core/view";

export interface Datas {
  readonly Search: DataShort[];
  readonly totalResults: string;
  readonly Response: string;
}

export interface DataShort {
  readonly Title: string;
  readonly Year: string;
  readonly imdbID: string;
  readonly Type: string;
  readonly Poster: string;
}

export interface MovieData extends DataShort {
  readonly Rated: string;
  readonly Released: string;
  readonly Runtime: string;
  readonly Genre: string;
  readonly Director: string;
  readonly Writer: string;
  readonly Actors: string;
  readonly Plot: string;
  readonly Language: string;
  readonly Country: string;
  readonly Awards: string;
  readonly Ratings: [{ Source: string; Value: string }];
  readonly Metascore: string;
  readonly imdbRating: string;
  readonly imdbVotes: string;
  readonly DVD: string;
  readonly BoxOffice: string;
  readonly Production: string;
  readonly Website: string;
  readonly Response: string;
}

export interface RouteInfo {
  path: string;
  page?: View;
}
