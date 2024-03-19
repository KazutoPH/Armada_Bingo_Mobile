import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { BarIndicator } from 'react-native-indicators';
import Moment from 'react-moment';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';
import getSupporttickets from '../../redux/actions/getSupTicketsAction';
import { font } from '../../assets/config/config';
import DashboardHeader from '../../components/dashboardheader';
import { ArmadaHeader } from '../../components/armadaheader';

class ContactUs extends Component {
  state = {
    loader: false,
    refreshing: false,
  };
  async componentDidMount() {
    if (this.props.stickets.length <= 0) {
      await this.setState({ loader: true });
      getSupporttickets();
    }
    setTimeout(async () => {
      await this.setState({ loader: false });
    }, 2000);
  }
  _refresh = async () => {
    await this.setState({ refreshing: true });

    setTimeout(async () => {
      getSupporttickets();
      await this.setState({ refreshing: false });
    }, 2000);
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#D9F1FF' }}>
        <ArmadaHeader />
        <View style={styles.topWhiteBox}>
          <View style={styles.box}>
            <Text style={styles.WhiteText}>Open</Text>
            <Text style={styles.WhiteText}>Ticket</Text>
            <Text style={styles.WhiteText}>
              {this.props.stickets.opencount}
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.Button}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => Actions.raiseticket()}
              >
                <Text style={styles.WhiteText}>Raise Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.box}>
            <Text style={styles.WhiteText}>Closed</Text>
            <Text style={styles.WhiteText}>Ticket</Text>
            <Text style={styles.WhiteText}>
              {this.props.stickets.closecount}
            </Text>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title='Loading...'
            />
          }
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              marginHorizontal: 10,
              height: hp('100%'),
            }}
          >
            {!this.state.loader ? (
              this.props.stickets.success &&
              this.props.stickets.success.length > 0 ? (
                this.props.stickets.success.map((k, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => Actions.ticketdetails({ k })}
                      style={{ marginHorizontal: 10, paddingHorizontal: 10 }}
                    >
                      <View style={{ marginTop: 10 }}>
                        <View style={styles.whiteBox}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={styles.dateContainer}>
                              <Text
                                style={[{ fontSize: 15 }, styles.DefaultText]}
                              >
                                <Moment unix format='DD' element={Text} fromNow>
                                  {k.datetime / 1000}
                                </Moment>
                              </Text>
                              <Text
                                style={[
                                  { fontSize: 10, marginTop: 5 },
                                  styles.DefaultText,
                                ]}
                              >
                                <Moment
                                  unix
                                  format='MMM'
                                  element={Text}
                                  fromNow
                                >
                                  {k.datetime / 1000}
                                </Moment>
                              </Text>
                            </View>

                            <View style={{ paddingHorizontal: 15, flex: 1 }}>
                              <Text
                                style={[{ fontSize: 10 }, styles.DefaultText]}
                              >
                                Ticket No. : #{k.ticket_id}
                              </Text>
                              <Text
                                style={[
                                  { fontSize: 13, marginTop: 5 },
                                  styles.DefaultText,
                                ]}
                              >
                                {k.title}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.smallButton} activeOpacity={0.5}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: 15,
                                color: 'red',
                              }}
                            >
                              {k.status === 'Close' ? 'Closed' : 'Open'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: hp('60%'),
                  }}
                >
                  <Text style={{ color: 'red', fontFamily: font.Bold }}>
                    No Tickets Found
                  </Text>
                </View>
              )
            ) : (
              <BarIndicator
                style={{
                  marginBottom: hp('1%'),
                  alignSelf: 'center',
                }}
                color='#FF0000'
                count={6}
              />
            )}
          </View>
        </ScrollView>
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
    stickets: state.supporttickets,
  };
};

export default connect(mapStateToProps)(ContactUs);

const styles = StyleSheet.create({
  topWhiteBox: {
    marginTop: 5,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: { width: 1, height: 8 },
  },

  box: {
    alignItems: 'center',
    backgroundColor: '#674a62',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },

  WhiteText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: 'white',
  },

  DefaultText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },

  Button: {
    marginVertical: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#674a62',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    borderRadius: 5,
  },

  smallButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    borderRadius: 5,
  },
  smallcloseButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    borderRadius: 5,
  },
  whiteBox: {
    alignItems: 'center',
    backgroundColor: '#674a62',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: { width: 1, height: 8 },
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: wp('1%'),
  },

  dateContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
});
