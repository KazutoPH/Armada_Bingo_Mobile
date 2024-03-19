import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Keyboard,
  Alert,
  Modal
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Bingo, font, images, style, color } from '../../assets/config/config';
import Toast from 'react-native-tiny-toast';
import MainHeader from '../../components/mainheader';
import publicIP from 'react-native-public-ip';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { allData, address, philData } from 'addresspinas';
import queryString from 'query-string';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BarIndicator } from 'react-native-indicators';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import auth from '../../services/authService';
import get_games from '../../redux/actions/gamesAction';
import Moment from 'moment';

const red = '#A70000';
const blue = '#003299';

export default class Register extends Component {
  state = {
    phone: '',
    loader: false,
    name: '',
    password: '',
    email: '',
    referral: '',
    cpassword: '',
    city: '',
    confirmpassword: '',
    ip: '0.0.0.0',
    token: '0',
    fcm: '0',
    value: false,
    passvisible: true,
    passvisibleicon: 'eye-slash',
    confirmpassvisible: true,
    confirmpassvisibleicon: 'eye-slash',
    nationality: '',
    placeholder: '+63',
    cca2: '',
    countryCode: '',
    tempdate: new Date(),
    date: '',
    month: '',
    year: '',
    showModal: true,
    region: '',
    regdata: [],
    citydata: [],
    prodata: [],
    province: '',
    regions: [],
    regvalue: '',
    provinces: [],
    provalue: '',
    btndis: false,
    refinput: true,
  };

  getdyn = () => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          var url = link.url;
          const value = queryString.parseUrl(url);

          const ref = value.query;
          if (ref) {
            this.setState({ referral: ref.ref, refinput: false });
          }
        }
      });
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

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
      {
        cancelable: false,
      }
    );
  };
  async componentDidMount() {
    this.checkPermission();
    this.getdyn();

    Toast.showLoading();
    const regions = philData.allRegions;

    await this.setState({ regions: regions });
    var regna = regions.regions.map((k) => k.name);

    await this.setState({ regdata: regna });

    publicIP().then(async (ip) => {
      await this.setState({ ip: ip });
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
    Keyboard.dismiss();
    Toast.showLoading();
    var passpatt = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})/);
    // Actions.sevenseas();
    await this.setState({ loader: true });
    if (!this.state.phone) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
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

      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (this.state.phone.length !== 10) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
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

      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (!this.state.password) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('ENTER YOUR PASSWORD', {
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
    } else if (!passpatt.test(this.state.password)) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show(
        'Password must be least 8 to 20 characters, Should have atleast One Number , One Capital letter',
        {
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
        }
      );

      setTimeout(() => {
        Toast.hide();
      }, 2000);
    } else if (this.state.password !== this.state.cpassword) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Passwords Must Match', {
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
    } else if (!this.state.name) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('ENTER YOUR NAME', {
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
    } else if (this.state.name.length < 4 || this.state.name.length > 20) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Name Should Be Length Between 4 and 15 Characters', {
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
    } else if (!this.state.date) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Select Your Date Of Birth', {
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
    } else if (!this.state.region) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Select Your Region', {
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
    } else if (!this.state.province) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Select Your Province', {
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
    } else if (!this.state.city) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Select Your City', {
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
    } else if (!this.state.referral) {
      this.setState({ loader: false });
      await this.setState({ btndis: false });
      Toast.hide();
      Toast.show('Referral ID is Mandatory For Registration', {
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
      const obj = {
        phone: this.state.phone,
        page: 'register',
        disphone: code + ' ' + this.state.phone,
      };

      const code = this.state.nationality ? this.state.nationality : 63;
      try {
        const obj = {
          name: this.state.name,
          phone: code + this.state.phone,

          password: this.state.password,
          region: this.state.region,
          province: this.state.province,
          referral: this.state.referral,
          city: this.state.city,
          dob: this.state.date,
          ip: this.state.ip,
          fcmtoken: this.state.fcm,
          token: this.state.token,
        };

        setTimeout(async () => {
          this.setState({ loader: false });
          Toast.hide();
        }, 2000);
        const dat = await auth.register(obj);

        if (dat) {
          Toast.hide();
          TouchID.isSupported()
            .then((success) => {
              Alert.alert(
                'Touch ID',
                'Do You Want Enable Touch ID?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      const ob = {
                        phone: code + this.state.phone,
                        disphone: code + ' ' + this.state.phone,
                        token: dat,
                        page: 'register',
                      };
                      setTimeout(async () => {
                        Toast.hide();
                        this.setState({ loader: false });

                        Toast.show(
                          'Registered SuccessFully Please Verify Your Mobile Number',
                          {
                            position: Toast.position.CENTER,
                            imgSource: require('../../assets/images/success.png'),
                            imgStyle: {
                              width: 95.97,
                              height: 95.97,
                              marginVertical: 31,
                            },
                            textStyle: { fontFamily: 'Montserrat-Bold' },
                            containerStyle: {
                              backgroundColor: '#003299CC',
                              width: 232,
                              height: 232,
                              borderRadius: 30,
                            },
                          }
                        );
                        await this.setState({ btndis: false });
                        Actions.otps({ obj: ob });
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
                              this.setState({ loader: false });
                              const ob = {
                                phone: code + this.state.phone,
                                disphone: code + ' ' + this.state.phone,
                                token: dat,
                                page: 'register',
                              };
                              var dates = (
                                Date.now() +
                                10 * 60 * 1000
                              ).toString();
                              await AsyncStorage.setItem('SessionTime', dates);
                              Toast.hide();
                              Toast.show(
                                'Registered SuccessFully Please Verify Your Mobile Number',
                                {
                                  position: Toast.position.CENTER,
                                  imgSource: require('../../assets/images/success.png'),
                                  imgStyle: {
                                    width: 95.97,
                                    height: 95.97,
                                    marginVertical: 31,
                                  },
                                  textStyle: {
                                    fontFamily: 'Montserrat-Bold',
                                  },
                                  containerStyle: {
                                    backgroundColor: '#003299CC',
                                    width: 232,
                                    height: 232,
                                    borderRadius: 30,
                                  },
                                }
                              );
                              await this.setState({ btndis: false });
                              Actions.otps({ obj: ob });
                            }, 2000);
                          }
                        })
                        .catch(async (error) => {
                          Toast.hide();
                          await this.setState({ loader: false });
                          await this.setState({ btndis: false });
                        });
                    },
                  },
                ],
                { cancelable: false }
              );
            })
            .catch((error) => {
              const ob = {
                phone: code + this.state.phone,
                disphone: code + ' ' + this.state.phone,
                token: dat,
                page: 'register',
              };
              setTimeout(async () => {
                this.setState({ loader: false });
                var dates = (Date.now() + 10 * 60 * 1000).toString();
                await AsyncStorage.setItem('SessionTime', dates);
                Toast.hide();
                Toast.show(
                  'Registered SuccessFully Please Verify Your Mobile Number',
                  {
                    position: Toast.position.CENTER,
                    imgSource: require('../../assets/images/success.png'),
                    imgStyle: {
                      width: 95.97,
                      height: 95.97,
                      marginVertical: 31,
                    },
                    textStyle: { fontFamily: 'Montserrat-Bold' },
                    containerStyle: {
                      backgroundColor: '#003299CC',
                      width: 232,
                      height: 232,
                      borderRadius: 30,
                    },
                  }
                );
                await this.setState({ btndis: false });
                Actions.otps({ obj: ob });
              }, 2000);
            });
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
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
            await this.setState({ btndis: false });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          Toast.hide();
          setTimeout(async () => {
            await this.setState({ btndis: false });
            await this.setState({ loader: false });
          }, 2000);
        }
      }
    }
  };
  passvis = async () => {
    let icon = this.state.passvisibleicon

    if (icon == 'eye')
      icon = 'eye-slash'

    else
      icon = 'eye'

    await this.setState({ passvisible: !this.state.passvisible, passvisibleicon: icon });
  };
  confirmpassvis = async () => {
    let icon = this.state.confirmpassvisibleicon

    if (icon == 'eye')
      icon = 'eye-slash'

    else
      icon = 'eye'

    await this.setState({ confirmpassvisible: !this.state.confirmpassvisible, confirmpassvisibleicon: icon });
  };
  checkToggle = async () => {
    await this.setState({ value: !this.state.value });
  };
  regionsel = async (ind, region) => {
    var nm = this.state.regions.regions.find((k) => k.name === region);
    await this.setState({ regvalue: nm.reg_code, region: region });
    const provinces = address.getProvinceOfRegion(this.state.regvalue);
    await this.setState({ provinces: provinces.provinces });

    // await this.setState({ prodata: provinces.provinces });
    var regna = provinces.provinces.map((k) => k.name);

    await this.setState({ prodata: regna });
  };
  selpro = async (ind, province) => {
    var nm = this.state.provinces.find((k) => k.name === province);

    await this.setState({ provalue: nm.prov_code, province: province });
    const cities = address.getCityMunOfProvince(this.state.provalue);
    var regna = cities.cityAndMun.map((k) => k.name);

    await this.setState({ citydata: regna });
  };
  selcity = async (ind, city) => {
    await this.setState({ city: city });
  };

  handleChange = async (name) => {
    // let na = name.replace(/[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    await this.setState({
      name: name,
    });
  };
  render() {
    let rows = [];
    for (let i = 0; i < 31; i++) {
      rows.push({ label: i + 1, value: i + 1 });
    }
    let month = [];
    for (let i = 0; i < 12; i++) {
      month.push({ label: i + 1, value: i + 1 });
    }
    let year = [];
    for (let i = 1965; i < 2000; i++) {
      year.push({ label: i + 1, value: i + 1 });
    }

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, }}
          showsVerticalScrollIndicator={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
        >
          <Image
            style={{ width: wp('100%'), height: hp('30%') }}
            resizeMode='cover'
            source={images.headBG}
          />

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
                REGISTRATION
              </Text>
            </ImageBackground>

            <View style={{ alignItems: 'center' }}>
              <ImageBackground
                style={{ width: '100%', paddingVertical: 30, }}
                resizeMode='stretch'
                source={images.regBG}>


                <View style={{ paddingHorizontal: '10%', }}>

                  {/* REGISTER NUMBER */}
                  <View>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>REGISTER YOUR NUMBER</Text>
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
                        keyboardType='number-pad'
                        onChangeText={(phone) => this.setState({ phone })}
                        value={this.state.phone}
                      // returnKeyType="done"
                      >
                      </TextInput>
                    </View>
                  </View>

                  {/* REGISTER YOUR PASSWORD */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>REGISTER YOUR PASSWORD</Text>
                    <View style={styles.textInput}>
                      <TextInput
                        ref={ref => ref && ref.setNativeProps({ style: { fontFamily: font.Bold } })}
                        style={styles.input}
                        placeholderTextColor="#5F236A"
                        secureTextEntry={this.state.passvisible}
                        returnKeyType='done'
                        onChangeText={(password) =>
                          this.setState({ password: password })
                        }
                        value={this.state.password}
                      />

                      <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon
                          name={this.state.passvisibleicon}
                          type='font-awesome-5'
                          color='#000000'
                          size={20}
                          onPress={() => this.passvis()} />
                      </View>
                    </View>
                  </View>

                  {/* CONFIRM PASSWORD */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>RE-ENTER PASSWORD</Text>
                    <View style={styles.textInput}>
                      <TextInput
                        ref={ref => ref && ref.setNativeProps({ style: { fontFamily: font.Bold } })}
                        style={styles.input}
                        placeholderTextColor="#5F236A"
                        secureTextEntry={this.state.confirmpassvisible}
                        returnKeyType='done'
                        onChangeText={(cpassword) =>
                          this.setState({ cpassword: cpassword })
                        }
                        value={this.state.cpassword}
                      />

                      <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon
                          name={this.state.confirmpassvisibleicon}
                          type='font-awesome-5'
                          color='#000000'
                          size={20}
                          onPress={() => this.confirmpassvis()} />
                      </View>
                    </View>
                  </View>

                  {/* USERNAME */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>USERNAME</Text>
                    <View style={styles.textInput}>
                      <TextInput
                        ref={ref => ref && ref.setNativeProps({ style: { fontFamily: font.Bold } })}
                        style={styles.input}
                        placeholderTextColor="#5F236A"
                        onChangeText={(name) => this.handleChange(name)}
                        value={this.state.name}
                        keyboardType='visible-password'
                      />
                    </View>
                  </View>

                  {/* BIRTHDATE */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>BIRTHDATE</Text>
                    <View style={styles.textInput}>
                      <View style={styles.bdateForm}>
                        <DatePicker
                          style={styles.bdateInput}
                          date={this.state.date}
                          mode='date'
                          placeholder='Select Your Date Of Birth'
                          format='MM/DD/YYYY'
                          minDate='09-01-1965'
                          maxDate='09-01-2000'
                          confirmBtnText='Confirm'
                          cancelBtnText='Cancel'
                          showIcon={false}
                          customStyles={{
                            dateInput: {
                              borderWidth: 0,
                              alignItems: 'center',
                            },
                            dateTouchBody: {},
                            placeholderText: {
                              fontFamily: font.Bold,
                              fontSize: 15,
                              color: 'rgba(95, 35, 106, 0.5)',
                            },
                            dateText: {
                              fontFamily: font.Bold,
                              fontSize: 15,
                              color: 'black',
                            },
                          }}
                          onDateChange={(date) => {
                            this.setState({ date: date });
                          }}
                        />
                        <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                          <Icon
                            style={{ backgroundColor: 'white' }}
                            name='calendar-alt'
                            type='font-awesome-5'
                            color='#2A2A2A'
                            size={25}
                          />
                        </View>
                      </View>
                    </View>
                  </View>


                  {/* REGION */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>REGION</Text>
                    <View style={styles.textInput}>
                      <ModalDropdown
                        options={this.state.regdata}
                        onSelect={(idx, value) => this.regionsel(idx, value)}
                        value={this.state.region}
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        dropDownStyle={{
                          alignItems: 'center',
                          backgroundColor: 'white',
                          zIndex: 100,
                          flex: 1,
                        }}
                        isFullWidth={true}
                        textStyle={[styles.txt, { marginHorizontal: 5 }]}
                        defaultTextStyle={[styles.txt, { color: 'rgba(95, 35, 106, 0.5)', marginHorizontal: 5 }]}
                        dropdownTextStyle={[styles.txt, { color: 'rgba(42,42,42,0.42)' }]}
                      />
                    </View>
                  </View>

                  {/* PROVINCE */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>PROVINCE</Text>
                    <View style={styles.textInput}>
                      <ModalDropdown
                        options={this.state.prodata}
                        onSelect={(index, item) => this.selpro(index, item)}
                        disabled={!this.state.regvalue}
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        dropDownStyle={{
                          alignItems: 'center',
                          backgroundColor: 'white',
                          zIndex: 100,
                          flex: 1,
                        }}
                        isFullWidth={true}
                        textStyle={[styles.txt, { marginHorizontal: 5 }]}
                        defaultTextStyle={[styles.txt, { color: 'rgba(95, 35, 106, 0.5)', marginHorizontal: 5 }]}
                        dropdownTextStyle={[styles.txt, { color: 'rgba(42,42,42,0.42)' }]}
                      />
                    </View>
                  </View>

                  {/* CITY / MUNICIPALITY */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>CITY / MUNICIPALITY</Text>
                    <View style={styles.textInput}>
                      <ModalDropdown
                        options={this.state.citydata}
                        onSelect={(index, item) => this.selcity(index, item)}
                        disabled={!this.state.regvalue}

                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        dropDownStyle={{
                          alignItems: 'center',
                          backgroundColor: 'white',
                          zIndex: 100,
                          flex: 1,
                        }}
                        isFullWidth={true}
                        textStyle={[styles.txt, { marginHorizontal: 5 }]}
                        defaultTextStyle={[styles.txt, { color: 'rgba(95, 35, 106, 0.5)', marginHorizontal: 5 }]}
                        dropdownTextStyle={[styles.txt, { color: 'rgba(42,42,42,0.42)' }]}
                      />
                    </View>
                  </View>

                  {/* BARANGAY */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>BARANGAY</Text>
                    <View style={styles.textInput}>
                      <ModalDropdown
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        dropDownStyle={{
                          alignItems: 'center',
                          backgroundColor: 'white',
                          zIndex: 100,
                          flex: 1,
                        }}
                        isFullWidth={true}
                        textStyle={[styles.txt, { marginHorizontal: 5 }]}
                        defaultTextStyle={[styles.txt, { color: 'rgba(95, 35, 106, 0.5)', marginHorizontal: 5 }]}
                        dropdownTextStyle={[styles.txt, { color: 'rgba(42,42,42,0.42)' }]}
                      />
                    </View>
                  </View>


                  {/* REFFERAL */}
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: font.SemiBold, fontSize: 14, color: 'black' }}>REFFERAL</Text>
                    <View style={styles.textInput}>
                      <TextInput
                        ref={ref => ref && ref.setNativeProps({ style: { fontFamily: font.Bold } })}
                        style={styles.input}
                        placeholder='Referral'
                        placeholderTextColor="rgba(95, 35, 106, 0.5)"
                        onChangeText={(referral) =>
                          this.setState({ referral: referral })
                        }
                        editable={this.state.refinput}
                        value={this.state.referral}
                      />
                    </View>
                  </View>

                  {!this.state.btndis ? (
                    <TouchableOpacity
                      onPress={() => Actions.login()}
                      style={{ marginTop: 15, alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: font.SemiBold,
                        }}
                      >
                        Click Here To{' '}
                        <Text style={{ color: 'blue' }}>Login</Text>
                      </Text>
                    </TouchableOpacity>
                  ) : null}


                  {!this.state.btndis ? (
                    <TouchableOpacity
                      style={{ alignSelf: 'center' }}
                      disabled={this.state.btndis}
                      onPress={() => this.send()}
                    >
                      <ImageBackground
                        resizeMode='contain'
                        style={{ height: undefined, width: 200, aspectRatio: 3 }}
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
                            SUBMIT
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ) : null}

                </View>
              </ImageBackground>
            </View>
          </ImageBackground>
        </ScrollView>


      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textInput: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#FED625',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },

  input: {
    backgroundColor: 'white',
    paddingVertical: 5,
    flex: 1,
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    fontFamily: font.Bold,
    color: '#2A2A2A'
  },

  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#FED625',
  },


  txt: {
    fontFamily: font.Bold,
    fontSize: 15,
    color: 'black'
  },


  bdateInput: {
    flex: 1,
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: font.bold,
  },
  bdateForm: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },

  ribbonStyle: {
    height: 90,
    backgroundColor: 'transparent',
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContainerStyle: {
    marginVertical: 5,
    height: 40,
    width: 300,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FED625',
    elevation: 6,

    // shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    borderRadius: 5,
  },

  modalTransparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  btn: {
    height: 40,
    backgroundColor: '#01CAF7',
    justifyContent: 'center',
    borderRadius: 10
  }
});
