import { Datas, MovieData } from "../types";

export class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    fetch(this.url)
      .then((response) => response.json())
      .then(cb)
      .catch(() => {
        console.error("데이터를 불러오지 못했습니다.");
      });
  }
}

export class searchMovie extends Api {
  constructor(url: string) {
    super(url);
  }
  getData(cb: (data: Datas) => void): void {
    return this.getRequest<Datas>(cb);
  }
}

export class detailMovie extends Api {
  constructor(url: string) {
    super(url);
  }
  getData(cb: (data: MovieData) => void): void {
    return this.getRequest<MovieData>(cb);
  }
}
