import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { Input, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { font, color, images } from '../../assets/config/config';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
const blue = '#003299';
export default class Forgot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: true,
      phone: '',
      loader: false,
      nationality: '',
      placeholder: '+63',
      cca2: '',
      countryCode: '',
      btndis: false,
    };
  }
  otppage = async () => {
    Keyboard.dismiss();
    await this.setState({ loader: true, btndis: true });

    if (!this.state.phone) {
      this.setState({ loader: false, btndis: false });
      Toast.hide();
      Toast.show('Please Enter Your Mobile Number', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 40,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold' },
        containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
      });
      this.setState({ phone: '' });
      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (this.state.phone.length !== 10) {
      this.setState({ loader: false, btndis: false });
      Toast.hide();
      Toast.show('Phone Number Must Be 10-Digits', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 40,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold' },
        containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
      });
      this.setState({ phone: '' });
      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else {
      const code = this.state.nationality ? this.state.nationality : 63;
      const obj = {
        phone: code + this.state.phone,
        disphone: code + ' ' + this.state.phone,
        page: 'forgot',
      };
      await this.setState({ btndis: false });
      Actions.otps({ obj: obj });
    }
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          style={{ width: wp('100%'), height: hp('30%') }}
          resizeMode='cover'
          source={images.headBG}
        ></Image>

        <ImageBackground
          style={styles.container}
          resizeMode='cover'
          source={images.bodyBG}
        >
          <ImageBackground
            style={styles.ribbonStyle}
            source={images.ribbonBG}
            resizeMode='cover'
          >
            <Text
              style={{
                fontFamily: font.Bold,
                fontSize: 29,
                color: '#2A2A2A',
                marginTop: 15,
              }}
            >
              LET'S EXPLORE
            </Text>
          </ImageBackground>
          <ImageBackground
            style={{
              flex: 1,

              // justifyContent: 'center',
              alignItems: 'center',
              // width: 380,
            }}
            resizeMode='contain'
            source={images.loginBG}
          >
            <View style={styles.textInput}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    justifyContent: 'center',
                    width: 50,
                  }}
                >
                  {/* <Text style={{ fontSize: 14, left: 1 }}>+63</Text> */}
                  <CountryPicker
                    withAlphaFilter={false}
                    withFilter={true}
                    withCallingCode
                    withFlagButton
                    withFlag
                    value={this.state.nationality}
                    translation='eng'
                    containerButtonStyle={{ fontSize: 8, left: 8 }}
                    placeholder={
                      this.state.nationality
                        ? '+' + this.state.nationality
                        : this.state.placeholder
                    }
                    onSelect={(country) => {
                      this.setState({
                        // nationality: country.cca2,
                        nationality: country.callingCode[0],
                        cca2: country.flag,
                        placeholder: '',
                      });
                    }}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder='Phone Number'
                  placeholderTextColor='#5F236A'
                  keyboardType='number-pad'
                  onChangeText={(phone) => this.setState({ phone })}
                  value={this.state.phone}
                  // returnKeyType="done"
                ></TextInput>
              </View>
            </View>

            <TouchableOpacity
              disabled={this.state.btndis}
              onPress={() => this.otppage()}
            >
              <ImageBackground
                resizeMode='contain'
                style={{
                  height: undefined,
                  width: 200,
                  aspectRatio: 3,
                  marginLeft: 10,
                }}
                source={images.loginBtn}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.ExtraBold,
                      fontSize: 17,
                      color: 'white',
                    }}
                  >
                    SUBMIT
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: font.SemiBold,
                  fontSize: 12,
                  color: 'black',
                }}
              >
                NO ACCOUNT YET?
              </Text>
            </View>
            <TouchableOpacity onPress={() => Actions.register()}>
              <ImageBackground
                resizeMode='contain'
                style={{
                  height: undefined,
                  width: 200,
                  aspectRatio: 3,
                  marginLeft: 10,
                }}
                source={images.regBtn}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.ExtraBold,
                      fontSize: 10,
                      color: 'white',
                    }}
                  >
                    REGISTER NOW
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 5, marginLeft: 10 }}>
              <Text style={{ fontFamily: font.SemiBold, fontSize: 12, color: 'black' }}>FORGOT PASSWORD</Text>
            </View> */}
          </ImageBackground>

          <View style={{}}></View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  leftInput: {
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: 'white',
    width: 'auto',
    height: 43,
    color: 'white',
    // borderColor: 'red',
    borderRightWidth: 0.5,
  },

  leftInputText: {
    fontFamily: font.Bold,
    fontSize: 14,
    color: '#5F236A',
    width: 'auto',
    minWidth: 40,
    textAlign: 'right',
  },
  rightInputText: {
    fontFamily: font.SemiBold,
    fontSize: 14,
    color: '#5F236A',
  },
  input: {
    backgroundColor: 'white',
    height: 34,
    width: 190,
    // borderRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  input2: {
    backgroundColor: 'white',
    height: 34,
    width: 190,
    // borderRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 10,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#FED625',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },
  textInput2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 10,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#FED625',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },
  txt: {
    fontFamily: font.Bold,
    fontSize: 19,
    color: 'white',
  },

  ribbonStyle: {
    height: 90,
    backgroundColor: 'transparent',
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
