import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Card, Image, Button, Input } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MainHeader from '../../components/mainheader';
import { Actions } from 'react-native-router-flux';

import Toast from 'react-native-tiny-toast';
import { BarIndicator } from 'react-native-indicators';
import balance from '../../services/balanceService';
import update_balance from '../../redux/actions/balanceAction';
import get_history from '../../redux/actions/historyAction';
import DashboardHeader from '../../components/dashboardheader';
import { ArmadaHeader } from '../../components/armadaheader';
import { font } from '../../assets/config/config';

var Joi = require('joi-browser');
const blue = '#674a62';

const schema = Joi.object().keys({
  cardnumber: Joi.string().min(12).max(18).required(),
});
export default class PrepaidLoadCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardnumber: '',
      loader: false,
    };
  }
  send = async () => {
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
        textStyle: { fontFamily: font.SemiBold },
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
          update_balance();
          get_history();
          setTimeout(async () => {
            await this.setState({ loader: false });
            Actions.result({ data: dat });
          }, 2000);
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
            textStyle: { fontFamily: font.Bold },
            containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
          });
          setTimeout(async () => {
            this.setState({ loader: false, cardnumber: '' });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          await this.setState({ loader: false, cardnumber: '' });
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={style.body}>
        <ArmadaHeader />
        <ScrollView>
          {/* <KeyboardAvoidingView behavior={'position'} enabled> */}
          <KeyboardAvoidingView behavior='position' enabled style={{ backgroundColor: 'white', height: hp(80) }}>
            <View>
              <Card
                containerStyle={[style.cardContainer, { alignItems: 'center' }]}
              >
                <Image
                  source={require('../../assets/images/qrSign.png')}
                  style={{ alignSelf: 'center', height: 100, marginVertical: 10 }}
                  resizeMode='contain'
                />
                {/* <Button
                  type='outline'
                  title='SCAN CARD TO LOAD'
                  titleStyle={style.txt}
                  onPress={() => Actions.cardscanning()}
                  containerStyle={{ width: 170, }}
                  buttonStyle={{
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: blue,

                  }}
                /> */}
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity style={style.roundedButton}
                    onPress={() => Actions.cardscanning()}
                  >
                    <Text style={style.blueText}>SCAN TO LOAD</Text>
                  </TouchableOpacity>
                </View>
              </Card>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}
              >
                <View style={style.line} />
                <Text style={style.txt}>OR</Text>
                <View style={style.line} />
              </View>

              <Card
                containerStyle={style.cardContainer}

              >
                <View style={{ borderBottomWidth: 1, borderColor: '#6A4861', paddingBottom: 5 }}>
                  <Text style={style.blueText}>ENTER MANUALLY</Text>
                </View>
                {/* <Input
                  label='CARD NUMBER'
                  labelStyle={style.txt}
                  placeholder='000000'
                  placeholderTextColor='#35353580'
                  onChangeText={(cardnumber) => this.setState({ cardnumber })}
                  value={this.state.cardnumber}
                  inputContainerStyle={style.input}
                  inputStyle={style.inputText}
                  returnKeyType={'done'}
                /> */}
                <Text style={style.blackText}>Coupon No.</Text>
                <TextInput
                  style={style.inputStyle}
                  placeholder='000000'
                  placeholderTextColor='#35353580'
                  onChangeText={(cardnumber) => this.setState({ cardnumber })}
                  value={this.state.cardnumber}

                  keyboardType='numeric'
                  returnKeyType={'done'}
                />

              </Card>
            </View>
            {!this.state.loader ? (
              <Button
                title='DONE'
                titleStyle={{ fontFamily: font.SemiBold, fontSize: 14 }}
                containerStyle={{ margin: 10, borderRadius: 100, paddingVertical: 10, }}
                buttonStyle={{
                  backgroundColor: '#6A4861',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
                onPress={() => this.send()}
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
                  <BarIndicator color='#674a62' count={6} />
                </View>
              )}
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

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
    // backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  txt: {

    fontFamily: font.Bold,
    fontSize: 13,
    color: blue,
    marginBottom: hp('1.5%'),
  },
  blueText: {
    fontFamily: font.Bold,
    fontSize: 14,
    color: '#6A4861'
  },
  blackText: {
    fontFamily: font.Bold,
    fontSize: 14,
    color: '#6A4861',
    marginVertical: 10
  },
  input: {
    borderWidth: 1,
    height: 38,
    borderColor: '#70707080',
    backgroundColor: '#F2F0F0',
    paddingHorizontal: 10,
  },
  inputText: { fontFamily: font.Bold, fontSize: 14 },

  roundedButton: {
    borderWidth: 1,
    borderColor: '#6A4861',
    // backgroundColor: '#00007F',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  inputStyle: {
    fontFamily: font.SemiBold,
    fontSize: 25,
    color: '#353535',
    backgroundColor: '#F2F0F0',
    paddingHorizontal: 10,
    paddingVertical: 10

  }
});
