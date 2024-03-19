import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Card } from 'react-native-shadow-cards';
import Moment from 'react-moment';
import { BarIndicator } from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import RadioForm from 'react-native-simple-radio-button';
import MainHeader from '../../components/mainheader';
import supportService from '../../services/supportService';
import getSupporttickets from '../../redux/actions/getSupTicketsAction';
import { font } from '../../assets/config/config';
import { ArmadaHeader } from '../../components/armadaheader';

const { width } = Dimensions.get('window');
var Joi = require('joi-browser');
const schema = Joi.object().keys({
  Reply: Joi.string().min(4).max(500).required(),
});

var radio_props = [
  { label: 'Open', value: 0 },
  { label: 'Close', value: 1 },
];
class TicketDetails extends Component {
  state = {
    Reply: '',
    value: 0,
    pressbutton: true,
    error: '',
  };
  onReply = async () => {
    await this.setState({ pressbutton: false });
    const { Reply } = this.state;
    const validata = Joi.validate(
      {
        Reply: Reply,
      },
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        return reter;
      }
    );
    if (!!validata) {
      await this.setState({ pressbutton: true, error: validata });
      setTimeout(async () => {
        await this.setState({ error: null });
      }, 2000);
    } else {
      const { Reply, value } = this.state;

      if (value === 0) {
        var ticketstatus = 'Open';
      } else {
        var ticketstatus = 'Close';
      }
      try {
        const obj = {
          ticketid: this.props.k.ticket_id,
          subject: Reply,
          status: ticketstatus,
        };
        const dat = await supportService.comment(obj);

        if (dat.success) {
          await this.setState({ pressbutton: true });
          getSupporttickets();
          alert(dat.success);
          setTimeout(() => {
            Actions.contactus();
          }, 2000);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({ pressbutton: true, error: ex.response.data });
          setTimeout(async () => {
            await this.setState({ subject: '', description: '', error: null });
          }, 2000);
        } else if (ex.response) {
          await this.setState({ pressbutton: true, error: ex.response.data });
          setTimeout(async () => {
            await this.setState({ subject: '', description: '', error: null });
          }, 2000);
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* <MainHeader
          menu={false}
          notifications={false}
          onPress={() => Actions.pop()}
          title="Ticket Details"
        /> */}
        <ArmadaHeader />
        <ScrollView>
          <View style={styles.body}>
            <Text
              style={{
                textAlign: 'center',
                color: '#AA0000',
                marginBottom: hp('2%'),
              }}
            >
              Ticket No : #{this.props.k.ticket_id}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: '#001563',
                paddingHorizontal: wp('10%'),
                marginBottom: hp('4%'),
              }}
            >
              Subject : {this.props.k.title}
            </Text>

            {this.props.k.status === 'Open' ? (
              <View>
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ color: 'red', fontFamily: font.Bold }}>
                    {this.state.error}
                  </Text>
                </View>
                <View style={styles.inputsContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref='firstname'
                      returnKeyType='done'
                      onChangeText={(Reply) => this.setState({ Reply })}
                      value={this.state.Reply}
                      style={[styles.input, styles.whiteFont]}
                      placeholder='Please Enter New Reply'
                      multiline={true}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp('3%'),
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      position: 'relative',
                      left: 35,
                    }}
                  >
                    <RadioForm
                      formHorizontal={true}
                      labelHorizontal={true}
                      radio_props={radio_props}
                      initial={0}
                      buttonSize={10}
                      onPress={(value) => {
                        this.setState({ value: value });
                      }}
                      labelStyle={{ marginRight: 15, marginLeft: -8 }}
                    />
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    {this.state.pressbutton ? (
                      <View style={styles.buttonContainer}>
                        <View style={styles.signinwrapper}>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.onReply()}
                          >
                            <View style={styles.depositraisedbutton}>
                              <Text style={styles.raisedbuttonText}>
                                New Reply
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <BarIndicator
                        style={{
                          marginBottom: hp('1%'),
                          position: 'relative',
                          right: 35,
                        }}
                        color='#001563'
                        count={6}
                      />
                    )}
                  </View>
                </View>
              </View>
            ) : null}
            {this.props.k.subject
              .slice(0)
              .reverse()
              .map((item, index) => {
                return (
                  <View key={index} style={styles.cardContainer1}>
                    <Card elevation={5} style={styles.card1}>
                      <Text
                        style={{
                          color: '#AA0000',
                          marginBottom: hp('2%'),
                          fontSize: 12,
                          fontFamily: 'Montserrat-Regular',
                        }}
                      >
                        <Moment
                          unix
                          format='DD/MM/YYYY hh:mm:ss'
                          element={Text}
                          fromNow
                        >
                          {item.datetime / 1000}
                        </Moment>
                      </Text>
                      <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>
                        {item.subject}
                      </Text>
                      <View
                        style={{ alignSelf: 'flex-end', marginTop: hp('2%') }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Montserrat-SemiBold',
                          }}
                        >
                          Replied By :{' '}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Montserrat-SemiBold',
                          }}
                        >
                          {item.person}
                        </Text>
                      </View>
                    </Card>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default TicketDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'white',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    top: 10,
  },
  background: {
    width,
    backgroundColor: '#011563',
    height: hp('13%'),
    justifyContent: 'center',
  },
  titleinfo: {
    flex: 0.9,
    alignSelf: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  back: {
    marginLeft: wp('4%'),
    alignSelf: 'flex-start',
    zIndex: 9999,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  body: {
    marginTop: hp('2%'),
  },
  inputContainer: {
    borderWidth: 0.8,
    borderColor: '#82a0d6',
    //borderColor: 'transparent',
    // flexDirection: 'row',
    height: hp('10%'),
  },
  inputsContainer: {
    flex: 1,
    paddingHorizontal: wp('10%'),
  },
  input: {
    fontSize: wp('4.2%'),
    padding: 10,
  },
  buttonContainer: {
    alignSelf: 'flex-end',

    position: 'relative',
    right: 35,
  },
  signinwrapper: {
    width: wp('30%'),
    height: hp('12%'),
  },
  depositraisedbutton: {
    backgroundColor: '#001563',
    paddingVertical: hp('1.5%'),
    alignItems: 'center',

    borderRadius: 5,
    //marginTop: hp('5%'),
  },
  raisedbuttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'uppercase',
  },
  card1: {
    borderRadius: 10,
    shadowOffset: { width: 1, height: 5 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  cardContainer1: {
    borderRadius: 20,

    marginHorizontal: wp('10%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    marginBottom: hp('2%'),
  },
  errorDefaultStyle: {
    justifyContent: 'center',
    alignItems: 'center',

    color: 'red',
    fontSize: wp('3.8%'),
    fontWeight: 'bold',

    paddingHorizontal: wp('0%'),
    paddingTop: hp('1%'),
    textAlign: 'center',
  },
  errorContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('2%'),
  },
});
