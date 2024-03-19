import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Bingo, font, images, style, color } from '../assets/config/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import { Button, Divider, Slider, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
// import { BingoHeader } from 'screens/layouts/components/header/mainHeader'
import { ScrollView } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
const winnersound = { url: require('../assets/winner.mp3') };
const claps = { url: require('../assets/claps.mp3') };
class WinnerPage extends Component {
  constructor() {
    super();

    this.state = {
      winners: [
        {
          name: 'Joenel Cardinal',
          amount: '25,000',
        },
        {
          name: 'Christian Carrera',
          amount: '10,000',
        },
        {
          name: 'Raymart Gomez',
          amount: '5,000',
        },
      ],
    };
  }
  async componentDidMount() {
    TrackPlayer.setupPlayer().then(async () => {
      TrackPlayer.setVolume(0.7);
      TrackPlayer.updateOptions({
        stopWithApp: true,
      });
      await TrackPlayer.add([winnersound, claps]);
      TrackPlayer.play();
    });
    // setTimeout(() => {
    //   Actions.buyticket();
    // }, 15000);
  }
  gohome = async () => {
    Actions.buyticket();
  };
  render() {
    return (
      <SafeAreaView style={style.container}>
        <LinearGradient
          colors={['#FF0000', '#570000']}
          style={{
            flexDirection: 'row',
            paddingHorizontal: wp(4),
            alignItems: 'center',
            height: hp('14%'),
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Actions.buyticket({ backgroundImage: this.props.backgroundImage })
            }
          >
            <Icon
              name='home'
              type='font-awesome-5'
              color='white'
              size={hp(4)}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              top: 5,
            }}
          >
            <Image
              source={images.drawerLogo}
              resizeMode='contain'
              style={{
                height: hp(10),
                aspectRatio: 199 / 108,
              }}
            />
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Icon
              name='money-bill'
              type='font-awesome-5'
              color='white'
              size={hp(4)}
            />
            {/* <Text style={fonts(hp(2), font.Bold, 'white')}>1000</Text> */}
            {this.props.balance ? (
              <NumberFormat
                value={this.props.balance ? this.props.balance : 0.0}
                displayType={'text'}
                thousandSeparator={true}
                thousandsGroupStyle={'thousand'}
                decimalScale={2}
                fixedDecimalScale={true}
                renderText={(value) => (
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontFamily: 'Montserrat-Bold',
                      color: 'white',
                    }}
                  >
                    {value}
                  </Text>
                )}
              />
            ) : (
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: 'Montserrat-Bold',
                  color: 'white',
                }}
              >
                0.00
              </Text>
            )}
            {/* <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Montserrat-Bold',
                color: 'white',
              }}
            >
              1000
            </Text> */}
          </View>
        </LinearGradient>
        <ImageBackground
          style={{ flex: 1, justifyContent: 'center' }}
          resizeMode='cover'
          source={images.bodyBG}
        >
          <View style={{ flex: 1 }}>
            <ScrollView>
              <ImageBackground
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: 375 / 593,
                  justifyContent: 'center',
                  marginVertical: 20,
                }}
                source={images.regBG}
                resizeMode='contain'
              >
                <View style={{ marginHorizontal: 20 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Image
                      style={{
                        height: 200,
                        width: undefined,
                        aspectRatio: 909 / 576,
                        alignSelf: 'center',
                      }}
                      source={require('../assets/images/treasure.png')}
                      resizeMode='contain'
                    />

                    <ImageBackground
                      style={{
                        height: undefined,
                        width: '100%',
                        aspectRatio: 1035 / 226,
                        position: 'absolute',
                        bottom: 0,
                      }}
                      source={require('../assets/images/redRibbon.png')}
                      resizeMode='contain'
                    >
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 25,
                          color: 'white',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}
                      >
                        CONGRATULATIONS
                      </Text>
                    </ImageBackground>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 20,
                          color: '#C72026',
                        }}
                      >
                        Winner's Name
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 20,
                          color: '#C72026',
                        }}
                      >
                        Prize Money
                      </Text>
                    </View>

                    <View>
                      {this.props.items.winners
                        ? this.props.items.winners.map((k, index) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginVertical: 10,
                                  alignItems: 'center',
                                }}
                                key={index}
                              >
                                <View style={{ flexDirection: 'row' }}>
                                  <Text
                                    style={{
                                      fontFamily: 'Montserrat-Bold',
                                      fontSize: 15,
                                      color: '#2A2A2A',
                                      width: 25,
                                    }}
                                  >
                                    {index + 1}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: 'Montserrat-Bold',
                                      fontSize: 12,
                                      color: '#2A2A2A',
                                    }}
                                  >
                                    {' '}
                                    {k.name.length > 16
                                      ? k.name.slice(0, 16) + '...'
                                      : k.name}
                                  </Text>
                                </View>
                                {k.prizemoney ? (
                                  <NumberFormat
                                    value={k.prizemoney ? k.prizemoney : 0.0}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    thousandsGroupStyle={'thousand'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    renderText={(value) => (
                                      <Text
                                        style={{
                                          fontFamily: 'Montserrat-Bold',
                                          fontSize: 15,
                                          color: '#C72026',
                                          marginRight: 10,
                                        }}
                                      >
                                        {value}
                                      </Text>
                                    )}
                                  />
                                ) : (
                                  <Text
                                    style={{
                                      fontFamily: 'Montserrat-Bold',
                                      fontSize: 15,
                                      color: '#C72026',
                                      marginRight: 10,
                                    }}
                                  >
                                    0.00
                                  </Text>
                                )}
                              </View>
                            );
                          })
                        : null}
                    </View>
                  </View>

                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => Actions.buyticket()}>
                      <LinearGradient
                        colors={[
                          '#D39D2A',
                          '#FFEA8F',
                          '#FFEA8F',
                          '#D39129',
                          '#FFEA8F',
                          '#D39D2A',
                        ]}
                        style={[styles.button, { padding: 10 }]}
                      >
                        <LinearGradient
                          colors={['#D40000', '#570000']}
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: 'Montserrat-ExtraBold',
                              fontSize: 15,
                              color: 'white',
                            }}
                          >
                            CONTINUE
                          </Text>
                        </LinearGradient>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    balance: state.balance,
  };
};

export default connect(mapStateToProps)(WinnerPage);

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
  },
});
