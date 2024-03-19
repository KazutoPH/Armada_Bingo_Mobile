import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
} from 'react-native';
import NumberFormat from 'react-number-format';
import { Actions } from 'react-native-router-flux';
//import NormalHeader from "../../common/mainheader";
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { connect } from 'react-redux';
import { Card, Button, Input, Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-tiny-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Referal extends Component {
  state = { reflink: '' };
  async componentDidMount() {
    Toast.showLoading();
    if (this.props.auth && this.props.auth.userId) {
      var getlink = await AsyncStorage.getItem('Reflink');

      if (!getlink) {
        const link = await dynamicLinks().buildShortLink({
          link: `https://armadatech.xyz/ref/?ref=${this.props.auth.userId}`,
          domainUriPrefix: 'https://armadatech.xyz/ref',

          android: {
            packageName: 'xyz.armadatech',
          },
        });
        if (link) {
          this.setState({ reflink: link });
          await AsyncStorage.setItem('Reflink', link);
          Toast.hide();
        }
      } else {
        this.setState({ reflink: getlink });
        Toast.hide();
      }
    }
  }
  clip = async (copylink) => {
    Clipboard.setString(copylink);

    await this.setState({ copytext: 'Link Copied Successfully' });
    setTimeout(async () => {
      await this.setState({ copytext: '' });
    }, 3000);
  };
  onshare = (copylink) => {
    const options = {
      title: 'ARMADA ',
      subject: 'Technology Opportunity Pilipino',
      message:
        'Install this wonderful App to do mobile financial transactions and also gives access to our digital marketplace, Juans TopShop',
      url: copylink,
    };
    Share.open(options)
      .then((res) => {})
      .catch((err) => {
        err && console.log('Share failed: ', err);
      });
  };
  render() {
    const copylink = this.state.reflink;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View>
            {/* <NormalHeader
              title="Refer & Earn"
              search={false}
              cart={false}
              onPress={() => Actions.pop()}
            /> */}
            <View style={{ paddingHorizontal: 5 }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',

                    textAlign: 'center',
                  }}
                >
                  Invite Family && Friends to {'\n'} DOWNLOAD AND START EARNING
                  WITH ARMADA
                </Text>
              </View>
              <View style={{ top: 5, marginBottom: 10 }}>
                <Image
                  source={require('../../assets/images/refermin.png')}
                  style={{
                    width: 150,
                    height: 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                }}
              >
                Copy link or share below:
              </Text>
              <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity
                  style={{
                    borderColor: 'green',
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  onPress={() => this.clip(copylink)}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      paddingVertical: 5,
                      fontFamily: 'Poppins-Regular',
                      color: 'green',
                    }}
                  >
                    {copylink.slice(0, 27) + '...'}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}
                >
                  {' '}
                  {this.state.copytext}{' '}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#353535',
                    flexDirection: 'row',
                    padding: 12,
                    borderRadius: 10,
                  }}
                  onPress={() => this.onshare(copylink)}
                >
                  <Icon
                    name='sharealt'
                    type='antdesign'
                    size={20}
                    color='white'
                    style={{
                      width: 40,
                      height: 40,

                      borderRadius: 50,
                      backgroundColor: '#00c7fe',
                      justifyContent: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      left: 2,
                      color: 'white',
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ top: 20, height: 'auto' }}>
                <View style={{ bottom: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold' }}>
                    LEADER BOARD
                  </Text>
                </View>

                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: '#553b7c',
                    alignSelf: 'center',
                    paddingVertical: 10,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <View
                      style={{ justifyContent: 'flex-start', width: wp('15%') }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'white',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        S.NO
                      </Text>
                    </View>
                    <View
                      style={{ justifyContent: 'flex-start', width: wp('48%') }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'white',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        USER ID
                      </Text>
                    </View>
                    <View
                      style={{ justifyContent: 'flex-start', width: wp('24%') }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'white',
                          fontFamily: 'Poppins-Regular',
                          alignSelf: 'flex-end',
                        }}
                      >
                        Commision
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #1
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD123456
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #2
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #3
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #4
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #5
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #6
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: wp('95%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#d2d2d2',
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('15%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        #7
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('48%'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#343434',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        TOPABCD234678
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        width: wp('23%'),
                      }}
                    >
                      <NumberFormat
                        value={0}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#5A3993',
                              fontFamily: 'Poppins-SemiBold',
                              alignSelf: 'center',
                            }}
                          >
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balances: state.balances,
    auth: state.auth,
    rider: state.rider,
  };
};

export default connect(mapStateToProps)(Referal);

const styles = StyleSheet.create({
  topContainer: {
    elevation: 6,
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
    paddingHorizontal: wp('5%'),

    alignItems: 'center',
    height: 100,
  },
  botContainer: {
    elevation: 6,
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
    borderBottomLeftRadius: wp('3%'),
    borderBottomRightRadius: wp('3%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#00000030',
  },
  mapContainer: {
    elevation: 6,
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
    borderBottomLeftRadius: wp('3%'),
    borderBottomRightRadius: wp('3%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#00000030',
  },
  buttonContainer: {
    paddingHorizontal: wp('5%'),
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: wp('3.5%'),
  },
  inputContainer: {
    backgroundColor: '#EBEBEB',
    marginVertical: wp('1%'),
    borderRadius: wp('2%') / 2,
    height: wp('10%'),
  },
  input: {
    borderBottomWidth: 0,
  },
  inputText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: wp('3.5%'),
  },
  errorMessage: {
    display: 'none',
  },
  btn: {
    backgroundColor: '#353535',
    margin: wp('3%'),
    height: wp('12%'),
    borderRadius: wp('50%') / 2,
  },
  header: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#353535',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
  },
  backArrow: {
    marginLeft: wp('2%'),
  },

  backButtonIcon: {
    width: wp('5%'),
    height: hp('5%'),
  },

  titles: {
    color: 'white',
    padding: 12,
    fontSize: hp('2.5%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    flex: 1,
  },

  map: {
    // flex: 1,
    height: hp('50%'),
    width: wp('80%'),
  },
  cardBtn: {
    width: 'auto',
    padding: 20,
    height: 30,
    borderRadius: 20,
    // marginRight: 5,
  },
  cancelcardBtn: {
    width: 'auto',
    padding: 20,
    height: 30,
    borderRadius: 20,
    // marginRight: 5,
    backgroundColor: 'red',
  },
});
