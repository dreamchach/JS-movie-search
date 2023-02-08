import { View } from "../core/view";
import { db_apikey } from "../../config";
import { detailMovie } from "../core/api";

export default class MovieDetail extends View {
  constructor(containerId: string) {
    super(containerId);
    console.log(4);
  }

  render(): void {
    console.log(6);
    // location.search = "";
    const id: string = location.hash.substring(7);
    console.log("id", id);
    const IDMOVIE_URL: string = `https://www.omdbapi.com/?apikey=${db_apikey}&i=@movieId&plot=full&r=json`;
    let api = new detailMovie(IDMOVIE_URL.replace("@movieId", id));
    let a = api.getData();

    this.addHtml(`
      <div>
        <div>{{__Title__}}<div>
        <div>
          <div><img src="{{__Poster__}}"/></div>
          <div>Actors : {{__Actors__}}</div>
          <div>Awards : {{__Awards__}}</div>
          <div>Director : {{__Director__}}</div>
          <div>Genre : {{__Genre__}}</div>
          <div>{{__Plot__}}</div>
          <div>Released : {{__Released__}}</div>
          <div>Runtime : {{__Runtime__}}</div>
          <div>Writer : {{__Writer__}}</div>
          <div>Year : {{__Year__}}</div>
          <div>imdbRating : {{__imdbRating__}}</div>
    `);
    for (let i of a.Ratings) {
      this.addHtml(`
        <div>
          <div>{{__Source__}}</div>
          <div>{{__Value__}}</div>
        </div>
      `);
      this.setTemplateData("Source", i.Source);
      this.setTemplateData("Value", i.Value);
    }
    this.addHtml(`
    <div>
      <div>
        <div>평점을 추가해주세요!</div>
        <div>
          <select>
            <option>*****</option>
            <option>****</option>
            <option>***</option>
            <option>**</option>
            <option>*</option>
          </select>
        </div>
      </div>
    </div>
    `);

    this.setTemplateData("movies_data", this.getHtml());
    this.setTemplateData("Title", a.Title);
    this.setTemplateData("Poster", a.Poster);
    this.setTemplateData("Actors", a.Actors);
    this.setTemplateData("Awards", a.Awards);
    this.setTemplateData("Director", a.Director);
    this.setTemplateData("Genre", a.Genre);
    this.setTemplateData("Plot", a.Plot);
    this.setTemplateData("Released", a.Released);
    this.setTemplateData("Runtime", a.Runtime);
    this.setTemplateData("Writer", a.Writer);
    this.setTemplateData("Year", a.Year);
    this.setTemplateData("imdbRating", a.imdbRating);
    this.updateView();
  }
}
