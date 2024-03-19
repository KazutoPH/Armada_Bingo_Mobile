import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import MainHeader from '../../components/mainheader';
import NumberFormat from 'react-number-format';
import { BarIndicator } from 'react-native-indicators';
import Toast from 'react-native-tiny-toast';
import { Card, Image, Button, Input } from 'react-native-elements';
import { QRreader } from 'react-native-qr-decode-image-camera';
import ImagePicker from 'react-native-image-picker';
import balance from '../../services/balanceService';
import update_balance from '../../redux/actions/balanceAction';
import get_history from '../../redux/actions/historyAction';
import Spinner from 'react-native-loading-spinner-overlay';
import DashboardHeader from '../../components/dashboardheader';

var Joi = require('joi-browser');
const blue = '#003299';

const schema = Joi.object().keys({
  cardnumber: Joi.string().min(11).max(17).required(),
});
class QrScanning extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];
    this.state = {
      QR_Code_Value: '',
      Start_Scanner: false,
      raiseCompo: false,
      loader: false,
      qrloader: false,
      cardnumber: '',
      amount: '',
      reader: {
        message: null,
        data: null,
      },
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
    };
  }

  async componentDidMount() {
    await this.setState({ QR_Code_Value: '' });
    await this.setState({ Start_Scanner: true });
  }

  onBarCodeRead = async (e) => {
    await this.setState({ qrloader: true });

    if (e.data) {
      await this.setState({ Start_Scanner: false });

      await this.setState({ cardnumber: e.data });
      await this.setState({ loader: true });
      const validata = Joi.validate(
        {
          cardnumber: this.state.cardnumber,
        },
        schema,
        function (err, value) {
          if (!err) return null;
          const reter = err.details[0].message;

          val = err.details[0].context.key;
          return reter;
        }
      );
      if (!!validata) {
        this.setState({ loader: false });
        await this.setState({ errors: validata });
        Toast.show(this.state.errors, {
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
        await this.setState({ buttonDisabled: true, buttonshow: true });
        setTimeout(async () => {
          Toast.hide();
          await this.setState({
            errors: null,
            buttonshow: true,
            buttonDisabled: false,
          });
          if (val === 'cardnumber') {
            this.setState({ cardnumber: '' });
          }
        }, 2000);
      } else {
        try {
          const obj = {
            coupon: this.state.cardnumber,
          };
          const dat = await balance.payprepaid(obj);

          if (dat) {
            setTimeout(async () => {
              update_balance();
              get_history();

              await this.setState({ loader: false });
              Actions.result({ data: dat });
            }, 3000);
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
              this.setState({ loader: false, cardnumber: '' });
              Actions.prepaidloadcard();
              Toast.hide();
            }, 2000);
          } else if (ex.response) {
            setTimeout(async () => {
              await this.setState({ loader: false, cardnumber: '' });
              Actions.prepaidloadcard();
            }, 2000);
          }
        }
      }
    }
  };

  render() {
    const balance = this.props.balance;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <DashboardHeader
          title='BarCode Scanning'
          onPress={() => Actions.buyticket()}
          notifications={false}
          menu={false}
          regionimage={false}
        />
        <Spinner
          visible={this.state.loader}
          overlayColor='rgba(0, 0, 0, 0.40)'
          color='white'
          backgroundColor='#999999'
          size='large'
        />
        {this.state.Start_Scanner ? (
          <View style={styles.bodycontainer}>
            <View style={styles.container}>
              <RNCamera
                ref={(cam) => (this.camera = cam)}
                defaultTouchToFocus
                flashMode={this.state.camera.flashMode}
                mirrorImage={false}
                onBarCodeRead={this.onBarCodeRead.bind(this)}
                style={styles.preview}
                type={this.state.camera.type}
                ratio={'1:1'}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.bodycontainer}>
            <View style={styles.container}>
              <RNCamera
                ref={(cam) => (this.camera = cam)}
                defaultTouchToFocus
                flashMode={this.state.camera.flashMode}
                mirrorImage={false}
                style={styles.preview}
                type={this.state.camera.type}
                ratio={'1:1'}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              />
            </View>
          </View>
        )}
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
  bodycontainer: {
    backgroundColor: '#353535',
    height: hp('100%'),
  },
  container: {
    marginTop: hp('5%'),
    height: hp('70%'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#353535',
  },
  preview: {
    height: hp('50%'),
    width: wp('90%'),
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: '#353535',
  },
  header: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353535',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
  },
  backArrow: {
    marginLeft: wp('2%'),
  },

  backButtonIcon: {
    width: wp('5%'),
    height: hp('5%'),
  },

  titles: {
    color: 'white',
    padding: 12,
    fontSize: hp('2.5%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  bodytext1: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: wp('10%'),
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  bodytext2: {
    alignSelf: 'center',
    textAlign: 'center',

    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
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
const style = StyleSheet.create({
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
