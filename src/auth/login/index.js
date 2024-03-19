import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { font, color, images } from '../../assets/config/config';
import MainHeader from '../../components/mainheader';
import { Actions } from 'react-native-router-flux';
import publicIP from 'react-native-public-ip';
import DeviceInfo from 'react-native-device-info';
import TouchID from 'react-native-touch-id';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BarIndicator } from 'react-native-indicators';
import { Input, Button, Icon, CheckBox } from 'react-native-elements';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
import auth from '../../services/authService';
import get_games from '../../redux/actions/gamesAction';
import update_auth from '../../redux/actions/authAction';

const red = '#A70000';
const blue = '#003299';

export default class Login extends Component {
  state = {
    phone: '',
    loader: false,
    name: '',
    iconname: 'eye-slash',
    password: '',
    ip: '0.0.0.0',
    fcm: '0',
    token: '',
    dat: '',
    passvisible: true,
    nationality: '',
    placeholder: '+63',
    showCountryPicker: false,
    cca2: '',
    countryCode: '',
    btndis: false,
  };
  checkPermission = async () => {
    const enabled = await messaging().hasPermission();

    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await this.setState({ fcm: fcmToken });
    } else {
      const device = await DeviceInfo.getUniqueId();

      await this.setState({ token: tok, fcm: device });
    }
  };

  requestPermission = async () => {
    try {
      await messaging().requestPermission();
    } catch (error) {
      await this.setState({ fcmtoken: 0 });
    }
  };

  async componentDidMount() {
    this.checkPermission();
    //this.messageListener();
    Toast.showLoading();

    publicIP().then(async (ip) => {
      await this.setState({ ip });
    });
    try {
      const tok = this.makeid(18);

      setTimeout(() => {
        Toast.hide();
      }, 1000);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Toast.hide();
        Toast.show(ex.response.data, {
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
        setTimeout(async () => {
          this.setState({ loader: false });
          Toast.hide();
        }, 2000);
      }
    }
  }
  makeid = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  send = async () => {
    await this.setState({ btndis: true });
    Toast.showLoading();
    Keyboard.dismiss();
    this.setState({ loader: true });

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
      this.setState({ phone: '', password: '' });
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
      this.setState({ phone: '', password: '' });
      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (!this.state.password) {
      this.setState({ loader: false, btndis: false });
      Toast.hide();
      Toast.show('Choose Your Password', {
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
      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (this.state.password.length < 8) {
      this.setState({ loader: false, btndis: false });
      Toast.hide();
      Toast.show('Password Must Have 8 Characters', {
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

      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else {
      const code = this.state.nationality ? this.state.nationality : 63;

      try {
        const obj = {
          phone: code + this.state.phone,

          password: this.state.password,
          token: this.state.token,
          fcmtoken: this.state.fcm,
        };
        const dat = await auth.login(obj);
        await this.setState({ dat: dat });
        if (dat) {
          await update_auth();
          TouchID.isSupported()
            .then((success) => {
              Alert.alert(
                'Touch ID',
                'Do You Want Enable Touch ID?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      setTimeout(async () => {
                        await get_games();
                      }, 1000);
                      setTimeout(async () => {
                        Toast.hide();
                        await this.setState({ btndis: false });
                        await this.setState({ loader: false });
                        Actions.story();
                      }, 2000);
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      TouchID.authenticate()
                        .then(async (success) => {
                          await AsyncStorage.setItem('TouchId', 'Enabled');
                          const datat = await AsyncStorage.getItem('TouchId');

                          if (datat === 'Enabled') {
                            alert('TouchId Enabled Successfully');
                            setTimeout(async () => {
                              await get_games();
                            }, 1000);
                            setTimeout(async () => {
                              await this.setState({ btndis: false });
                              Toast.hide();
                              await this.setState({ loader: false });
                              Actions.story();
                            }, 2000);
                          }
                        })
                        .catch(async (error) => {
                          Toast.hide();
                          await this.setState({ loader: false, btndis: false });
                        });
                    },
                  },
                ],
                { cancelable: false }
              );
            })
            .catch((error) => {
              setTimeout(async () => {
                await get_games();
              }, 1000);
              setTimeout(async () => {
                Toast.hide();
                await this.setState({ loader: false, btndis: false });
                Actions.story();
              }, 2000);
            });
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          Toast.hide();
          if (ex.response.data === 'Inactive') {
            Toast.hide();
            Toast.show(ex.response.data, {
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
            const ob = {
              phone: code + this.state.phone,
              disphone: code + ' ' + this.state.phone,
              token: this.state.dat,
              page: 'login',
            };

            setTimeout(async () => {
              this.setState({ loader: false, btndis: false });
              Toast.hide();

              Actions.otps({ obj: ob });
            }, 2000);
          } else {
            Toast.hide();
            Toast.show(ex.response.data, {
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
            setTimeout(async () => {
              this.setState({ loader: false, btndis: false });
              Toast.hide();
            }, 2000);
          }
        } else if (ex.response) {
          setTimeout(async () => {
            await this.setState({ loader: false, btndis: false });
            Toast.hide();
          }, 2000);
        }
      }

      //Actions.buyticket();
    }
  };
  passvis = async () => {
    let icon = this.state.iconname

    if (icon == 'eye')
      icon = 'eye-slash'

    else
      icon = 'eye'

    await this.setState({ passvisible: !this.state.passvisible, iconname: icon });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{ width: wp('100%'), height: hp('30%') }}
          resizeMode='cover'
          source={images.headBG}
        ></Image>

        <ImageBackground
          style={styles.container}
          resizeMode="cover"
          source={images.bodyBG}>
          <ImageBackground
            style={{
              marginTop: -20,
              marginBottom: '4%',
              paddingVertical: 40,
              paddingHorizontal: 50,
              // justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              // width: 340,
            }}
            resizeMode='stretch'
            source={images.loginBG}>

            <View style={styles.textInput}>

              <CountryPicker
                withAlphaFilter={false}
                withFilter={true}
                withCallingCode
                withFlagButton
                withFlag
                value={this.state.nationality}
                translation='eng'
                containerButtonStyle={{ marginLeft: 5 }}
                placeholder={
                  <Text style={{ fontFamily: font.Bold, fontSize: 15, color: '#5F236A', textAlign: 'center' }}>
                    {this.state.nationality
                      ? '+' + this.state.nationality
                      : this.state.placeholder}

                  </Text>
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
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Phone Number"
                placeholderTextColor='rgba(95, 35, 106, 0.5)'
                keyboardType="number-pad"
                onChangeText={(phone) => this.setState({ phone })}
                value={this.state.phone}
              // returnKeyType="done"
              >
              </TextInput>
            </View>


            <View style={styles.textInput2}>
              <TextInput
                style={[styles.input, { paddingLeft: 10, flex: 1 }]}
                placeholder="Password"
                ref={ref => ref && ref.setNativeProps({ style: { fontFamily: font.Bold } })}
                placeholderTextColor='rgba(95, 35, 106, 0.5)'
                secureTextEntry={this.state.passvisible}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              // returnKeyType="done"
              />

              <View style={{ width: 40, alignItems: 'center' }}>
                <Icon
                  name={this.state.iconname}
                  type='font-awesome-5'
                  color='#000000'
                  size={20}
                  onPress={() => this.passvis()} />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.send()}>
              <ImageBackground resizeMode='contain'
                style={{ height: undefined, width: 200, aspectRatio: 3, marginLeft: 10, }}
                source={images.loginBtn}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 5, }}>
                  <Text style={{ fontFamily: font.ExtraBold, fontSize: 17, color: 'white' }}>LOGIN</Text>
                </View>

              </ImageBackground>

            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginLeft: 10, marginTop: 10 }}>
              <Text style={{ fontFamily: font.Bold, fontSize: 12, color: 'black' }}>NO ACCOUNT YET?</Text>
            </View>
            <TouchableOpacity
              onPress={() => Actions.register()}>

              <ImageBackground resizeMode='contain'
                style={{ height: undefined, width: 200, aspectRatio: 3, marginLeft: 10, }}
                source={images.regBtn}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
                  <Text style={{ fontFamily: font.ExtraBold, fontSize: 10, color: 'white' }}>REGISTER NOW</Text>
                </View>

              </ImageBackground>


            </TouchableOpacity>

            {/* <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 5, marginLeft: 10 }}>
              <Text style={{ fontFamily: font.SemiBold, fontSize: 12, color: 'black' }}>FORGOT PASSWORD</Text>
            </View> */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
              <Text style={{ fontFamily: font.Bold, }}>Forgot password? </Text>
              <TouchableOpacity
                onPress={() => Actions.forgot()}>
                <Text style={{ fontFamily: font.Bold, color: '#3B99D4', textDecorationLine: "underline", }}>CLICK HERE</Text>

              </TouchableOpacity>
            </View>
          </ImageBackground>

          <ImageBackground style={styles.ribbonStyle}
            source={images.ribbonBG}
            resizeMode='cover'>
            <Text style={{ fontFamily: font.Bold, fontSize: 29, color: '#2A2A2A', marginTop: 15 }}>LET'S EXPLORE</Text>
          </ImageBackground>

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
    backgroundColor: 'white', width: 'auto', height: 43, color: 'white',
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
    color: '#5F236A'
  },
  input: {
    backgroundColor: 'white',
    height: 34,
    width: 190,
    borderRadius: 8,
    fontSize: 18,
    fontFamily: font.Bold,
    color: '#5F236A',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  textInput: {
    width: '75%',
    backgroundColor: 'white',
    flexDirection: 'row', alignItems: 'center', marginLeft: 10,
    borderWidth: 3, borderRadius: 8, borderColor: '#FED625',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },
  textInput2: {
    width: '75%',
    backgroundColor: 'white',
    flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 10,
    borderWidth: 3, borderRadius: 8, borderColor: '#FED625',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },
  txt: {
    fontFamily: font.Bold,
    fontSize: 19,
    color: 'white'
  },

  ribbonStyle: {
    height: 90,
    backgroundColor: 'transparent',
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})
