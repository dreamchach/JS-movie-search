import { RouteInfo } from "../types";
import { View } from "./view";

export class Router {
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
