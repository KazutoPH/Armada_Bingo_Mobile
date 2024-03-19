import CryptoJS from "crypto-js";
import pbkdf2 from "crypto-js/pbkdf2";
import SHA256 from "crypto-js/sha256";
import crypto from "crypto-js/core";
import Config from "react-native-config";
var [salt, password] = [Config.SALT, Config.PASSWORD];
var key = CryptoJS.PBKDF2(password, salt, {
  keySize: 256 / 32,
  iterations: 100,
});
const helpers = {
  encrypt: function (text) {
    try {
      return CryptoJS.AES.encrypt(text, key.toString()).toString();
    } catch (error) {
      return error;
    }
  },
  encryptobj: function (obj) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(obj),
        key.toString()
      ).toString();
    } catch (error) {
      return error;
    }
  },
  decrypt: function (encdata) {
    try {
      const datat = CryptoJS.AES.decrypt(encdata, key.toString());
      return datat.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return error;
    }
  },
  decryptobj: function (encdata) {
    try {
      const datatt = CryptoJS.AES.decrypt(encdata, key.toString());
      return JSON.parse(datatt.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return error;
    }
  },
};

export default helpers;
