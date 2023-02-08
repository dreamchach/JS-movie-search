// import { addListener } from "process";
import "./env.js";
import { Router } from "./src/core/router";
import { Default, SearchRender, MovieDetail } from "./src/page/index";

const router: Router = new Router();
const defaultPage = new Default("root");
const searchRender = new SearchRender("root");
const movieDetail = new MovieDetail("root");

router.setDefaultPage(defaultPage);
router.setSearchDefaultPage(searchRender);
router.addRoutePath("show", movieDetail);
router.addRoutePath("page", searchRender);

router.route();
