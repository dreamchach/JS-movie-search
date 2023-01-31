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

const db_apikey: string | undefined = process.env.APIKEY;
const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest();

const recommend: string[] | null = [];

let template: string = `
<div>
    <header>
        <h1>Where is myMovie?</h1>
        <input type="search"/>
        {{__login?__}}
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

const getData = <AjaxResponse extends {}>(url: string): AjaxResponse => {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const updateView = (html: string): void => {
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("최상위 컨테이너가 없어 UI를 진행하지 못합니다.");
  }
};

const firstRender = (): void => {
  const firstTemplate = template.replace("{{__movies_data__}}", "");
  updateView(firstTemplate);
};

const searchRender = (): void => {
  const data = [];
  let currentPage: number = Number(location.hash.substring(7)) || 1;
  let MOVIE_URL: string = `https://www.omdbapi.com/?apikey=${db_apikey}&s=@moviename&page=${currentPage}`;
  const movie: Datas = getData(MOVIE_URL.replace("@moviename", location.search.substring(1)));
  console.log(movie, location.search.substring(1));

  getData(MOVIE_URL.replace("@moviename", location.search));

  data.push(`<div><ul>`);
  for (let i = 0; i < movie.Search.length; i += 1) {
    data.push(`
        <a href="/page=${movie.Search[i].imdbID}">
            <img src="${movie.Search[i].Poster}"/>
            <div>${movie.Search[i].Title}(${movie.Search[i].Year})</div>
        </a>
    `);
    recommend.push(`${movie.Search[i].imdbID}`);
  }
  data.push(`</ul></div><div>`);
  if (currentPage > 1) {
    data.push(`
        <a href="#/page=${currentPage - 1}">Prev</a>
    `);
  }
  if (Number(movie.totalResults) > currentPage * 10) {
    data.push(`
        <a href="#/page=${Number(currentPage) + 1}">Next</a>
    `);
  }
  let searchTemplate = template.replace("{{__movies_data__}}", data.join(""));
  updateView(searchTemplate);
};

const movieDetail = (): void => {
  const id: string = location.pathname.substring(6);
  const IDMOVIE_URL: string = `https://www.omdbapi.com/?apikey=${db_apikey}&i=@movieId&plot=full&r=json`;
  const a: MovieData = getData(IDMOVIE_URL.replace("@movieId", id));
  console.log(a);
  let data = [];
  data.push(`
        <div>
          <div>${a.Title}<div>
          <div>
            <div><img src="${a.Poster}"/></div>
            <div>Actors : ${a.Actors}</div>
            <div>Awards : ${a.Awards}</div>
            <div>Director : ${a.Director}</div>
            <div>Genre : ${a.Genre}</div>
            <div>${a.Plot}</div>
            <div>Released : ${a.Released}</div>
            <div>Runtime : ${a.Runtime}</div>
            <div>Writer : ${a.Writer}</div>
            <div>Year : ${a.Year}</div>
            <div>imdbRating : ${a.imdbRating}</div>
      `);
  for (let i of a.Ratings) {
    data.push(`
          <div>
            <div>${i.Source}</div>
            <div>${i.Value}</div>
          </div>
        `);
  }
  data.push(`
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
  template = template.replace("{{__movies_data__}}", data.join(""));
  updateView(template);
};
// localStorage.setItem("recomm", recommend);

const constructor = async () => {
  await firstRender();
  if (!!location.search) {
    if (location.pathname !== "/") {
      location.pathname = "";
      searchRender();
    } else searchRender();
  } else if (location.pathname.substring(1, 5) === "page") {
    await movieDetail();
  }
};

constructor();

const hello = (event: Event): void => {
  location.pathname = "";
  const target = event.target as HTMLInputElement;
  location.search = `${target.value}`;
};

addEventListener("search", hello);

addEventListener("hashchange", searchRender);
