import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { Input, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
const blue = '#003299';
export default class Forgot2 extends Component {
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
    };
  }
  otppage = () => {
    Keyboard.dismiss();
    this.setState({ loader: true });

    if (!this.state.phone) {
      this.setState({ loader: false });
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
      this.setState({ loader: false });
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
      Actions.otps({ obj: obj });
    }
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#674a62', height: hp('100%') }}>
        <MainHeader
          menu={false}
          title='Forgot'
          notifications={false}
          onPress={() => Actions.pop()}
        />
        <ScrollView>
          <KeyboardAvoidingView behavior={'position'} enabled>
            <View style={{ justifyContent: 'center', height: hp('80%') }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: 15,
                      color: 'white',
                    }}
                  >
                    ENTER YOUR MOBILE NUMBER
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity style={styles.leftInput}>
                      <CountryPicker
                        withAlphaFilter={false}
                        withFilter={true}
                        withCallingCode
                        withFlagButton
                        withFlag
                        value={this.state.nationality}
                        translation='eng'
                        // preferredCountries={["KR", "KP", "PH", "JP", "CN"]}
                        // countryCodes={["KR", "KP", "PH", "JP", "CN"]}
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
                    </TouchableOpacity>
                    <Input
                      containerStyle={{
                        paddingHorizontal: 0,
                        width: 'auto',
                        height: 'auto',
                      }}
                      inputContainerStyle={styles.input}
                      inputStyle={styles.rightInputText}
                      keyboardType='number-pad'
                      onChangeText={(phone) => this.setState({ phone })}
                      value={this.state.phone}
                      placeholder='ENTER MOBILE NUMBER'
                      placeholderTextColor={'grey'}
                      returnKeyType={'done'}
                    />
                  </View>
                </View>
                <Button
                  title='SUBMIT'
                  buttonStyle={{ backgroundColor: 'white' }}
                  titleStyle={{ color: '#001563' }}
                  containerStyle={{ borderRadius: 50, width: 250 }}
                  onPress={() => this.otppage()}
                />
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
    color: 'white',
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
    color: blue,
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
