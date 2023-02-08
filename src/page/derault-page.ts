import { View } from "../core/view";

export default class Default extends View {
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
