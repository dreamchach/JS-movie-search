import { clientId } from "../../config";

declare global {
  interface Window {
    naver: any;
  }
}

export abstract class View {
  container: HTMLElement;
  htmlList: string[];
  renderTemplate: string;
  template: string;

  constructor(containerId: string) {
    const containerElement = document.getElementById(containerId);
    const { naver } = window;

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
