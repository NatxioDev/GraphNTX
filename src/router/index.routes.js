import { pages } from "../controllers/index";

let content = document.getElementById("root");
const router = (route) => {
  content.innerHTML = "";
  switch (route) {
    case "#/": {
      return content.appendChild(pages.grafos());
    }
    case "#/jhonson": {
      return content.appendChild(pages.jhonson());
    }
    default:
      return content.appendChild(pages.notFound());
  }
};

export { router };
