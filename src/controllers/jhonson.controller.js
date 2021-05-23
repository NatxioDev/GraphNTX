import view from "../views/jhonson.html"

export default () => {
  
  const element = document.createElement("div");
  element.innerHTML = view;
  return element;
};
