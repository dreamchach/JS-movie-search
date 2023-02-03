import { addListener } from "process";
import "./env.js";

interface Datas {
  readonly Search: DataShort[];
  readonly totalResults: string;
  readonly Response: string;
}

interface DataShort {
  readonly Title: string;
  readonly Year: string;
  readonly imdbID: string;
  readonly Type: string;
  readonly Poster: string;
}

interface MovieData extends DataShort {
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

interface RouteInfo {
  path: string;
  page?: View;
}

declare global {
  interface Window {
    naver: any;
  }
}
const { naver } = window;

const db_apikey: string | undefined = process.env.APIKEY;
const clientId: string | undefined = process.env.CLIENT_ID;
// const recommend: string[] | null = [];

class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response) as AjaxResponse;
  }
}

class searchMovie extends Api {
  getData(): Datas {
    return this.getRequest<Datas>();
  }
}

class detailMovie extends Api {
  getData(): MovieData {
    return this.getRequest<MovieData>();
  }
}

abstract class View {
  container: HTMLElement;
  htmlList: string[];
  renderTemplate: string;
  template: string;

  constructor(containerId: string) {
    const containerElement = document.getElementById(containerId);

    if (!containerElement) {
      throw "최상위 컨테이너가 없어 UI를 진행하지 못합니다.";
    }

    // console.log("naver", naverLogin.user);

    this.template = `
    <div>
        <header>
            <h1>Where is myMovie?</h1>
            <input type="search"/>
            <a id='naverIdLogin_loginButton' href='javascript:void(0)'>
            <span>네이버 로그인</span>
            </a>
        </header>
        <aside>
            <div>별점</div>
            <a href="#/like/fivestar">*****</a>
            <a href="#/like/fourstar">****</a>
            <a href="#/like/threestar">***</a>
            <a href="#/like/twotar">**</a>
            <a href="#/like/onestar">*</a>
        </aside>
        <main>
            {{__movies_data__}}
        </main>
    </div>
    `;

    this.container = containerElement;
    this.htmlList = [];
    this.renderTemplate = this.template;
    console.log(1);

    let naverLogin = new naver.LoginWithNaverId({
      clientId: `${clientId}`,
      callbackUrl: "http://localhost:1234/naverLogin",
      isPopup: false,
      callbackHandle: true,
    });
    naverLogin.init();

    window.addEventListener("load", function () {
      naverLogin.getLoginStatus(function (status: boolean) {
        if (status) {
          const email = naverLogin.user.getEmail();
          if (email === undefined || email === null) {
            alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
            naverLogin.reprompt();
            return;
          }
          // console.log(naverLogin.user.email);
          return naverLogin.user;
        } else {
          console.log("callback 처리에 실패했습니다.");
        }
      });
    });
  }
  updateView(): void {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  clearHtmlList(): void {
    this.htmlList = [];
  }
  abstract render(): void;
}

class Router {
  routeTable: RouteInfo[];
  defaultRoute: RouteInfo | null;
  searchDefaultRoute: RouteInfo[];

  constructor() {
    addEventListener("hashchange", this.route.bind(this));
    this.routeTable = [];
    this.defaultRoute = null;
    this.searchDefaultRoute = [];
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = { path: "", page };
  }

  setSearchDefaultPage(page: View): void {
    this.routeTable.push({ path: "", page });
  }

  route() {
    const routePath = location.hash;

    if (routePath === "" && !location.search) {
      this.defaultRoute;
      console.log("A");
    }
    for (const routeInfo of this.searchDefaultRoute) {
      if (!!location.search && !routePath && routeInfo.page !== undefined) {
        routeInfo.page.render();
        console.log("B");
        break;
      }
    }
    for (let routeInfo of this.routeTable) {
      if (routePath.includes(routeInfo.path) && routeInfo.page !== undefined) {
        routeInfo.page.render();
        console.log("hello", "path", routePath, "infopath", routeInfo.path);
        // break;
      }
    }
  }
}

class Default extends View {
  constructor(containerId: string) {
    super(containerId);
    this.setTemplateData("movies_data", "");
    this.updateView();
    window.addEventListener("search", this.search.bind(this));
    console.log(2);
  }
  render(): void {}
  search(event: Event): void {
    // location.pathname = "";
    const target = event.target as HTMLInputElement;
    location.search = `${target.value}`;
  }
}

class SearchRender extends View {
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

class MovieDetail extends View {
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

// localStorage.setItem("recomm", recommend);

const router: Router = new Router();
const defaultPage = new Default("root");
const searchRender = new SearchRender("root");
const movieDetail = new MovieDetail("root");

router.setDefaultPage(defaultPage);
router.setSearchDefaultPage(searchRender);
router.addRoutePath("show", movieDetail);
router.addRoutePath("page", searchRender);

router.route();
