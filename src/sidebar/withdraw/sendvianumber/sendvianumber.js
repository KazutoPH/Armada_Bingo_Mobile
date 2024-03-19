import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bingo,
  font,
  images,
  style,
  color,
} from '../../../assets/config/config';
import { connect } from 'react-redux';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
import { ArmadaHeader } from '../../../components/armadaheader';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import balance from '../../../services/balanceService';

class SendViaNumber extends Component {
  state = {
    mobile: '',
    placeholder: '+63',
    cca2: '',
    countryCode: '',
    nationality: '',
    loader: false,
  };
  componentDidMount() {
    Toast.hide();
  }
  sendto = async () => {
    await this.setState({ loader: true });
    Toast.showLoading();
    if (!this.state.mobile) {
      await this.setState({ loader: false });
      Toast.hide();
      Toast.show('Enter Mobile Number', {
        position: Toast.position.CENTER,
        imgSource: require('../../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 40,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: font.Bold },
        containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
      });
    } else if (this.state.mobile.length !== 10) {
      await this.setState({ loader: false });
      Toast.hide();
      Toast.show('Mobile Number Must Be 10-Digits', {
        position: Toast.position.CENTER,
        imgSource: require('../../../assets/images/error.png'),
        imgStyle: {
          resizeMode: 'contain',
          height: 40,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: 'Montserrat-Bold' },
        containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
      });
    } else if (this.state.mobile === this.props.auth.phone) {
      await this.setState({ loader: false });
      Toast.hide();
      Toast.show('You Cannot Transfer Your Own Account', {
        position: Toast.position.CENTER,
        imgSource: require('../../../assets/images/error.png'),
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
      try {
        const code = this.state.nationality ? this.state.nationality : 63;
        const obj = {
          mobile: code + this.state.mobile,
        };

        const det = await balance.paysendnumber(obj);
        if (det.success) {
          await this.setState({ loader: false });
          Toast.hide();
          Actions.sendto({ dat: det.success });
        }
      } catch (ex) {
        Toast.hide();
        if (ex.response && ex.response.status === 400) {
          await this.setState({ loader: false });
          Toast.hide();
          Toast.show(ex.response.data, {
            position: Toast.position.CENTER,
            imgSource: require('../../../assets/images/error.png'),
            imgStyle: {
              resizeMode: 'contain',
              height: 40,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: font.Bold },
            containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
          });
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={style.container}>
        <ArmadaHeader />
        <ImageBackground
          style={{ flex: 1 }}
          resizeMode='cover'
          source={images.bodyBG}
        >
          <ScrollView>
            <View>
              <ImageBackground
                style={{ width: '100%', minHeight: 400, justifyContent: 'center', marginVertical: 20, paddingVertical: 30 }}
                source={require('../../../assets/images/loginBG.png')}
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

                  <View style={{ alignSelf: 'center' }}>
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
                      Search Mobile Number
                  </Text>

                    {/* <TextInput
                    keyboardType='decimal-pad'
                    style={styles.textInputStyle}
                    value={this.state.value}
                    onChangeText={(mobile) => this.setState({ mobile: mobile })}
                  /> */}
                    <View style={styles.textInputContainer}>
                      <Text style={{ fontFamily: font.Bold, fontSize: 15, paddingVertical: 5, color: '#C72026', alignSelf: 'center' }}>+63</Text>
                      <TextInput
                        // keyboardType='numeric'
                        placeholderTextColor='#5F236A'
                        keyboardType='number-pad'
                        onChangeText={(mobile) => this.setState({ mobile })}
                        value={this.state.phone}
                        style={styles.textInputStyle}
                      />
                    </View>
                  </View>
                  {/* <View style={styles.textInputStyle}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View
                        style={{
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                          justifyContent: 'center',
                        }}
                      >
                    
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
                        placeholderTextColor='#5F236A'
                        keyboardType='number-pad'
                        onChangeText={(mobile) => this.setState({ mobile })}
                        value={this.state.phone}
                        style={{
                          width: 230,
                          fontSize: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderBottomWidth: 0,
                          paddingHorizontal: 15,
                          fontFamily: font.SemiBold,
                        }}
                   
                      ></TextInput>
                    </View>
                  </View> */}

                  {!this.state.loader ? (
                    <TouchableOpacity
                      style={{ alignSelf: 'center', marginTop: 20 }}
                      onPress={() => this.sendto()}
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
                            SEARCH
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    balance: state.balance,
    games: state.games,
    ticketprice: state.ticketprice,
    commission: state.commission,
  };
};

export default connect(mapStateToProps)(SendViaNumber);

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginVertical: 15,
    backgroundColor: '#F0C094',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 13 },
  },

  textInputStyle: {
    // fontFamily: font.Bold,
    // fontSize: 12,
    // color: '#C72026',
    // width: wp(70),
    // textAlign: 'center',
    // alignSelf: 'center',
    // marginVertical: 15,
    // backgroundColor: '#F0C094',
    // borderRadius: 5,
    // paddingVertical: 0,
    // shadowColor: 'rgba(0, 0, 0, 0.1)',
    // shadowOpacity: 0.5,
    // elevation: 6,
    // shadowRadius: 6,
    // shadowOffset: { width: 1, height: 13 },

    flex: 1,
    marginLeft: 5,
    fontFamily: font.Bold,
    fontSize: 25,
    paddingVertical: 5,
    color: '#C72026',
  },
});
