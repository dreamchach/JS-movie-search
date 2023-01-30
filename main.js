import "./env.js";

const db_apikey = process.env.APIKEY;
const container = document.getElementById("root");
const ajax = new XMLHttpRequest();

let recommend = [];

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const firstRender = (data) => {
  let template = `
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
  template = template.replace("{{__movies_data__}}", data || "");
  container.innerHTML = template;
};

const movieSearchRender = () => {
  let currentPage = location.hash.substring(7) || 1;
  let MOVIE_URL = `https://www.omdbapi.com/?apikey=${db_apikey}&s=@moviename&page=${currentPage}`;
  const movie = getData(MOVIE_URL.replace("@moviename", location.search));
  let data = [];

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
  if (movie.totalResults > currentPage * 10) {
    data.push(`
        <a href="#/page=${Number(currentPage) + 1}">Next</a>
    `);
  }
  firstRender(data.join(""));
};

const movieRender = () => {
  if (location.search !== "") {
    movieSearchRender();
  }

  if (location.pathname.substring(1, 5) === "page") {
    if (location.search !== "") {
      location.pathname = "";
      movieSearchRender();
    }
    const id = location.pathname.substring(6);
    const IDMOVIE_URL = `https://www.omdbapi.com/?apikey=${db_apikey}&i=@movieId&plot=full&r=json`;
    const a = getData(IDMOVIE_URL.replace("@movieId", id));
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
    firstRender(data.join(""));
  }

  localStorage.setItem("recomm", recommend);
};

const constructor = async () => {
  await firstRender();
  await movieRender();
};

constructor();

const hello = (event) => {
  location.pathname = "";
  location.search = `${event.target.value}`;
};

addEventListener("search", hello);

addEventListener("hashchange", movieRender);
