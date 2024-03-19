import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import helpr from '../../cryptos';
import clear_data from '../redux/actions/cleardataAction';

const apiEndpoint = '/user';
const tokenKey = 'token';

http.setJwt(getJwt());

export async function register(user) {
  const userob = helpr.encryptobj(user);

  const datat = await http.post(apiEndpoint + '/reg', { enc: userob });

  return datat.data;
}
export async function insertjwt(obj) {
  try {
    await AsyncStorage.setItem(tokenKey, obj);
    return jwtDecode(obj);
  } catch (error) {}
}
export async function validateotp(obj) {
  const validaobj = helpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + '/validateotp', {
    enc: validaobj,
  });
  return helpr.decryptobj(data);
}
export async function resetpass(obj) {
  const validaobj = helpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + '/reset', { enc: validaobj });
  return helpr.decryptobj(data);
}
export async function getfcmtok(obj) {
  const validaobj = helpr.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + '/getfcmtok', {
    enc: validaobj,
  });
  return helpr.decryptobj(data);
}
export async function resendotp(phone) {
  const validaobj = helpr.encryptobj(phone);
  const { data } = await http.post(apiEndpoint + '/resendotp', {
    enc: validaobj,
  });
  return helpr.decryptobj(data);
}
export async function getJwt() {
  const jst = await AsyncStorage.getItem(tokenKey);
  if (jst) {
    return jst;
  } else {
    return false;
  }
}

export async function login(obj) {
  const logobj = helpr.encryptobj(obj);

  const { data: jwt } = await http.post(apiEndpoint + '/login', {
    enc: logobj,
  });

  try {
    const da = await AsyncStorage.setItem(tokenKey, jwt);
  } catch (error) {}

  return jwtDecode(jwt);
}
export async function getCurrentUser() {
  try {
    const jwt = await AsyncStorage.getItem(tokenKey);

    if (jwt) {
      const decoded = jwtDecode(jwt);
      const datenow = Date.now() / 1000;
      if (decoded.exp > datenow) {
        return decoded;
      } else logout();
      return false;
    } else {
      return false;
    }
  } catch (ex) {
    return ex;
  }
}
export async function gettoken() {
  const { data } = await http.post(apiEndpoint + '/gettokenau');

  return helpr.decryptobj(data);
}

export async function logout() {
  try {
    const ret = await AsyncStorage.removeItem(tokenKey);
    const touch = await AsyncStorage.removeItem('TouchId');
    const ss = await AsyncStorage.removeItem('backgroundimage');
    const sss = await AsyncStorage.removeItem('Reflink');
    clear_data();
    setTimeout(() => {
      Actions.landing();
    }, 1000);

    return ret;
  } catch (error) {
    return error;
  }
}

export default {
  register,
  getCurrentUser,
  login,
  logout,
  getJwt,
  resendotp,
  validateotp,
  insertjwt,
  gettoken,
  resetpass,
  getfcmtok,
};
