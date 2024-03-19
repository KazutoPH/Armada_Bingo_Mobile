import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import CountdownCircle from 'react-native-countdown-circle';
import { BarIndicator } from 'react-native-indicators';
import { font, color } from '../../assets/config/config';
import MainHeader from '../../components/mainheader';
import auth from '../../services/authService';
import update_auth from '../../redux/actions/authAction';
import get_games from '../../redux/actions/gamesAction';

const red = '#A70000';
const blue = '#003299';
export default class OTP2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp: '',
      loader: false,
      shownewcode: false,
    };
  }
  async componentDidMount() {
    Toast.showLoading();

    try {
      const obj = {
        phone: this.props.obj.phone,
      };
      const data = await auth.resendotp(obj);
      if (data.success) {
        Toast.hide();
        alert('SMS Sent To Your Mobile Number');
        await this.setState({ shownewcode: false });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Toast.hide();
        Toast.show(ex.response.data, {
          position: Toast.position.CENTER,
          imgSource: require('../../assets/images/success.png'),
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
          Toast.hide();
        }, 2000);
      }
    }
  }
  _finishCount = async () => {
    await this.setState({ shownewcode: true, loader: false });
  };
  newcode = async () => {
    try {
      const obj = {
        phone: this.props.obj.phone,
      };
      const data = await auth.resendotp(obj);
      if (data.success) {
        alert('New SMS Sent');
        await this.setState({ shownewcode: false });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        await this.setState({ errors: ex.response.data });
        setTimeout(async () => {
          await this.setState({ errors: null });
        }, 2000);
      } else if (ex.response) {
        setTimeout(async () => {
          await this.setState({ errors: null });
        }, 2000);
      }
    }
  };
  senddash = async () => {
    await this.setState({ loader: true });
    if (!this.state.otp) {
      await this.setState({ loader: false });
      Toast.show('Plese Enter OTP', {
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
    } else {
      const obj = {
        phone: this.props.obj.phone,
        otp: this.state.otp,
      };

      try {
        const dat = await auth.validateotp(obj);

        if (dat.success) {
          if (this.props.obj.page === 'register') {
            const da = await auth.insertjwt(this.props.obj.token);

            if (da.phone) {
              Toast.show('MOBILE VERIFIED SUCCESSFULLY', {
                position: Toast.position.CENTER,
                imgSource: require('../../assets/images/success.png'),
                imgStyle: {
                  resizeMode: 'contain',
                  height: 40,
                  width: 85,
                  marginVertical: 10,
                },
                textStyle: { fontFamily: 'Montserrat-Bold' },
                containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
              });

              update_auth();
              get_games();

              setTimeout(() => {
                Actions.sevenseas();
              }, 1000);
            }
          } else if (this.props.obj.page === 'forgot') {
            Actions.resetpassword({ phone: this.props.obj.phone });
          } else if (this.props.obj.page === 'login') {
            Toast.show('Account Activated SUCCESSFULLY', {
              position: Toast.position.CENTER,
              imgSource: require('../../assets/images/success.png'),
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
              Actions.login();
            }, 1000);
          } else if (this.props.obj.page === 'withbanks') {
            try {
              const obj = {
                FirstName: this.props.obj.FirstName,
                MiddleName: this.props.obj.MiddleName,
                LastName: this.props.obj.LastName,
                Amount: this.props.obj.Amount,
                ProcId: this.props.obj.ProcId,
                ProcDetail: this.props.obj.ProcDetail,
              };

              const da = await withdrawbank.drreqpayoutinsta(obj);
              if (da.Success) {
                Toast.hide();
                Toast.show(da.Success, {
                  position: Toast.position.CENTER,
                  imgSource: require('../../assets/images/success.png'),
                  imgStyle: {
                    resizeMode: 'contain',
                    height: 40,
                    width: 85,
                    marginVertical: 10,
                  },
                  textStyle: { fontFamily: 'Montserrat-Bold' },
                  containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
                });
                await this.setState({
                  success: da.success,
                  loader: false,
                  sendpin: false,
                  otp: false,
                });
                await this.setState({
                  firstname: '',
                  lastname: '',
                  middlename: '',
                  amount: '',
                  accountnumber: '',
                });
                get_games();
                get_history();
                setTimeout(async () => {
                  Toast.hide();
                  await this.setState({ loader: false });
                  Actions.buyticket();
                }, 3000);
              }
            } catch (ex) {
              if (ex.response && ex.response.status === 400) {
                Toast.hide();

                await this.setState({
                  errors: ex.response.data,
                });
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
                update_balance();

                setTimeout(async () => {
                  Toast.hide();
                  await this.setState({ errors: null, loader: false });
                  Actions.withdrawbanks();
                }, 4000);
              }
            }
          }
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
            await this.setState({ loader: false });
            Toast.hide();
          }, 2000);
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#00007F', height: hp('100%') }}>
        <MainHeader
          menu={false}
          title='Mobile Verification'
          notifications={false}
          onPress={() => Actions.pop()}
          back={false}
        />

        <ScrollView>
          <KeyboardAvoidingView behavior={'position'} enabled>
            <Text style={styles.text}>
              A one time 6-digit code has been sent to your mobile number &nbsp;
              +{this.props.obj.disphone}
            </Text>
            <View style={{ justifyContent: 'center', height: hp('60%') }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.txt}>ENTER OTP</Text>
                  <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                    <TouchableOpacity style={styles.leftInput}>
                      <Icon name='lock' type='entypo' size={20} color={blue} />
                    </TouchableOpacity>
                    <Input
                      containerStyle={{
                        paddingHorizontal: 0,
                        width: 'auto',
                        height: 'auto',
                      }}
                      inputContainerStyle={styles.input}
                      inputStyle={styles.rightInputText}
                      errorStyle={{ display: 'none' }}
                      onChangeText={(otp) => this.setState({ otp: otp })}
                      value={this.state.otp}
                    />
                  </View>
                </View>
                {!this.state.loader ? (
                  <Button
                    title='SUBMIT'
                    buttonStyle={{ backgroundColor: 'white' }}
                    titleStyle={{
                      color: blue,
                      fontFamily: font.Bold,
                      fontSize: 19,
                    }}
                    containerStyle={{ borderRadius: 50, width: 250 }}
                    onPress={() => this.senddash()}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: wp('20%'),
                      height: 100,
                    }}
                  >
                    <BarIndicator color='white' count={6} />
                  </View>
                )}
              </View>
              {this.state.shownewcode ? (
                <TouchableOpacity onPress={this.newcode}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat',
                      fontSize: hp('2%'),
                      marginTop: hp('4%'),
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    Didn't receive the otp?
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.newcoderight}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 8,
                      marginRight: 8,
                      color: 'white',
                    }}
                  >
                    Code Expires in
                  </Text>
                  <CountdownCircle
                    seconds={120}
                    radius={16}
                    borderWidth={3}
                    color='white'
                    // bgColor='#fff'
                    textStyle={{ fontSize: 11, color: '#001563' }}
                    onTimeElapsed={() => this._finishCount()}
                  />
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  leftInput: {
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: 'white',
    width: 'auto',
    height: 35,
    color: 'white',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: '#35353580',
    borderRightWidth: 1,
  },
  leftInputText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: 'white',
    width: 25,
  },
  rightInputText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
  },
  input: {
    backgroundColor: 'white',
    height: 35,
    width: 230,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 5,
  },
  txt: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    color: 'white',
  },
  headerStyle: {
    backgroundColor: 'white',
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent: 'center',
  },
  text: {
    marginTop: hp('10%'),
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    color: 'white',
    marginHorizontal: wp('2%'),
  },
  newcoderight: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
