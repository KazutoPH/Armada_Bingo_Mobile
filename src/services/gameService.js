import http from "./httpService";
import hrlpr from "../../cryptos";
const apiEndpoint = "/game";

export async function getgames() {
  try {
    const { data } = await http.post(apiEndpoint + "/get");

    return hrlpr.decryptobj(data);
  } catch (ex) {}
}
export async function buyticket(obj) {
  const getproobj = hrlpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + "/buyticket", {
    enc: getproobj,
  });

  return hrlpr.decryptobj(data);
}
export async function gettickets() {
  try {
    const { data } = await http.post(apiEndpoint + "/getticket");

    return hrlpr.decryptobj(data);
  } catch (ex) {}
}
export async function drawnumbers() {
  try {
    const { data } = await http.post("/num/getnumbingo");

    return hrlpr.decryptobj(data);
  } catch (ex) {}
}
export async function gamebingo(obj) {
  const getproobj = hrlpr.encryptobj(obj);
  const { data } = await http.post("/gm/win", { enc: getproobj });

  return hrlpr.decryptobj(data);
}
export async function canceltickets(obj) {
  const getproobj = hrlpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + "/canceltick", {
    enc: getproobj,
  });

  return hrlpr.decryptobj(data);
}
// drawnumbers
export default {
  getgames,
  buyticket,
  gettickets,
  drawnumbers,
  gamebingo,
  canceltickets,
};
