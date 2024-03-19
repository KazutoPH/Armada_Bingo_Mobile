import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { Input, Button, Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { BarIndicator } from 'react-native-indicators';
import { font, color } from '../../assets/config/config';
import MainHeader from '../../components/mainheader';
import auth from '../../services/authService';
import { ArmadaHeader } from '../../components/armadaheader';
var Joi = require('joi-browser');
const red = '#A70000';
const blue = '#003299';
const schema = Joi.object().keys({
  password: Joi.string()
    .min(8)
    .max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})/)
    .error(() => {
      return {
        message:
          'Password must be least 8 to 15 characters, Should have atleast One Number , One Capital letter , One Special character',
      };
    })
    .required(),
  confirmpassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({ language: { any: { allowOnly: 'must match password' } } }),
});
export default class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: true,
      phone: '',
      loader: false,
      password: '',
      confirmpassword: '',
      token: '',
      passvisible: true,
      confirmpassvisible: true,
    };
  }
  async componentDidMount() {
    Toast.showLoading();

    const tok = this.makeid(18);

    await this.setState({ token: tok });
    setTimeout(() => {
      Toast.hide();
    }, 1000);
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
  sendlogin = async () => {
    await this.setState({ loader: true });
    const validata = Joi.validate(
      {
        password: this.state.password,
        confirmpassword: this.state.confirmpassword,
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
      }, 2000);
    } else {
      const obj = {
        phone: this.props.phone,
        password: this.state.password,
        token: this.state.token,
      };
      try {
        const dat = await auth.resetpass(obj);
        if (dat.success) {
          Toast.show(dat.success, {
            position: Toast.position.CENTER,
            imgSource: require('../../assets/images/success.png'),
            imgStyle: { width: 95.97, height: 95.97, marginVertical: 31 },
            textStyle: { fontFamily: 'Montserrat-Bold' },
            containerStyle: {
              backgroundColor: '#003299CC',
              width: 232,
              height: 232,
              borderRadius: 30,
            },
          });
          await this.setState({ loader: false });
          Actions.login();
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
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          setTimeout(async () => {
            await this.setState({ loader: false });
          }, 2000);
        }
      }
    }
  };
  passvis = async () => {
    await this.setState({ passvisible: !this.state.passvisible });
  };
  confirmpassvis = async () => {
    await this.setState({ confirmpassvisible: !this.state.confirmpassvisible });
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#674a62', height: hp('100%') }}>
        <View style={{ top: -35 }}>
          <ArmadaHeader back={false} />
        </View>
        <ScrollView>
          <KeyboardAvoidingView behavior={'position'} enabled>
            <View style={{ justifyContent: 'center', height: hp('80%') }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.txt}>ENTER NEW PASSWORD</Text>
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
                      onChangeText={(password) => this.setState({ password })}
                      value={this.state.password}
                      secureTextEntry={this.state.passvisible}
                      returnKeyType={'done'}
                      rightIcon={
                        this.state.passvisible === true ? (
                          <TouchableOpacity onPress={() => this.passvis()}>
                            <Icon
                              name='eye'
                              type='entypo'
                              size={20}
                              color={blue}
                              style={{}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.passvis()}>
                            <Icon
                              name='eye-slash'
                              type='font-awesome'
                              size={20}
                              color={blue}
                            />
                          </TouchableOpacity>
                        )
                      }
                    />
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.txt}>CONFIRM NEW PASSWORD</Text>
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
                      secureTextEntry={this.state.confirmpassvisible}
                      onChangeText={(confirmpassword) =>
                        this.setState({
                          confirmpassword,
                        })
                      }
                      value={this.state.confirmpassword}
                      returnKeyType={'done'}
                      rightIcon={
                        this.state.confirmpassvisible === true ? (
                          <TouchableOpacity
                            onPress={() => this.confirmpassvis()}
                          >
                            <Icon
                              name='eye'
                              type='entypo'
                              size={20}
                              color={blue}
                              style={{}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.confirmpassvis()}
                          >
                            <Icon
                              name='eye-slash'
                              type='font-awesome'
                              size={20}
                              color={blue}
                              style={{}}
                            />
                          </TouchableOpacity>
                        )
                      }
                    />
                  </View>
                </View>
                {!this.state.loader ? (
                  <Button
                    title='SUBMIT'
                    onPress={() => this.sendlogin()}
                    titleStyle={{
                      color: blue,
                      fontFamily: font.Bold,
                      fontSize: 19,
                    }}
                    buttonStyle={{ backgroundColor: 'white' }}
                    containerStyle={{ borderRadius: 50, width: 250 }}
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
    color: blue,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: '#35353580',
    borderRightWidth: 1,
  },
  leftInputText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#353535',
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
});
