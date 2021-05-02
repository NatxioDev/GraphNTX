import { nodes } from "./index";

export function generarNuevoId() {
  let res = 0;
  nodes.forEach((node) => {
    node.id === res ? (res = res + 1) : res;
  });
  return res;
}
