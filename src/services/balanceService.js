import http from './httpService';
import hrlpr from '../../cryptos';

export async function getbalances() {
  try {
    const { data } = await http.post('/balance/getbaln');

    return hrlpr.decryptobj(data);
  } catch (ex) {}
}

export async function payprepaid(obj) {
  const validaobj = hrlpr.encryptobj(obj);
  const { data } = await http.post('coupad/baladbycoup', { enc: validaobj });
  return hrlpr.decryptobj(data);
}
export async function paysendqr(obj) {
  const validaobj = hrlpr.encryptobj(obj);

  const { data } = await http.post('coupad/sendqr', { enc: validaobj });
  return hrlpr.decryptobj(data);
}
export async function paysendnumber(obj) {
  const validaobj = hrlpr.encryptobj(obj);

  const { data } = await http.post('coupad/usrcheck', { enc: validaobj });
  return hrlpr.decryptobj(data);
}
export default {
  getbalances,
  payprepaid,
  paysendqr,
  paysendnumber,
};
