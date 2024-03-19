import axios from 'axios';
import Config from 'react-native-config';
import helpr from '../../cryptos';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = Config.REACT_NATIVE_APP_API_URL;

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    Alert.alert(
      'Alert',
      'Kindly check your internet connection. Thank you!',
      [{ text: 'OK', onPress: () => Actions.landing() }],
      {
        cancelable: false,
      }
    );
  }
  return Promise.reject(error);
});

async function setJwt() {
  const jst = await AsyncStorage.getItem('token');
  var dec = jst;
  if (dec) {
    axios.defaults.headers.common['x-auth-token'] = dec;
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
