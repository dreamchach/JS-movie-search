import { Datas, MovieData } from "../types";

export class Api {
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

export class searchMovie extends Api {
  constructor(url: string) {
    super(url);
  }
  getData(): Datas {
    return this.getRequest<Datas>();
  }
}

export class detailMovie extends Api {
  constructor(url: string) {
    super(url);
  }
  getData(): MovieData {
    return this.getRequest<MovieData>();
  }
}
