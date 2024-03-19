import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  AppState,
} from 'react-native';
import {
  ballimages,
  Bingo,
  font,
  images,
  style,
} from '../assets/config/config';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Button, Icon, Header, Badge } from 'react-native-elements';

import _ from 'lodash';
import socketIO from 'socket.io-client';
import { Actions } from 'react-native-router-flux';
import BingoCards from './bingocards';
import get_games from '../redux/actions/gamesAction';
import NumberFormat from 'react-number-format';
import Tts from 'react-native-tts';
import { connect } from 'react-redux';
import hrlpr from '../../cryptos';
import AsyncStorage from '@react-native-async-storage/async-storage';
const menu = require('../assets/images/header/menu.png');
const notification = require('../assets/images/newnotification.png');
import TrackPlayer from 'react-native-track-player';
const greenball = require('../assets/images/greenball.png');

import Config from 'react-native-config';
import get_history from '../redux/actions/historyAction';
import Sound from 'react-native-sound';

const track = require('../assets/music.mp3');
const welcometone = { url: require('../assets/welcome.mp3') };
const headerimg = require('../assets/images/rigelheader.png');
var whoosh = new Sound(track, (error) => {
  whoosh.setNumberOfLoops(-1);
  whoosh.setVolume(0.2);
});

class BingoPage extends Component {
  state = {
    seas: [
      require('../assets/images/7seas/shipwreckIslandbg.jpg'),
      require('../assets/images/7seas/dayIslandbg.jpg'),
      require('../assets/images/7seas/sunsetSeasbg.jpg'),
      require('../assets/images/7seas/rockyRainingIslandbg.jpg'),
      require('../assets/images/7seas/oceanbg.jpg'),
      require('../assets/images/7seas/foggyseasbg.jpg'),
      require('../assets/images/7seas/nightIslandbg.jpg'),
    ],
    currentColorGradient1: '#E7524F',
    currentColorGradient2: '#742928',
    bingoCards: [],
    displayGameModes: true,
    hideimg: true,
    rimg: [],
    ct: true,
    speaksound: true,
    num: [],
    drnum: [],
    userPattern: [],
    usernums: [],
    drnum: [],
    usercount: '',
    startgame: false,
    bsimg: '',
  };

  socket = socketIO(Config.Socketurl, {
    query: `gno=${JSON.stringify({
      gameid: this.props.items.gamedata.gameid,
    })}`,
  });

  async componentDidMount() {
    const bg = await AsyncStorage.getItem('backgroundimage');

    await this.setState({ bsimg: this.state.seas[bg] });
    this.setState({ startgame: true });
    const socroute = Config.Socketroute;
    TrackPlayer.setupPlayer().then(async () => {
      TrackPlayer.setVolume(0.5);

      await TrackPlayer.add([welcometone]);
      TrackPlayer.play();
      TrackPlayer.updateOptions({
        stopWithApp: true,
      });
    });

    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    setTimeout(() => {
      whoosh.play();
    }, 4000);

    setTimeout(async () => {
      this.socket.on(socroute, async (data) => {
        var dat = await hrlpr.decryptobj(data);
        if (dat && dat.winners && dat.winners.length > 0) {
          if (dat.winners[0].prizemoney > 0) {
            var winleght = dat.winners.some(
              (win) => win.winpat === this.props.items.gamedata.pattern
            );
          }
        }

        if (dat.failure) {
          await this.socket.off();
          TrackPlayer.stop();
          whoosh.stop();
          get_games();
          setTimeout(() => {
            this.setState({ startgame: false });
            Actions.buyticket();
          }, 1000);
        } else if (winleght) {
          await this.socket.off();
          if (this.state.speaksound) {
            Tts.getInitStatus().then(() => {
              Tts.speak('Congratulations To The Bingo Winner');
            });
          }
          var obj = {
            winners: dat.winners,
            drnum: dat.drawnum,
            bimage: this.props.items.bingoimage,
          };
          setTimeout(async () => {
            Tts.stop(true);
            whoosh.stop();
            get_games();
            get_history();
            TrackPlayer.stop();
            this.setState({ startgame: false });

            Actions.winnerpage({ items: obj });
          }, 3000);
        } else if (!this.state.drnum.includes(dat.drawnum[0])) {
          await this.setState({
            num: [dat.drawnum.slice(-1)[0]],
            drnum: dat.drawnum,
            usercount: dat.usercount,
          });
          if (this.state.speaksound) {
            Tts.getInitStatus()
              .then(() => {
                Tts.speak(
                  this.selectnum(dat.drawnum[0].toString()) +
                  dat.drawnum[0].toString()
                );
              })
              .then(Tts.stop(true));
          }
        }
      });
    }, 5000);
  }
  componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }
  handleAppStateChange(currentAppState) {
    if (currentAppState != 'active') {
      this.setState({ speaksound: false });
      whoosh.pause();
    } else {
      this.setState({ speaksound: true });

      if (this.state.startgame) {
        whoosh.play();
      }
    }
  }
  get_random = function (list) {
    return list[Math.floor(Math.random() * list.length)];
  };

  selectnum = (b) => {
    if (b >= 1 && b <= 15) {
      return 'B';
    } else if (b >= 16 && b <= 30) {
      return 'I';
    } else if (b >= 31 && b <= 45) {
      return 'N';
    } else if (b >= 46 && b <= 60) {
      return 'G';
    } else if (b >= 61 && b <= 75) {
      return 'O';
    } else {
      null;
    }
  };
  componentWillUnmount = async () => {
    await this.socket.off();
  };

  gohome = async () => {
    await this.socket.off();
    await whoosh.stop();

    this.setState({ startgame: false });
    TrackPlayer.stop();
    Actions.buyticket();
  };
  gomenu = () => {
    Actions.drawerOpen();
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <LinearGradient
          colors={["#FF0000", "#570000"]}
          style={{ flexDirection: 'row', paddingHorizontal: wp(4), alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-end', height: hp(10), marginBottom: hp(0.5), }}>

            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }} >

              <View style={{ marginBottom: -hp(0.5) }}>
              <Icon
                name='home'
                type='font-awesome-5'
                color='white'
                size={hp(6)}
                onPress={() => this.gohome()}
              />
              </View>


              <View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: wp(3) }}>
                  <Text style={{ alignSelf: 'center', marginBottom: hp(0.5), fontFamily: font.Bold, color: 'white', fontSize: hp(1.5) }}>GEMS</Text>
                  <Image
                    source={require('../assets/images/diamond.png')}
                    style={{ height: hp(3), width: undefined, aspectRatio: 47 / 41, marginBottom: hp(0.5) }}
                    resizeMode='contain'
                  />
                  <Text style={{ marginBottom: -hp(0.5), fontFamily: font.Bold, color: 'white', fontSize: hp(2) }}>1000</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ alignSelf: 'center', fontFamily: font.Bold, color: 'white', fontSize: hp(1.5), marginBottom: -hp(0.5) }}>POT</Text>
              <Image
                source={require('../assets/images/potofgold.png')}
                style={{ height: hp(4), width: undefined, aspectRatio: 70 / 58, marginBottom: hp(0.5) }}
                resizeMode='contain'
              />

              <NumberFormat
                value={this.props.items.pot ? this.props.items.pot : 0.0}
                displayType={'text'}
                thousandSeparator={true}
                thousandsGroupStyle={'thousand'}
                decimalScale={2}
                fixedDecimalScale={true}
                renderText={(value) => (
                  <Text style={{ alignSelf: 'center', fontFamily: font.Bold, color: 'white', fontSize: hp(2), marginTop: -hp(0.5) }}>
                    {value} G
                  </Text>
                )}
              />
            </View>

          </View>

          <View style={{ position: 'absolute', alignSelf: 'center' }}>
            <Image
              source={require('../assets/images/armadatextonly.png')}
              resizeMode="contain"
              style={{
                height: hp(10),
                aspectRatio: 228 / 113,
                marginLeft: wp(3)
              }}
            />
          </View>

        </LinearGradient>

        {/* GOLD BACKGROUND BALLS AND CARD */}
				<ImageBackground
					style={{ paddingVertical: hp(1.5) }}
					source={require('../assets/images/BingoGoldHeader.png')}
					resizeMode='cover'>

					<ImageBackground
						style={{ width: hp(20), height: undefined, aspectRatio: 375 / 345, justifyContent: 'center' }}
						source={require('../assets/images/brownPaper.png')}
						resizeMode='contain'>

						<View style={{ alignSelf: 'center' }}>
							<LinearGradient
								colors={[this.state.currentColorGradient1, this.state.currentColorGradient2]}
								style={{ width: hp(5), height: hp(5), borderRadius: hp(5) / 2, alignItems: 'center', justifyContent: 'center', marginLeft: -hp(2.5), zIndex: 2 }}>
								<View style={{ width: hp(4), height: hp(4), borderRadius: hp(4) / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
									<Text style={{ fontFamily: font.Bold, fontSize: hp(2.5), color: '#000000' }}>{this.selectnum(
                      this.state.drnum.length > 0 ? this.state.drnum[0] : 0
                    )}</Text>
								</View>
							</LinearGradient>

							<LinearGradient
								colors={[this.state.currentColorGradient1, this.state.currentColorGradient2]}
								style={{ width: hp(8), height: hp(8), borderRadius: hp(8) / 2, alignItems: 'center', justifyContent: 'center', marginTop: -10, zIndex: 1 }}>
								<View style={{ width: hp(6), height: hp(6), borderRadius: hp(6) / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
									<Text style={{ fontFamily: font.Bold, fontSize: 33, color: '#000000', marginTop: -5 }}>{this.state.drnum.length > 0 ? this.state.drnum[0] : 0}</Text>
								</View>
							</LinearGradient>
						</View>

						<View style={{ paddingVertical: hp(0.1), paddingHorizontal: hp(.5), backgroundColor: '#313630', alignSelf: 'center', marginTop: hp(0.5) }}>
							<Text style={{ fontFamily: font.Bold, fontSize: hp(2.5), color: '#FFEA8F' }}>Live</Text>
						</View>
					</ImageBackground>

					<View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
						<Image style={{ aspectRatio: 213 / 238, height: hp(18), width: undefined, marginLeft: 20 }}
							source={this.props.items.bingoimage}
							resizeMode='contain' />
					</View>

				</ImageBackground>

        <ImageBackground
          style={{ paddingHorizontal: wp(2), paddingVertical: hp(0.5) }}
          source={require('../assets/images/cloud.png')}
          resizeMode='cover'
        >
          {/* B ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageBackground
              style={{
                height: hp(4),
                width: undefined,
                aspectRatio: 37 / 29,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../assets/images/maroonCanon.png')}
              resizeMode='contain'
            >
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: hp(3),
                  color: 'white',
                }}
              >
                B
              </Text>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {Bingo.B.map((data, index) =>
                this.state.drnum.length > 0 &&
                  this.state.drnum.includes(data) ? (
                  <LinearGradient
                    key={index}
                    colors={['#E7524F', '#742928']}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),

                        color:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? 'white'
                            : 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    key={index}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* I ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageBackground
              style={{
                height: hp(4),
                width: undefined,
                aspectRatio: 37 / 29,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../assets/images/blueCanon.png')}
              resizeMode='contain'
            >
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: hp(3),
                  color: 'white',
                }}
              >
                I
              </Text>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {Bingo.I.map((data, index) =>
                this.state.drnum.length > 0 &&
                  this.state.drnum.includes(data) ? (
                  <LinearGradient
                    key={index}
                    colors={['#1875B4', '#0C3B5A']}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'white',
                      }}
                    >
                      {data}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    key={index}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* N ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageBackground
              style={{
                height: hp(4),
                width: undefined,
                aspectRatio: 37 / 29,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../assets/images/brownCanon.png')}
              resizeMode='contain'
            >
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: hp(3),
                  color: 'white',
                }}
              >
                N
              </Text>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {Bingo.N.map((data, index) =>
                this.state.drnum.length > 0 &&
                  this.state.drnum.includes(data) ? (
                  <LinearGradient
                    key={index}
                    colors={['#C19B34', '#614E1A']}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'white',
                      }}
                    >
                      {data}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    key={index}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* G ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageBackground
              style={{
                height: hp(4),
                width: undefined,
                aspectRatio: 37 / 29,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../assets/images/violetCanon.png')}
              resizeMode='contain'
            >
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: hp(3),
                  color: 'white',
                }}
              >
                G
              </Text>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {Bingo.G.map((data, index) =>
                this.state.drnum.length > 0 &&
                  this.state.drnum.includes(data) ? (
                  <LinearGradient
                    key={index}
                    colors={['#A50E91', '#530749']}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'white',
                      }}
                    >
                      {data}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    key={index}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* O ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ImageBackground
              style={{
                height: hp(4),
                width: undefined,
                aspectRatio: 37 / 29,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../assets/images/greenCanon.png')}
              resizeMode='contain'
            >
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: hp(3),
                  color: 'white',
                }}
              >
                O
              </Text>
            </ImageBackground>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {Bingo.O.map((data, index) =>
                this.state.drnum.length > 0 &&
                  this.state.drnum.includes(data) ? (
                  <LinearGradient
                    key={index}
                    colors={['#458E42', '#234721']}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'white',
                      }}
                    >
                      {data}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    key={index}
                    style={{
                      height: hp(3),
                      width: hp(3),
                      borderRadius: hp(3) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize:
                          this.state.drnum.length > 0 &&
                            this.state.drnum.includes(data)
                            ? hp(1.8)
                            : hp(1.4),
                        color: 'black',
                      }}
                    >
                      {data}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          style={{
            flex: 1,
            height: undefined,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode='cover'
          source={this.state.bsimg}
        >
          <BingoCards
            ucount={this.state.usercount}
            gnum={this.state.drnum}
            gamedata={this.props.items.gamedata}
          />
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

export default connect(mapStateToProps)(BingoPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameModeContainer: {
    backgroundColor: 'white',
  },
  headerStyle: {
    backgroundColor: '#001563',
    //height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent: 'center',
    //height: hp('8%')
    marginTop: hp('3%'),
    paddingVertical: hp('1%'),
  },
  leftIcon: {
    height: 30,
    width: 40,
    marginLeft: 10,
  },
  betBadge: {
    backgroundColor: '#3B99D4',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    borderRadius: 30 / 2,
  },

  liveBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#A70000',
    width: 50,
  },

  liveTextContainer: {
    backgroundColor: '#A70000',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 4,
    top: -10,
  },

  boldWhiteText: {
    fontFamily: font.Bold,
    color: 'white',
  },

  boldText: {
    fontFamily: font.Bold,
    fontSize: 22,
  },

  greyContainer: {},

  whiteContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  bingoimageContainer: {
    height: 400,
    width: 320,

    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  blackBox: {
    backgroundColor: '#353535',
    height: 45,
    width: 45,
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  lightYellowContainer: {
    backgroundColor: '#FFFFE4',
    height: 45,
    width: 45,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  circle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30 / 2,
  },

  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -15,
  },

  button: {
    width: 160,
    height: 60,
    borderRadius: 10,
    borderWidth: 10,
    borderColor: '#B00066',
  },
  hnewcoderight: {
    bottom: 22,
    left: 10,
    width: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  livedot: {
    width: 20,
    height: 20,
    backgroundColor: '#3B99D4',
    borderRadius: 50,
    position: 'absolute',
    zIndex: 99,
    top: -1,
    alignItems: 'center',
  },

  recentdot: {
    width: 20,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 50,
    position: 'absolute',
    zIndex: 99,

    left: 10,
    alignItems: 'center',
  },

  gamecircle1: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#e93f33',
    borderRadius: 50,
    left: 5,

    marginBottom: 2,
    marginRight: 10,
  },

  gamecircle2: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#b57522',
    borderRadius: 50,
    zIndex: 99,
    left: 5,
    marginBottom: 2,
    marginRight: 10,
  },

  gamecircle3: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#63c78a',
    borderRadius: 50,
    zIndex: 99,
    left: 5,
    marginBottom: 2,
    marginRight: 10,
  },

  gamecircle4: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#9d57e7',
    borderRadius: 50,
    zIndex: 99,
    left: 5,
    marginBottom: 2,
    marginRight: 10,
  },

  gamecircle5: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderColor: '#ef9998',
    borderRadius: 50,
    zIndex: 99,
    left: 5,
    marginBottom: 2,
    marginRight: 10,
  },

  liveletter: {
    lineHeight: 18,
    color: '#fff',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    right: 1,
  },
  recliveletter: {
    lineHeight: 18,
    color: '#fff',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },

  gameballtxt: {
    lineHeight: 18,
    color: '#222',
    textAlignVertical: 'center',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: font.SemiBold,
  },

  gamenumber: {
    textAlignVertical: 'center',
    fontSize: wp('3.2%'),
    textAlign: 'center',
    top: -3,
    fontFamily: font.SemiBold,
  },
});
