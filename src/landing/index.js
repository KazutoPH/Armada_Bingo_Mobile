import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import { Bingo, font, images, style } from '../assets/config/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import publicIP from 'react-native-public-ip';
import get_games from '../redux/actions/gamesAction';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-tiny-toast';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import update_auth from '../redux/actions/authAction';
import auth from '../services/authService';
import TrackPlayer from 'react-native-track-player';
import { TouchableOpacity } from 'react-native';
import playsound from '../../trackplay';

const track3 = { url: require('../assets/bingoscreen.mp3') };
const welcometone = { url: require('../assets/welcome.mp3') };
class Landing extends Component {
  state = {
    loader: false,
    fcm: '0',
    ip: '0.0.0.0',
    spinner: false,
  };
  messageListener = async () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification;
      const usersa = await auth.getCurrentUser();

      if (usersa) {
        let fed = await AsyncStorage.getItem('notifications');

        let ar = fed && fed.length > 0 ? fed : [];
        Alert.alert(title, body);
        const obj = {
          title: title,
          body: body,
        };
        // const getdet = await AsyncStorage.getItem('notifications');
        ar.push(obj);
        const det = await AsyncStorage.setItem('notifications', ar);
        // get_games();
      }
    });
    this.notificationListener = messaging().onMessage(async (notification) => {
      const { title, body } = notification.notification;
      const usersa = await auth.getCurrentUser();

      if (usersa) {
        if (title.includes('Start')) {
          await playsound();
          get_games();
          Alert.alert(title, body);

          //sound
        } else {
          Alert.alert(title, body);
          get_games();
        }
      }
    });
  };

  async componentDidMount() {
    this.checkPermission();
    this.messageListener();
    setTimeout(async () => {
      await this.setState({ spinner: true });
      TrackPlayer.setupPlayer().then(async () => {
        TrackPlayer.setVolume(0.6);
        TrackPlayer.updateOptions({
          stopWithApp: true,
        });
        await TrackPlayer.add([track3]);
        TrackPlayer.play();
      });
      //var dates = (Date.now() + 4 * 60 * 1000).toString();
      //await AsyncStorage.setItem("SessionTime", dates);

      publicIP().then(async (ip) => {
        await this.setState({ ip });
      });
      var ipobj = {
        ip: this.state.ip,
      };

      setTimeout(async () => {
        await NetInfo.fetch().then(async (state) => {
          if (state.isConnected) {
            const user = await auth.getCurrentUser();

            if (user && user.phone) {
              await this.setState({ spinner: true });
              const keychainpin = await AsyncStorage.getItem('TouchId');
              if (keychainpin === 'Enabled') {
                TouchID.authenticate()
                  .then(async (success) => {
                    update_auth();
                    get_games();
                    setTimeout(async () => {
                      try {
                        var fcmt = await auth.getfcmtok(ipobj);

                        if (fcmt.success === this.state.fcm) {
                          await this.setState({ spinner: false });

                          Actions.buyticket();
                        } else {
                          Alert.alert(
                            'Alert',
                            'You have Already Logged into Another Device , Click Ok to Continue ?',
                            [
                              {
                                text: 'OK',
                                onPress: async () => {
                                  auth.logout();
                                  await this.setState({ spinner: false });
                                },
                              },
                            ]
                          );
                        }
                      } catch (ex) {
                        if (ex.response && ex.response.status === 400) {
                          Toast.show(ex.response.data, {
                            position: Toast.position.CENTER,
                            imgSource: require('../assets/images/error.png'),
                            imgStyle: {
                              resizeMode: 'contain',
                              height: 40,
                              width: 85,
                              marginVertical: 10,
                            },
                            textStyle: { fontFamily: 'Montserrat-Bold' },
                            containerStyle: {
                              backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                          });

                          setTimeout(async () => {
                            this.setState({ spinner: false });
                            Toast.hide();
                          }, 2000);
                        } else if (ex.response) {
                          setTimeout(async () => {
                            await this.setState({ spinner: false });
                          }, 2000);
                        }
                      }
                    }, 1000);
                  })
                  .catch(async (error) => {
                    await this.setState({ loader: false });
                    BackHandler.exitApp();
                  });
              } else {
                update_auth();
                get_games();
                setTimeout(async () => {
                  try {
                    var fcmt = await auth.getfcmtok(ipobj);

                    if (fcmt.success === this.state.fcm) {
                      await this.setState({ spinner: false });

                      Actions.buyticket();
                    } else {
                      Alert.alert(
                        'Alert',
                        'You have Already Logged into Another Device , Click Ok to Continue ?',
                        [
                          {
                            text: 'OK',
                            onPress: async () => {
                              auth.logout();
                              await this.setState({ spinner: false });
                            },
                          },
                        ]
                      );
                      // await this.setState({ spinner: false });
                    }
                  } catch (ex) {
                    if (ex.response && ex.response.status === 400) {
                      Toast.show(ex.response.data, {
                        position: Toast.position.CENTER,
                        imgSource: require('../assets/images/error.png'),
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
                        this.setState({ spinner: false });
                        Toast.hide();
                        auth.logout();
                      }, 2000);
                    } else if (ex.response) {
                      setTimeout(async () => {
                        await this.setState({ spinner: false });
                      }, 2000);
                    }
                  }
                }, 1000);
              }
            } else {
              setTimeout(async () => {
                await this.setState({ spinner: false });
                Actions.login();
              }, 100);
            }
          } else {
            Alert.alert(
              'Alert',
              'Please Connect to Internet and Try Again! '[
                {
                  text: 'OK',
                  onPress: async () => {
                    await this.setState({ spinner: false });
                    BackHandler.exitApp();
                  },
                }
              ]
            );
          }
        });
      }, 2000);
    }, 2000);
  }

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

  render() {
    const { B, I, N, G, O } = Bingo;
    return (
      <SafeAreaView style={style.container}>
        <Image
          style={{ width: wp('100%'), height: hp('30%') }}
          resizeMode='cover'
          source={images.headBG}
        />
        <ImageBackground
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          resizeMode='cover'
          source={images.mainbg}
        >
          {!this.state.spinner ? (
            <TouchableOpacity>
              <Image
                style={{ width: wp(80), height: 287 }}
                resizeMode='contain'
                source={images.bingosp}
              />
            </TouchableOpacity>
          ) : (
            <Spinner
              visible={this.state.spinner}
              overlayColor='rgba(0, 0, 0, 0.40)'
              color='white'
              backgroundColor='#999999'
              size='large'
            />
          )}
          {/* {!this.state.spinner ? (
            <Button
              title='ENTER'
              titleStyle={{ fontFamily: font.ExtraBold, fontSize: 17 }}
              buttonStyle={{
                width: 160,
                height: 60,
                borderWidth: 10,
                borderColor: '#B00066',
              }}
              containerStyle={{}}
              ViewComponent={LinearGradient} // Don't forget this!
              linearGradientProps={{
                colors: ['#00001A', '#2F41A8', '#00001A'],

                start: { x: 0, y: 0 },
                end: { x: 0, y: 1.5 },
              }}
              onPress={() => this.send()}
            />
          ) : (
            <Spinner
              visible={this.state.spinner}
              overlayColor='rgba(0, 0, 0, 0.40)'
              color='white'
              backgroundColor='#999999'
              size='large'
            />
          )} */}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default Landing;
