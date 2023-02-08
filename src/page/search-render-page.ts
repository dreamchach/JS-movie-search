import { View } from "../core/view";
import { Datas } from "../types";
import { searchMovie } from "../core/api";
import { db_apikey } from "../../config";

export default class SearchRender extends View {
  api: searchMovie;
  MOVIE_URL: string;
  movie: Datas;

  constructor(containerId: string) {
    super(containerId);
    location.hash = "";

    this.MOVIE_URL = `https://www.omdbapi.com/?apikey=${db_apikey}&s=@moviename`;
    this.api = new searchMovie(this.MOVIE_URL.replace("@moviename", location.search));
    this.movie = this.api.getData();
    console.log(3);
  }

  render(): void {
    let currentPage = Number(location.hash.substring(7)) || 1;
    this.MOVIE_URL = `https://www.omdbapi.com/?apikey=${db_apikey}&s=@moviename&page=${currentPage}`;
    let api = new searchMovie(this.MOVIE_URL.replace("@moviename", location.search));
    this.movie = api.getData();
    api.getData();

    this.addHtml(`<div><ul>`);
    for (let i = 0; i < this.movie.Search.length; i += 1) {
      const { imdbID, Poster, Title, Year } = this.movie.Search[i];

      this.addHtml(`
          <a href="#/show=${imdbID}">
              <img src="${Poster}"/>
              <div>${Title}(${Year})</div>
          </a>
      `);
      // recommend.push(`${movie.Search[i].imdbID}`);
    }
    this.addHtml(`</ul></div><div>`);
    if (currentPage > 1) {
      this.addHtml(`
          <a href="#/page=${currentPage - 1}">Prev</a>
      `);
    }
    if (Number(this.movie.totalResults) > currentPage * 10) {
      this.addHtml(`
          <a href="#/page=${Number(currentPage) + 1}">Next</a>
      `);
    }

    this.setTemplateData("movies_data", this.getHtml());
    this.updateView();

    console.log(5);
    console.log(currentPage);
    // console.log(this.renderTemplate);
  }
}
