import React, { Component } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { Card, Image, Button, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import NumberFormat from 'react-number-format';
import { BarIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import { Bingo, font, images, style, color } from '../../assets/config/config';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera';
import { ArmadaHeader } from '../../components/armadaheader';
import Toast from 'react-native-tiny-toast';
import { QRreader } from 'react-native-qr-decode-image-camera';
import ImagePicker from 'react-native-image-picker';
import balance from '../../services/balanceService';
import update_balance from '../../redux/actions/balanceAction';
import get_history from '../../redux/actions/historyAction';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import balanceService from '../../services/balanceService';
const blue = '#003299';
class QrScanning extends Component {
  state = {
    QR_Code_Value: '',
    Start_Scanner: false,
    raiseCompo: false,
    loader: false,
    qrloader: false,
    amount: '',
    username: '',
    phone: '',
    reader: {
      message: null,
      data: null,
    },
  };
  async componentDidMount() {
    await this.setState({ QR_Code_Value: '' });
    await this.setState({ Start_Scanner: true });
  }

  onBarCodeRead = async (e) => {
    await this.setState({ qrloader: true });

    if (e.data) {
      await this.setState({ QR_Code_Value: e.data });
      try {
        const obj = {
          userid: this.state.QR_Code_Value,
        };
        const dat = await balanceService.paysendnumber(obj);
        if (dat.success) {
          setTimeout(async () => {
            await this.setState({
              username: dat.success.name,
              phone: dat.success.phone,
              Start_Scanner: false,
              raiseCompo: true,
              qrloader: false,
            });
          }, 1000);
        }
      } catch (ex) {
        await this.setState({ qrloader: false });
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
        }
      }
    }
  };

  sendamount = async () => {
    await this.setState({ loader: true });
    Toast.showLoading();
    if (
      this.state.QR_Code_Value.length < 2 ||
      this.state.QR_Code_Value.length > 14
    ) {
      Toast.hide();
      await this.setState({ loader: false });
      Toast.show('Invalid UserID', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 85,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
        containerStyle: {
          backgroundColor: 'rgba(166, 0, 0, 0.8)',
          width: wp('80%'),
          height: hp('40%'),
          borderRadius: 19,
          opacity: 0.7,
        },
      });
    } else if (this.props.auth.userid === this.state.QR_Code_Value) {
      Toast.hide();
      await this.setState({ loader: false });
      Toast.show('you can not Transfer to Your Own Account', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 85,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
        containerStyle: {
          backgroundColor: 'rgba(166, 0, 0, 0.8)',
          width: wp('80%'),
          height: hp('40%'),
          borderRadius: 19,
          opacity: 0.7,
        },
      });
    } else if (!this.state.amount) {
      Toast.hide();
      await this.setState({ loader: false });
      Toast.show('Enter Amount', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 85,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
        containerStyle: {
          backgroundColor: 'rgba(166, 0, 0, 0.8)',
          width: wp('80%'),
          height: hp('40%'),
          borderRadius: 19,
          opacity: 0.7,
        },
      });
    } else if (this.state.amount > this.props.balance) {
      Toast.hide();
      await this.setState({ loader: false });
      Toast.show('Insufficient Balance', {
        position: Toast.position.CENTER,
        imgSource: require('../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 85,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
        containerStyle: {
          backgroundColor: 'rgba(166, 0, 0, 0.8)',
          width: wp('80%'),
          height: hp('40%'),
          borderRadius: 19,
          opacity: 0.7,
        },
      });
    } else {
      try {
        const obj = {
          userid: this.state.QR_Code_Value,
          amount: this.state.amount,
        };

        const data = await balance.paysendqr(obj);
        if (data.success) {
          Toast.hide();
          update_balance();
          get_history();
          Toast.show(data.success, {
            position: Toast.position.CENTER,
            imgSource: require('../../assets/images/success.png'),
            imgStyle: {
              resizeMode: 'contain',
              height: 40,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: 'Montserrat-Bold' },
            containerStyle: {
              backgroundColor: '#003299CC',
              width: 232,
              height: 232,
              borderRadius: 30,
            },
          });
          await this.setState({ loader: false });
          Actions.buyticket();
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
            this.setState({ loader: false, amount: '' });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          await this.setState({ loader: false, amount: '' });
        }
      }
    }
  };
  async openPhoto() {
    await this.setState({ qrloader: true });
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        if (response.uri) {
          var path = response.path;
          if (!path) {
            path = response.uri;
          }
          QRreader(path)
            .then(async (data) => {
              await this.setState({
                reader: {
                  message: 'message',
                  data: data,
                },
              });
              try {
                const obj = {
                  userid: this.state.reader.data,
                };
                const dat = await balanceService.paysendnumber(obj);
                if (dat.success) {
                  setTimeout(async () => {
                    await this.setState({
                      username: dat.success.name,
                      phone: dat.success.phone,
                      QR_Code_Value: this.state.reader.data,
                      Start_Scanner: false,
                      raiseCompo: true,
                      qrloader: false,
                    });
                  }, 1000);
                }
              } catch (ex) {
                await this.setState({ qrloader: false });
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
                }
              }
            })
            .catch((err) => {
              this.setState({
                reader: {
                  message: 'message',
                  data: null,
                },
              });
            });
        }
      }
    });
  }
  render() {
    const balance = this.props.balance;
    return (
      <SafeAreaView style={style.container}>
        <ArmadaHeader />
        <LinearGradient
          colors={['#E7524F', '#742928']}
          style={{ flex: 1, paddingVertical: hp(3) }}>
          <Spinner
            visible={this.state.qrloader}
            overlayColor='rgba(0, 0, 0, 0.40)'
            color='white'
            backgroundColor='#999999'
            size='large'
          />
          {this.state.Start_Scanner ? (
            <View
              style={{
                flex: 1,
                // backgroundColor: '#2A2A2A',
                // paddingVertical: hp(3),
              }}
            >
              <TouchableOpacity
                onPress={() => this.openPhoto()}
                style={{ alignItems: 'center', paddingBottom: 5 }}
              >
                <LinearGradient
                  colors={[
                    '#D39D2A',
                    '#FFEA8F',
                    '#FFEA8F',
                    '#D39129',
                    '#FFEA8F',
                    '#D39D2A',
                  ]}
                  style={[styles.upbutton, { padding: 5 }]}
                >
                  <LinearGradient
                    colors={['#D40000', '#570000']}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.ExtraBold,
                        fontSize: 15,
                        color: 'white',
                      }}
                    >
                      Send Via Upload
                  </Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
              {/* <TouchableOpacity
              onPress={() => this.openPhoto()}
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: 'white',
                alignItems: 'center',
                width: wp('20%'),
                height: hp('5%'),
                justifyContent: 'center',
                alignSelf: 'flex-end',
                top: -8,
                right: 8,
              }}
            >
              <View>
                <Text style={{ color: 'white' }}>Upload</Text>
              </View>
            </TouchableOpacity> */}
              <View
                // style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}
                style={{ flex: 1, alignItems: 'center', paddingHorizontal: wp(17), marginVertical: hp(4) }}
              >
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderLeftWidth: 5,
                      borderTopWidth: 5,
                      borderColor: 'white',
                    }}
                  />
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRightWidth: 5,
                      borderTopWidth: 5,
                      borderColor: 'white',
                    }}
                  />
                </View>
                <View style={{ flex: 1, marginVertical: -45 }}>
                  <RNCamera
                    style={styles.cameraStyle}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    captureAudio={false}
                    onBarCodeRead={this.onBarCodeRead}
                    // onGoogleVisionBarcodesDetected={this.barcodeRecognized}
                    ref={(ref) => {
                      this.camera = ref;
                    }}
                    // ref={(cam) => (this.camera = cam)}
                    // onSubjectAreaChanged={true}
                    // ratio={'1:1'}
                    androidCameraPermissionOptions={{
                      title: 'Permission to use camera',
                      message: 'We need your permission to use your camera',
                      buttonPositive: 'Ok',
                      buttonNegative: 'Cancel',
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderLeftWidth: 5,
                      borderBottomWidth: 5,
                      borderColor: 'white',
                    }}
                  />
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRightWidth: 5,
                      borderBottomWidth: 5,
                      borderColor: 'white',
                    }}
                  />
                </View>
              </View>

              {/* <Text
              style={{
                fontFamily: font.Bold,
                fontSize: 20,
                color: 'white',
                alignSelf: 'center',
                marginTop: 20,
              }}
            >
              Send Gems Via QR Code
            </Text> */}
              <View style={{ alignSelf: 'center', marginTop: 20 }}>
                <LinearGradient
                  colors={[
                    '#D39D2A',
                    '#FFEA8F',
                    '#FFEA8F',
                    '#D39129',
                    '#FFEA8F',
                    '#D39D2A',
                  ]}
                  style={[styles.qrbutton, { padding: 5 }]}
                >
                  <LinearGradient
                    colors={['#D40000', '#570000']}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.ExtraBold,
                        fontSize: 15,
                        color: 'white',
                      }}
                    >
                      Send Gems Via QR Code
                  </Text>
                  </LinearGradient>
                </LinearGradient>
              </View>
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: 20,
                  color: 'white',
                  alignSelf: 'center',
                  marginTop: 20,
                }}
              >
                or
            </Text>

              <TouchableOpacity
                onPress={() => Actions.sendvianumber()}
                style={{ alignSelf: 'center', marginTop: 20 }}
              >
                <LinearGradient
                  colors={[
                    '#D39D2A',
                    '#FFEA8F',
                    '#FFEA8F',
                    '#D39129',
                    '#FFEA8F',
                    '#D39D2A',
                  ]}
                  style={[styles.numbutton, { padding: 5 }]}
                >
                  <LinearGradient
                    colors={['#D40000', '#570000']}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.ExtraBold,
                        fontSize: 15,
                        color: 'white',
                      }}
                    >
                      SEND VIA NUMBER
                  </Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
              <ImageBackground
                style={{ flex: 1 }}
                resizeMode='cover'
                source={images.bodyBG}
              >
                <ScrollView>
                  <View>
                    <ImageBackground
                      style={{
                        width: '100%',
                        minHeight: 400,
                        justifyContent: 'center',
                        marginVertical: 20,
                        paddingVertical: 30,
                      }}
                      source={require('../../assets/images/loginBG.png')}
                      resizeMode='stretch'
                    >
                      <View style={{ marginHorizontal: wp(12) }}>
                        <Text
                          style={{
                            fontFamily: font.Bold,
                            fontSize: 20,
                            color: '#C72026',
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}
                        >
                          Send Gems
                    </Text>
                        <Text
                          style={{
                            fontFamily: font.Bold,
                            fontSize: 20,
                            color: '#2A2A2A',
                            alignSelf: 'center',
                            marginTop: 20,
                            textAlign: 'center',
                          }}
                        >
                          {this.state.username}
                        </Text>
                        <Text
                          style={{
                            fontFamily: font.Bold,
                            fontSize: 20,
                            color: '#2A2A2A',
                            alignSelf: 'center',
                            marginTop: 10,
                            textAlign: 'center',
                          }}
                        >
                          {this.state.phone}
                        </Text>
                        <Text
                          style={{
                            fontFamily: font.Bold,
                            fontSize: 20,
                            color: '#2A2A2A',
                            alignSelf: 'center',
                            marginTop: 10,
                            textAlign: 'center',
                          }}
                        >
                          {this.state.QR_Code_Value}
                        </Text>

                        <TextInput
                          value={this.state.amount}
                          onChangeText={(amount) =>
                            this.setState({ amount: amount })
                          }
                          keyboardType='decimal-pad'
                          style={styles.textInputStyle}
                        />

                        {!this.state.loader ? (
                          <TouchableOpacity
                            style={{ alignSelf: 'center', marginTop: 20 }}
                            onPress={() => this.sendamount()}
                          >
                            <LinearGradient
                              colors={[
                                '#D39D2A',
                                '#FFEA8F',
                                '#FFEA8F',
                                '#D39129',
                                '#FFEA8F',
                                '#D39D2A',
                              ]}
                              style={[styles.button, { padding: 5 }]}
                            >
                              <LinearGradient
                                colors={['#D40000', '#570000']}
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 5,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: font.ExtraBold,
                                    fontSize: 15,
                                    color: 'white',
                                  }}
                                >
                                  SEND
                            </Text>
                              </LinearGradient>
                            </LinearGradient>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </ImageBackground>
                  </View>
                </ScrollView>
              </ImageBackground>
            )}
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.balance,
    auth: state.auth,
    withdrawbanks: state.withdrawbank,
    admin: state.admin,
  };
};

export default connect(mapStateToProps)(QrScanning);
const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
  },
  numbutton: {
    width: 250,
    height: 50,
    borderRadius: 10,
  },
  qrbutton: {
    width: 250,
    height: 50,
    borderRadius: 10,
  },
  upbutton: {
    width: 180,
    height: 50,
    borderRadius: 10,
  },
  textInputStyle: {
    fontFamily: font.Bold,
    fontSize: 12,
    color: '#C72026',
    width: wp(70),
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: 15,
    backgroundColor: '#F0C094',
    borderRadius: 5,
    paddingVertical: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },

  cameraStyle: {
    alignSelf: 'center',
    flex: 1,
    width: wp(50),
    height: hp(50),
  },
  body: {
    backgroundColor: '#353535',
    marginTop: hp('10%'),
  },
  balancecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: wp('10%'),
  },
  balancetext: {
    flex: 3,
    alignSelf: 'flex-start',
  },
  balance: {
    flex: 3,
    alignSelf: 'center',
    width: wp('20%'),
    flexDirection: 'row',
  },
});
const styl = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  line: {
    flex: 1,
    backgroundColor: blue,
    height: 3,
    marginHorizontal: 10,
  },
  cardContainer: {
    height: 200,
  },
  txt: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 13,
    color: blue,
    marginBottom: hp('1.5%'),
  },
  input: {
    borderWidth: 1,
    height: 38,
    borderColor: '#70707080',
    backgroundColor: '#F2F0F0',
    paddingHorizontal: 10,
  },
  inputText: { fontFamily: 'Montserrat-Bold', fontSize: 12 },
});
