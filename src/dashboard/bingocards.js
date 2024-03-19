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
  Dimensions,
} from 'react-native';
import _ from 'lodash';
import Swiper from 'react-native-swiper';
import {
  ballimages,
  Bingo,
  font,
  images,
  style,
} from '../assets/config/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Icon, Header, Badge } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import { WinPatterns } from './winpatterns';
import game from '../services/gameService';
import Spinner from 'react-native-loading-spinner-overlay';

import TrackPlayer from 'react-native-track-player';

const buttonsound = { url: require('../assets/button.mp3') };
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};
class BingoCards extends Component {
  state = {
    num: [],
    numid: [],
    arr: [],
    usernums: [],
    match: false,
    cardid: '',
    userPattern: [],
    numloader: false,
    pattern: [],
    loader: false,
    numloader: false,
    claimcard: '',
    bingobtndisable: false,
    orientation: isPortrait() ? 'portrait' : 'landscape',
    bingoCards: [],
    showModal: false,
    popup: false,
    card: ['A', 'B'],
    selectedNumbers: [10, 3, 45, 30, 23, 55, 14, 13, 1, 2, 4, 5, 6, 66],
    displayGameModes: true,
    modalVisible: true,
    currentLetter: 'B',
    currentNo: '1',
    currentColorGradient1: '#313630',
    currentColorGradient2: '#742928',
    bingoDraw: [
      {
        letter: 'B',
        gradient1: '#E7524F',
        gradient2: '#742928',
        num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
      {
        letter: 'I',
        gradient1: '#1875B4',
        gradient2: '#0C3B5A',
        num: [0, 0, 18, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        letter: 'N',
        gradient1: '#C19B34',
        gradient2: '#614E1A',
        num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 0, 0, 38],
      },
      {
        letter: 'G',
        gradient1: '#A50E91',
        gradient2: '#530749',
        num: [0, 0, 0, 0, 47, 0, 0, 0, 0, 0, 0, 52, 0, 0, 0],
      },
      {
        letter: 'O',
        gradient1: '#458E42',
        gradient2: '#234721',
        num: [61, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  componentDidMount() {}
  sendnum = async (da, id, cid) => {
    TrackPlayer.setupPlayer().then(async () => {
      TrackPlayer.setVolume(0.5);

      await TrackPlayer.add([buttonsound]);

      TrackPlayer.play();
    });

    await this.setState({ numloader: true });
    if (this.props.gnum.includes(parseFloat(da))) {
      if (!this.state[cid]) {
        this.setState({ [cid]: [id] });
        setTimeout(async () => {
          await this.setState({ numloader: false });
        }, 1000);
      } else if (!this.state[cid].includes(id)) {
        this.setState({ [cid]: [...this.state[cid], id] });
        setTimeout(async () => {
          await this.setState({ numloader: false });
        }, 1000);
      }

      if (
        this.props.gnum.includes(parseFloat(da)) &&
        !this.state.usernums.includes(parseFloat(da))
      ) {
        const selectnums = this.state.usernums;
        selectnums.push(parseFloat(da));
        await this.setState({
          usernums: selectnums,
        });
        setTimeout(async () => {
          await this.setState({ numloader: false });
        }, 1000);
      } else {
        setTimeout(async () => {
          await this.setState({ numloader: false });
        }, 1000);
      }
    } else {
      setTimeout(async () => {
        await this.setState({ numloader: false });
      }, 1000);
    }
  };
  sendbingo = async (card, patt) => {
    await this.setState({ loader: true, bingobtndisable: true });
    if (!this.state[card.cardid]) {
      await this.setState({ loader: false, bingobtndisable: false });
      Toast.show('Invalid Pattern', {
        position: Toast.position.CENTER,
        imgSource: require('../assets/images/error.png'),
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
      const gnum = this.props.gnum;
      const unum = this.state.usernums;
      var gameid = await this.props.gamedata.gameid;
      let checker = (unum, gnum) => unum.every((v) => gnum.includes(v));
      if (checker(unum, gnum)) {
        var patt = this.props.gamedata.pattern;
        if (patt === this.props.gamedata.pattern) {
          var di = await WinPatterns[patt](this.state[card.cardid]);

          if (di && di.length) {
            this.setState({
              claimcard: [...this.state.claimcard, card.cardid],
            });

            di.map((n) => {
              return this.state.pattern.push(n);
            });

            const gamedet = {
              gameid: this.props.gamedata.gameid,
              cardid: card.cardid,
              winpat: this.props.gamedata.pattern,
              usernum: this.state.usernums,
            };

            try {
              const data = await game.gamebingo(gamedet);
              if (data) {
                Toast.show(data.success, {
                  position: Toast.position.CENTER,
                  imgSource: require('../assets/images/success.png'),
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
                  await this.setState({
                    loader: false,
                    bingobtndisable: false,
                  });
                }, 3000);
              }
            } catch (ex) {
              await this.setState({ loader: false, bingobtndisable: false });
              if (ex.response && ex.response.status === 400) {
                Toast.show(ex.response.data, {
                  position: Toast.position.CENTER,
                  imgSource: require('../assets/images/error.png'),
                  imgStyle: {
                    resizeMode: 'contain',
                    height: 40,
                    width: 85,
                    marginVertical: 10,
                  },
                  textStyle: { fontFamily: 'Montserrat-Bold' },
                  containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' },
                });
              } else if (ex.response) {
                setTimeout(async () => {
                  await this.setState({
                    loader: false,
                    bingobtndisable: false,
                  });
                }, 2000);
              }
            }
          } else {
            await this.setState({ loader: false });
            await this.setState({ bingobtndisable: false });
          }
        }
      } else {
        await this.setState({ loader: false });
        await this.setState({ bingobtndisable: false });
      }
    }
  };
  render() {
    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate='fast'
          horizontal
          snapToInterval={wp(100)}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {this.props.gamedata && this.props.gamedata.gencard.length > 0
              ? this.props.gamedata.gencard.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: 'center',
                        width: wp(100),
                        alignItems: 'center',
                      }}
                    >
                      <View>
                        <ImageBackground
                          style={styles.bingoimageContainer}
                          source={images.bingocardContainer}
                          resizeMode='contain'
                        >
                          <LinearGradient
                            colors={['#273690', '#141B48']}
                            style={styles.bingoHeader}
                          >
                            <Text
                              style={{
                                fontFamily: font.Regular,
                                fontSize: hp(2.5),
                                color: 'white',
                              }}
                            >
                              C
                            </Text>
                            <Text
                              style={{
                                fontFamily: font.Regular,
                                fontSize: hp(2.5),
                                color: 'white',
                              }}
                            >
                              A
                            </Text>
                            <Text
                              style={{
                                fontFamily: font.Regular,
                                fontSize: hp(2.5),
                                color: 'white',
                              }}
                            >
                              R
                            </Text>
                            <Text
                              style={{
                                fontFamily: font.Regular,
                                fontSize: hp(2.5),
                                color: 'white',
                              }}
                            >
                              D
                            </Text>
                            <Text
                              style={{
                                fontFamily: font.Bold,
                                fontSize: hp(2.5),
                                color: 'white',
                                marginTop: 15,
                              }}
                            >
                              {this.state.card[index]}
                            </Text>
                          </LinearGradient>
                          <View style={[styles.whiteContainer]}>
                            <View>
                              <View
                                style={[
                                  styles.box,
                                  { backgroundColor: '#E7524F' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.boldWhiteText,
                                    { fontSize: hp(2.8) },
                                  ]}
                                >
                                  B
                                </Text>
                              </View>

                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].b[0],
                                    11,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                                // style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(11)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        // color: match ? 'white' : color,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(11)
                                            ? 'white'
                                            : '#E7524F',
                                      },
                                    ]}
                                  >
                                    {item.card[0].b[0]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].b[1],
                                    21,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(21)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        // color: match ? 'white' : color,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(21)
                                            ? 'white'
                                            : '#E7524F',
                                      },
                                    ]}
                                  >
                                    {item.card[0].b[1]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].b[2],
                                    31,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(31)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        // color: match ? 'white' : color,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(31)
                                            ? 'white'
                                            : '#E7524F',
                                      },
                                    ]}
                                  >
                                    {item.card[0].b[2]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].b[3],
                                    41,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(41)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        // color: match ? 'white' : color,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(41)
                                            ? 'white'
                                            : '#E7524F',
                                      },
                                    ]}
                                  >
                                    {item.card[0].b[3]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].b[4],
                                    51,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(51)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        // color: match ? 'white' : color,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(51)
                                            ? 'white'
                                            : '#E7524F',
                                      },
                                    ]}
                                  >
                                    {item.card[0].b[4]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View>
                              <View
                                style={[
                                  styles.box,
                                  { backgroundColor: '#1A7EC2' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.boldWhiteText,
                                    { fontSize: hp(2.8) },
                                  ]}
                                >
                                  I
                                </Text>
                              </View>

                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].i[0],
                                    12,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(12)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(12)
                                            ? // &&
                                              // this.state.usernums.includes(
                                              // 	item.card[0].i[0]
                                              // )
                                              'white'
                                            : '#1A7EC2',
                                      },
                                    ]}
                                  >
                                    {item.card[0].i[0]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].i[1],
                                    22,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(22)
                                          ? // &&
                                            // this.state.usernums.includes(
                                            // 	item.card[0].i[1]
                                            // )
                                            '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(22)
                                            ? //  &&
                                              // this.state.usernums.includes(
                                              // 	item.card[0].i[1]
                                              // )
                                              'white'
                                            : '#1A7EC2',
                                      },
                                    ]}
                                  >
                                    {item.card[0].i[1]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].i[2],
                                    32,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(32)
                                          ? // &&
                                            // this.state.usernums.includes(
                                            // 	item.card[0].i[2]
                                            // )
                                            '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(32)
                                            ? // &&
                                              // this.state.usernums.includes(
                                              // 	item.card[0].i[2]
                                              // )
                                              'white'
                                            : '#1A7EC2',
                                      },
                                    ]}
                                  >
                                    {item.card[0].i[2]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].i[3],
                                    42,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(42)
                                          ? // &&
                                            // this.state.usernums.includes(
                                            // 	item.card[0].i[3]
                                            // )
                                            '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(42)
                                            ? // &&
                                              // this.state.usernums.includes(
                                              // 	item.card[0].i[3]
                                              // )
                                              'white'
                                            : '#1A7EC2',
                                      },
                                    ]}
                                  >
                                    {item.card[0].i[3]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].i[4],
                                    52,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(52)
                                          ? // &&
                                            // this.state.usernums.includes(
                                            // 	item.card[0].i[4]
                                            // )
                                            '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(52)
                                            ? //  &&
                                              // this.state.usernums.includes(
                                              // 	item.card[0].i[4]
                                              // )
                                              'white'
                                            : '#1A7EC2',
                                      },
                                    ]}
                                  >
                                    {item.card[0].i[4]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View>
                              <View
                                style={[
                                  styles.box,
                                  { backgroundColor: '#CEA638' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.boldWhiteText,
                                    { fontSize: hp(2.8) },
                                  ]}
                                >
                                  N
                                </Text>
                              </View>

                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].n[0],
                                    13,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(13)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(13)
                                            ? 'white'
                                            : '#CEA638',
                                      },
                                    ]}
                                  >
                                    {item.card[0].n[0]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].n[1],
                                    23,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(23)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(23)
                                            ? 'white'
                                            : '#CEA638',
                                      },
                                    ]}
                                  >
                                    {item.card[0].n[1]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                // onPress={() => this.sendnum(item.card[0].n[2], 33, item.cardid)}
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    { backgroundColor: '#CEA638' },
                                    // { backgroundColor: this.state.usernums.includes(item.card[0].n[2]) ? '#3B99D4' : 'white' }
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 20,
                                        // color: this.state.usernums.includes(item.card[0].n[2]) ? 'white' : 'black'
                                      },
                                    ]}
                                  >
                                    <View
                                      style={[
                                        styles.circle,
                                        { backgroundColor: '#CEA638' },
                                      ]}
                                    >
                                      <Image
                                        style={{ height: 20 }}
                                        resizeMode='contain'
                                        source={images.star}
                                      />
                                    </View>
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].n[2],
                                    43,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(43)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(43)
                                            ? 'white'
                                            : '#CEA638',
                                      },
                                    ]}
                                  >
                                    {item.card[0].n[2]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].n[3],
                                    53,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(53)
                                          ? '#313630'
                                          : 'white',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(53)
                                            ? 'white'
                                            : '#CEA638',
                                      },
                                    ]}
                                  >
                                    {item.card[0].n[3]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View>
                              <View
                                style={[
                                  styles.box,
                                  { backgroundColor: '#AB0F96' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.boldWhiteText,
                                    { fontSize: hp(2.8) },
                                  ]}
                                >
                                  G
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].g[0],
                                    14,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(14)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(14)
                                            ? 'white'
                                            : '#AB0F96',
                                      },
                                    ]}
                                  >
                                    {item.card[0].g[0]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].g[1],
                                    24,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(24)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(24)
                                            ? 'white'
                                            : '#AB0F96',
                                      },
                                    ]}
                                  >
                                    {item.card[0].g[1]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].g[2],
                                    34,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(34)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(34)
                                            ? 'white'
                                            : '#AB0F96',
                                      },
                                    ]}
                                  >
                                    {item.card[0].g[2]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].g[3],
                                    44,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(44)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(44)
                                            ? 'white'
                                            : '#AB0F96',
                                      },
                                    ]}
                                  >
                                    {item.card[0].g[3]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].g[4],
                                    54,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(54)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(54)
                                            ? 'white'
                                            : '#AB0F96',
                                      },
                                    ]}
                                  >
                                    {item.card[0].g[4]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View>
                              <View
                                style={[
                                  styles.box,
                                  { backgroundColor: '#479144' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.boldWhiteText,
                                    { fontSize: hp(2.8) },
                                  ]}
                                >
                                  O
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].o[0],
                                    15,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(15)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(15)
                                            ? 'white'
                                            : '#479144',
                                      },
                                    ]}
                                  >
                                    {item.card[0].o[0]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].o[1],
                                    25,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(25)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(25)
                                            ? 'white'
                                            : '#479144',
                                      },
                                    ]}
                                  >
                                    {item.card[0].o[1]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].o[2],
                                    35,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(35)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(35)
                                            ? 'white'
                                            : '#479144',
                                      },
                                    ]}
                                  >
                                    {item.card[0].o[2]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].o[3],
                                    45,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(45)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(45)
                                            ? 'white'
                                            : '#479144',
                                      },
                                    ]}
                                  >
                                    {item.card[0].o[3]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.sendnum(
                                    item.card[0].o[4],
                                    55,
                                    item.cardid
                                  )
                                }
                                style={styles.lightYellowContainer}
                              >
                                <View
                                  style={[
                                    styles.circle,
                                    {
                                      backgroundColor:
                                        this.state[item.cardid] &&
                                        this.state[item.cardid].includes(55)
                                          ? '#313630'
                                          : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.boldText,
                                      {
                                        fontSize: 18,
                                        color:
                                          this.state[item.cardid] &&
                                          this.state[item.cardid].includes(55)
                                            ? 'white'
                                            : '#479144',
                                      },
                                    ]}
                                  >
                                    {item.card[0].o[4]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ImageBackground>
                        {!this.state.bingobtndisable ? (
                          <TouchableOpacity
                            disabled={this.state.bingobtndisable}
                            style={{ alignSelf: 'center', marginTop: -hp(5) }}
                            onPress={() =>
                              this.sendbingo(item, this.props.gamedata.pattern)
                            }
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
                                    fontFamily: font.ExtraBold,
                                    fontSize: 15,
                                    color: 'white',
                                  }}
                                >
                                  BINGO!
                                </Text>
                              </LinearGradient>
                            </LinearGradient>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default BingoCards;
const styles = StyleSheet.create({
  letterContainer: {
    width: 30,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ballRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: 'black',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 5,
  },

  ballStyle: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  boldWhiteText: {
    fontFamily: font.Bold,
    color: 'white',
  },

  boldText: {
    fontFamily: font.Bold,
    fontSize: 22,
  },

  bingoHeader: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: hp(1.5),
    justifyContent: 'center',
  },

  whiteContainer: {
    flex: 1,
    marginVertical: hp(1),
    paddingTop: hp(1),
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  bingoimageContainer: {
    flexDirection: 'row',
    height: hp(45),
    width: 'auto',
    aspectRatio: 598 / 541,
    paddingVertical: hp(1),
    paddingHorizontal: hp(1),
    paddingRight: hp(2),
    overflow: 'visible',
  },

  box: {
    backgroundColor: '#353535',
    height: hp(5),
    width: hp(5),
    borderRadius: 10,
    marginVertical: hp(0.5),
    marginHorizontal: hp(1.5),
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
    height: hp(5),
    width: hp(5),
    borderRadius: 10,
    marginVertical: hp(0.5),
    marginHorizontal: hp(1.5),
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
    width: hp('20'),
    height: hp('6.5'),
    borderRadius: 10,
  },

  modalTransparentBackground: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.87)',
  },

  indicatorCircle: {
    position: 'absolute',
    height: 50,
    width: 50,
  },

  lottie: {
    height: undefined,
    width: undefined,
  },

  transparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
});
