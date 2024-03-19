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
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bingo,
  font,
  images,
  style,
  color,
} from '../../../assets/config/config';
import { ArmadaHeader } from '../../../components/armadaheader';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import { Table, Row, Cell } from 'react-native-gifted-table'

import balance from '../../../services/balanceService';
import update_balance from '../../../redux/actions/balanceAction';
import get_history from '../../../redux/actions/historyAction';

class SendTo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      amount: '',
      loader: false,
    };
  }

  onSendPress = async () => {
    await this.setState({ loader: true });
    Toast.showLoading();
    if (!this.state.amount) {
      await this.setState({ loader: false });
      Toast.hide();
      Toast.show('Enter Amount', {
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
    } else if (this.props.dat.phone === this.props.auth.phone) {
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
        const obj = {
          userid: this.props.dat.userid,
          amount: this.state.amount,
        };

        const data = await balance.paysendqr(obj);
        if (data.success) {
          await this.setState({ loader: false });
          Toast.hide();
          this.setState({ showModal: true });
          update_balance();
          get_history();

          // setTimeout(() => {
          //   this.setState({ showModal: false });
          //   Actions.buyticket();
          // }, 3000);
        }
      } catch (ex) {
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
            textStyle: { fontFamily: 'Montserrat-Bold' },
            containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
          });
          setTimeout(async () => {
            this.setState({ loader: false, amount: '' });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          Toast.hide();
          await this.setState({ loader: false, amount: '' });
        }
      }
    }
  };
  hidemodal = async () => {
    await this.setState({ showModal: false });
    Actions.buyticket();
  };
  render() {
    // SAMPLE DATA 
    let tabledata = [
      ['Tran ID', 'ADE214HGEA2'],
      ['Date', '07-21-2021'],
      ['Time', '11:10 AM'],
      ['Sender', 'FOXTROT Avengers'],
      ['Receiver', 'Bravo X Man'],
      ['Gems Sent', '1000.00'],
      ['Pirate Tax (P2P)', '100.00'],
      ['Gems Received', '900.00'],
    ];
    // -----
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
                style={{
                  width: '100%',
                  minHeight: 400,
                  justifyContent: 'center',
                  marginVertical: 20,
                  paddingVertical: 30,
                }}
                source={require('../../../assets/images/loginBG.png')}
                resizeMode='stretch'
              >
                <View style={{ alignSelf: 'center' }}>
                  <Text
                    style={{ fontFamily: font.Bold, fontSize: 20, color: '#C72026', alignSelf: 'center', textAlign: 'center' }}
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
                    {this.props.dat.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.Bold,
                      fontSize: 30,
                      color: '#2A2A2A',
                      alignSelf: 'center',
                      marginTop: 10,
                      textAlign: 'center',
                    }}
                  >
                    {this.props.dat.phone}
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
                    {this.props.dat.userid}
                  </Text>
                  <TextInput
                    value={this.state.amount}
                    onChangeText={(amount) => this.setState({ amount: amount })}
                    style={styles.textInputStyle}
                    keyboardType='decimal-pad'

                  />

                  {!this.state.loader ? (
                    <TouchableOpacity
                      style={{ alignSelf: 'center', marginTop: 20 }}
                      // onPress={() => this.onSendPress()}
                      onPress={() => this.setState({ showModal: true })}
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

        <Modal
          visible={this.state.showModal}
          transparent={true}
          animationType='fade'
        >
          <View style={styles.modalTransparentBackground}>

            <ImageBackground
              style={{ width: '100%', height: undefined, justifyContent: 'center', paddingVertical: 30 }}
              source={images.loginBG}
              resizeMode='stretch'>
              <View>
                <View style={{ marginBottom: 10 }}>
                  <Image

                    style={{ width: wp(80), height: undefined, aspectRatio: 909 / 576, alignSelf: 'center', }}
                    source={require('../../../assets/images/treasure.png')}
                    resizeMode='contain'
                  />

                </View>
                <Text style={{ fontFamily: font.Bold, fontSize: 20, color: '#2A2A2A', alignSelf: 'center', marginTop: 20, }}>
                  YOU'VE SENT{'\n'}
                  <Text style={{ fontSize: 25, }}>   {this.state.amount} GEMS</Text>

                </Text>

                {/* <Text
                  style={{
                    fontFamily: font.Bold,
                    fontSize: 20,
                    color: '#C72026',
                    alignSelf: 'center',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {this.props.dat.name}
                  {'\n'}+{this.props.dat.phone}
                </Text> */}
              </View>
              <Table style={{ marginLeft: '15%', marginRight: '13%', marginTop: 20, marginBottom: 10 }}>
                {tabledata.map((data, index) =>
                  <Row style={{ marginVertical: 3 }} key={index}>
                    <Cell style={styles.cell1} render={() =>
                      <Text style={{ fontFamily: font.Bold, fontSize: 18, color: '#2A2A2A' }}>
                        {data[0]}
                      </Text>
                    } />

                    <Cell style={styles.cell2} render={() =>
                      <Text style={{ fontFamily: font.Bold, fontSize: 18, color: '#2A2A2A' }}> : </Text>
                    } />

                    <Cell style={styles.cell3} render={() =>
                      <Text style={{ fontFamily: font.Bold, fontSize: 18, color: '#C72026', alignSelf: 'flex-end', textAlign: 'right' }}>
                        {data[1]}
                      </Text>
                    } />
                  </Row>
                )}
              </Table>
            </ImageBackground>
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              // onPress={() => this.hidemodal()}
              onPress={() => this.setState({ showModal: false })}
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
                    OK
                  </Text>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Modal>
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

export default connect(mapStateToProps)(SendTo);
const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
  },
  okbutton: {
    width: 100,
    height: 50,
    borderRadius: 10,
  },
  textInputStyle: {
    fontFamily: font.Bold,
    fontSize: 30,
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

  modalTransparentBackground: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.87)',
  },
  cell1: {
    alignItems: 'flex-start'

  },

  cell2: {
    flexShrink: 1
  },

  cell3: {
    flexShrink: 1,
    alignItems: 'flex-end',
  }
});
