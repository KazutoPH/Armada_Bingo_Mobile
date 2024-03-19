import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
const { width } = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import Toast from 'react-native-tiny-toast';
import Moment from 'react-moment';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';
import get_history from '../../redux/actions/historyAction';
import DashboardHeader from '../../components/dashboardheader';
import { ArmadaHeader } from '../../components/armadaheader';

class History2 extends Component {
  state = {
    isModalVisible: false,
    modaldata: [],
    loader: false,
    refreshing: false,
    loadbutton: false,
  };
  componentDidMount = async () => {
    get_history();
    if (!this.props.history.length > 0) {
      await this.setState({ loadbutton: true });
    } else {
      await this.setState({ loadbutton: false });
    }
    setTimeout(async () => {
      await this.setState({ loader: false });
    }, 2500);
  };
  loaddata = async () => {
    Toast.showLoading();
    this.setState({ loader: true, loadbutton: false });
    await get_history();
    setTimeout(() => {
      Toast.hide();
      this.setState({ loader: false });
    }, 2000);
  };

  toggleModal = async (data) => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      modaldata: data,
    });
  };

  _refresh = async () => {
    await this.setState({ refreshing: true });
    setTimeout(async () => {
      await get_history();
      await this.setState({ refreshing: false });
    }, 1000);
  };
  render() {
    const history = this.props.history;

    const { modaldata } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEBEB' }}>
        <ArmadaHeader />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title='Loading...'
            />
          }
        >
          <View style={styles.container}>
            {!this.state.loader ? (
              !this.state.loadbutton ? (
                history.length > 0 ? (
                  history.map((hist, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => this.toggleModal(hist)}
                        style={styles.BlueBox}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'Montserrat-Bold',
                            }}
                          >
                            {hist.comment.length > 20
                              ? hist.comment.slice(0, 20) + '...'
                              : hist.comment}
                          </Text>
                          <NumberFormat
                            value={hist.amount}
                            displayType={'text'}
                            thousandSeparator={true}
                            thousandsGroupStyle={'lakh'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'Montserrat-Bold',
                                }}
                              >
                                {value} Gems
                              </Text>
                            )}
                          />

                          <Text
                            style={{
                              fontSize: 9,
                              fontFamily: 'Montserrat-Bold',
                            }}
                          >
                            <Moment
                              format='DD/MM/YYYY hh:mm A'
                              element={Text}
                              fromNow
                            >
                              {hist.date}
                            </Moment>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: hp('70%'),
                    }}
                  >
                    <Text
                      style={{
                        color: 'red',
                        fontsize: 14,
                        textAlign: 'center',
                      }}
                    >
                      No Records Found
                    </Text>
                  </View>
                )
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: hp('70%'),
                  }}
                >
                  <View style={styles.buttonContainer}>
                    <View style={styles.signinwrapper}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.loaddata}
                      >
                        <View style={styles.depositraisedbutton}>
                          <Text style={styles.raisedbuttonText}>
                            Load History
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            ) : null}
          </View>
        </ScrollView>
        <Modal
          transparent={false}
          animationType='fade'
          style={styles.modalcontainer}
          onBackdropPress={() => this.toggleModal(modaldata)}
          isVisible={this.state.isModalVisible}
        >
          <View style={styles.transparentBackground}>
            <View style={styles.MoreDetailsContainer}>
              <View style={styles.TitleContainer}>
                <View style={styles.leftContainer} />
                <Text style={styles.Title}>Details</Text>
                <View style={styles.rightContainer}>
                  <Icon
                    name='close'
                    size={hp('4%')}
                    color='black'
                    onPress={() => this.toggleModal(modaldata)}
                  />
                </View>
              </View>
              <View style={styles.Details}>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'grey',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      marginHorizontal: wp('2%'),
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Bold',
                        textAlign: 'center',
                      }}
                    >
                      {modaldata.comment}
                    </Text>
                  </View>
                  {modaldata.gameid !== '0' ? (
                    <View style={styles.Row}>
                      <Text style={styles.greyText}>Game ID</Text>
                      <Text style={styles.blackText}>{modaldata.gameid}</Text>
                    </View>
                  ) : null}
                  {modaldata.tickets > 0 ? (
                    <View style={styles.Row}>
                      <Text style={styles.greyText}>Tickets</Text>
                      <Text style={styles.blackText}>{modaldata.tickets}</Text>
                    </View>
                  ) : null}
                  <View style={styles.Row}>
                    <Text style={styles.greyText}>Transaction ID</Text>
                    <Text style={styles.blackText}>
                      {modaldata.transactionid}
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Text style={styles.greyText}>Date</Text>
                    <Text style={styles.blackText}>
                      <Moment
                        format='DD/MM/YYYY hh:mm A'
                        element={Text}
                        fromNow
                      >
                        {modaldata.date}
                      </Moment>
                    </Text>
                  </View>
                  <View style={styles.Row}>
                    <Text style={styles.greyText}>Amount</Text>

                    <NumberFormat
                      value={modaldata.amount}
                      displayType={'text'}
                      thousandSeparator={true}
                      thousandsGroupStyle={'lakh'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      renderText={(value) => (
                        <Text style={styles.blackText}>{value} Gems</Text>
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    history: state.history,
  };
};

export default connect(mapStateToProps)(History2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
  background: {
    width,
  },
  transactioncontainer: {
    borderColor: 'grey',
  },
  textrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
  },
  amountdescription: {
    flexDirection: 'column',
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
  },
  trdescription: {
    flexDirection: 'column',
    marginLeft: wp('2%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
    width: wp('40%'),
  },
  descriptionmoney: {
    flexDirection: 'column',
    marginRight: wp('4%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-end',
  },
  modalcontainer: {
    justifyContent: 'center',
  },
  modalcontainerinfo: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.12,

    elevation: 5,
  },
  modalheader: {
    height: 40,
    top: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  amountcontainer: {
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('3%'),
    flexWrap: 'nowrap',
  },
  datecontainer: {
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('3%'),
  },
  amounttextcontainer: {
    alignSelf: 'flex-start',
    width: wp('20%'),
  },
  amounttext: {
    color: '#FFA700',
    fontSize: 10,
    fontFamily: 'Montserrat-SemiBold',
  },
  amountvaluecontainer: {
    alignSelf: 'flex-end',
  },
  modalbodycontainer: {
    marginTop: hp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  footercontainer: {
    margin: 15,
  },
  button: {
    margin: 4,
    fontFamily: 'Montserrat-Regular',
    width: 40,
    height: 40,
  },

  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',

    marginTop: hp('2%'),
  },
  WithdrawbuttonContainer: {
    backgroundColor: '#AA0000',
    width: wp('24%'),
    height: 40,

    borderRadius: 8,
    marginLeft: wp('3%'),
  },
  signinwrapper: {
    width: wp('35%'),
    height: hp('12%'),
    marginTop: hp('2%'),
  },
  depositraisedbutton: {
    backgroundColor: '#F1D8B9',
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderRadius: 5,
  },
  withdrawraisedbutton: {
    backgroundColor: '#AA0000',
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  raisedbuttonText: {
    color: 'black',
    fontSize: wp('3%'),
    fontFamily: 'Montserrat-Medium',
    textTransform: 'uppercase',
  },
  BlueBox: {
    marginVertical: hp('0.6%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('2%'),

    backgroundColor: '#F1D8B9',
    width: wp('90%'),
    borderRadius: wp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  WhiteText: {
    lineHeight: hp('3%'),
    color: 'black',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },

  transparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
  },
  MoreDetailsContainer: {
    marginTop: hp('3%'),
    width: wp('90%'),
    borderRadius: wp('2.5%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  Details: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 25,
  },

  TitleContainer: {
    backgroundColor: '#F1D8B9',
    width: wp('90%'),
    flexDirection: 'row',
    height: hp('5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'green',
  },

  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
  Title: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    // lineHeight: hp('8%'),
    color: 'black',
    flexWrap: 'wrap',
    marginHorizontal: wp('3%'),
  },

  Row: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },

  greyText: {
    width: wp('40%'),
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('2%'),
    color: '#8D8D8D',
  },
  greyText2: {
    textAlignVertical: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.2%'),
    color: '#8D8D8D',
  },

  blackText: {
    width: wp('30%'),
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('2%'),
    color: 'black',
  },

  pdfLogo: {
    marginLeft: -20,
    flex: 1,
    transform: [
      {
        scale: 0.4,
      },
    ],
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'green',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
  title: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2.5%'),
    lineHeight: hp('8%'),
    color: 'white',
  },
});
