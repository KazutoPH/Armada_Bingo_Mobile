import http from './httpService';
import hrlpr from '../../cryptos';
const apiEndpoint = '/tic';

export async function newticket(obj) {
  const getproobj = hrlpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + '/newticket', {
    enc: getproobj,
  });

  return hrlpr.decryptobj(data);
}

export async function getsuptickets() {
  try {
    const { data } = await http.post(apiEndpoint + '/gettickets');
    return hrlpr.decryptobj(data);
  } catch (ex) {}
}
export async function comment(obj) {
  const getproobj = hrlpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + '/commentticket', {
    enc: getproobj,
  });

  return hrlpr.decryptobj(data);
}
export default {
  newticket,
  getsuptickets,
  comment,
};
