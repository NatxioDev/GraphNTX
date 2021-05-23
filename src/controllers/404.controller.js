import view from "../views/404.html"

export default () => {
  
  const element = document.createElement("div");
  element.innerHTML = view;
  return element;
};
