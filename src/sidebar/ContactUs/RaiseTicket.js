import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import { ArmadaHeader } from '../../components/armadaheader';
import MainHeader from '../../components/mainheader';
import getSupporttickets from '../../redux/actions/getSupTicketsAction';
import supportService from '../../services/supportService';
var Joi = require('joi-browser');

const schema = Joi.object().keys({
  subject: Joi.string().min(4).max(50).required(),

  Description: Joi.string().min(4).max(500).required(),
});
export default class RaiseTicket extends Component {
  state = {
    subject: '',
    Description: '',
    errors: '',
    buttonpress: true,
  };
  componentDidMount() {
    Toast.hide();
  }
  raiseticket = async () => {
    Toast.showLoading();
    await this.setState({ buttonpress: false });
    const { subject, Description } = this.state;
    const validata = Joi.validate(
      {
        subject: subject,
        Description: Description,
      },
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        return reter;
      }
    );
    if (!!validata) {
      Toast.hide();
      Toast.show(validata, {
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
      const { subject, Description } = this.state;

      const obj = {
        title: subject,
        subject: Description,
      };

      try {
        const data = await supportService.newticket(obj);

        if (data.success) {
          Toast.hide();
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
            containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
          });
          getSupporttickets();
          Actions.contactus();
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({ buttonpress: true });
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
            await this.setState({ subject: '', description: '' });
          }, 2000);
        } else if (ex.response) {
          await this.setState({ buttonpress: true });
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
            await this.setState({ subject: '', description: '' });
          }, 2000);
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ArmadaHeader />
        <ScrollView>
          <View style={[styles.whiteBox, { marginHorizontal: 20 }]}>
            <View>
              <Text style={styles.Label}>Subject*</Text>
              <TextInput
                returnKeyType='done'
                onChangeText={(subject) => this.setState({ subject })}
                value={this.state.subject}
                style={[{ height: 25 }, styles.inputStyle]}
              />
            </View>

            <View>
              <Text style={styles.Label}>Description*</Text>
              <TextInput
                style={styles.inputStyleDescription}
                returnKeyType='done'
                multiline={true}
                onChangeText={(Description) => this.setState({ Description })}
                value={this.state.Description}
              />
            </View>

            <View style={{ marginTop: 40 }}>
              <TouchableOpacity
                style={styles.Button}
                activeOpacity={0.5}
                onPress={() => this.raiseticket()}
                disabled={!this.state.buttonpress}
              >
                <Text style={styles.WhiteText}>Raise Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  Label: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Medium',
    color: '#003299',
    fontSize: 14,
    marginTop: 15,
  },

  inputStyle: {
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#D9F1FF',
    padding: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  inputStyleDescription: {
    textAlignVertical: 'top',
    height: 200,
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#D9F1FF',
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  WhiteText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: 'white',
  },

  Button: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003299',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: { width: 1, height: 8 },
    borderRadius: 5,
  },

  whiteBox: {
    marginTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: { width: 1, height: 8 },
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
});
