import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  AppState,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-tiny-toast';
import { BarIndicator } from 'react-native-indicators';
import NumberFormat from 'react-number-format';
import gameService from '../services/gameService';
import Moment from 'react-moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { color, font, images, navigate, style } from '../assets/config/config';
import { Button, Divider, Slider, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import DashboardHeader from '../components/dashboardheader';
import get_games from '../redux/actions/gamesAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
const IColumn = require('../assets/images/bimages/IColumn.png');
const Cross = require('../assets/images/bimages/Cross.png');
const ThreeRowsShaded = require('../assets/images/bimages/ThreeRowsShaded.png');
const BlackOut = require('../assets/images/bimages/BlackOut.png');
const LeftDiagonal = require('../assets/images/bimages/LeftDiagonal.png');
const imgarray = [IColumn, Cross, ThreeRowsShaded, BlackOut, LeftDiagonal];
var intervalId;
class BuyTicket extends Component {
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
    bingoCards: [],
    ticket: 1,
    fin: 1,
    price:
      this.props.games.length > 0
        ? this.props.games[0].status === 'pending'
          ? this.props.games[0].ticketprice
          : this.props.games[1].ticketprice
        : 0.0,
    displayGameModes: true,
    bcid: '',
    genid: '',
    bimg: '',
    bnumbet: 0,
    tickmark: false,
    defimg: '',
    pattern: '',
    loader: false,
    tpamount: '',
    ttbought: '',
    bploader: false,
    housecomm: '',
    tprice: '',
    ploader: false,
    sesstime: null,
    timer: false,
    tloader: false,
    appstatestatus: true,
    isBlinking: true,
    bsimg: '',
    selindex: 0,
    showText: false,
    btndis: false,
    canbtndis: false,
    imbtndis: false,
  };
  async componentDidMount() {
    await this.setState({ tloader: true });

    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    const bg = await AsyncStorage.getItem('backgroundimage');

    await this.setState({ bsimg: this.state.seas[bg] });

    setTimeout(async () => {
      if (this.props.games.length > 0) {
        await this.setState({ tloader: false });
        await this.setState({
          defimg:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].pattern
              : this.props.games[1].pattern,
          pattern:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].pattern
              : this.props.games[1].pattern,
          tpamount:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].totalamount
              : this.props.games[1].totalamount,
          ttbought:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].totaltick
              : this.props.games[1].totaltick,
          housecomm:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].housecommission
              : this.props.games[1].housecommission,
          tprice:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].ticketprice
              : this.props.games[1].ticketprice,
          bnumbet:
            this.props.games[0].status === 'pending'
              ? this.props.games[0].gencard
              : this.props.games[1].gencard,
        });
      } else {
        await this.setState({
          defimg: null,
          pattern: null,
        });
        await this.setState({ tloader: false });
      }
    }, 2000);
  }
  componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }
  handleAppStateChange(currentAppState) {
    if (currentAppState != 'active') {
    } else {
      setTimeout(async () => {
        if (this.state.appstatestatus) {
          await this.setState({ appstatestatus: false });

          get_games();

          setTimeout(async () => {
            await this.setState({ appstatestatus: true });
          }, 3000);
        }
      }, 1000);
    }
  }
  onFinish = (value) => {
    let price = value * this.state.tprice;

    this.setState({ fin: value, price: price });
  };
  getimgsr = (data) => {
    if (data === 'ThreeRowsShaded') {
      var imgsr = require('../assets/images/bimages/ThreeRowsShaded.png');
    } else if (data === 'IColumn') {
      var imgsr = require('../assets/images/bimages/IColumn.png');
    } else if (data === 'BlackOut') {
      var imgsr = require('../assets/images/bimages/BlackOut.png');
    } else if (data === 'LeftDiagonal') {
      var imgsr = require('../assets/images/bimages/LeftDiagonal.png');
    } else if (data === 'Cross') {
      var imgsr = require('../assets/images/bimages/Cross.png');
    }
    return imgsr;
  };
  getimage = (data) => {
    var imgsrr = this.getimgsr(data.pattern);
    return (
      <ImageBackground
        style={{
          height: 80,
          width: undefined,
          aspectRatio: 107/119,
          // alignItems: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode='contain'
        source={imgsrr}
      >
        <View
          style={{
            alignSelf: 'flex-end',
            top: data.status === 'resume' ? -42 : -48,
          }}
        >
          <View
            style={{
              position: this.state.bcid === data.gameid ? 'absolute' : 'relative',
              display: this.state.bcid === data.gameid ? 'flex' : 'none',
              alignSelf: 'flex-end',
            }}
          >
            <Image
              source={require('../assets/images/tickcolor.png')}
              style={{
                height: 20,
                width: 20,
                alignSelf: 'flex-end',
              }}
            />
          </View>
        </View>
        {this.state.tickmark === false &&
          this.state.bcid !== data.id &&
          data.gencard !== 0 ? (
          <View
            style={[
              styles.betBadge,
              {
                position: this.state.bcid === data.gameid ? 'absolute' : 'relative',
                alignSelf: 'flex-end',
                top: data.status === 'resume' ? -30 : -30,
              },
            ]}
          >
            <Text style={[styles.boldWhiteText, { fontSize: 10 }]}>
              {data.gencard.length}
            </Text>
          </View>
        ) : null}
        {data.status === 'resume' ? (
          <View style={styles.liveBadge}>
            <Text style={{ fontSize: 12, color: 'white' }}>PLAY</Text>
          </View>
        ) : null}
      </ImageBackground>
    );
  };
  sendpage = async (data, index) => {
    var tpcmo = (data.totalamount * data.housecommission) / 100;
    let comm = data.totalamount - tpcmo;
    let wincomm = data.wincommission > 0 ? data.wincommission : 0;

    let cmm = comm - (comm * wincomm) / 100;

    await this.setState({ bploader: true, imbtndis: true });

    if (data.status === 'resume') {
      var imgsrrr = this.getimgsr(data.pattern);
      const obj = {
        gamedata: data,
        bingoimage: imgsrrr,
        ticket: this.state.ticket,
        pot: cmm,
      };
      setTimeout(() => {
        clearInterval(intervalId);
      }, 1000);
      setTimeout(async () => {
        await this.setState({ bploader: false, imbtndis: false });

        Actions.bingopage({ items: obj });
      }, 2000);
    } else {
      var imgsrrr = this.getimgsr(data.pattern);
      await this.setState({
        bingoCards: data,
        selindex: index,
        ticket: 1,
        bcid: data.gameid,
        genid: data.gameid,
        tickmark: true,
        bimg: imgsrrr,
        bnumbet: data.gencard.length > 0 ? data.gencard.length : data.gencard,
        pattern: data.pattern,
        housecomm: data.housecommission,
        tpamount: data.totalamount,
        ttbought: data.totaltick,
        tprice: data.ticketprice,
        price: data.ticketprice,
        fin: 1,
      });

      await this.setState({ bploader: false, imbtndis: false });
    }
  };
  sendbingo = async () => {
    await this.setState({ loader: true, btndis: false });
    const bid = this.state.bcid
      ? this.state.bcid
      : this.props.games[0].status === 'pending'
        ? this.props.games[0].gameid
        : this.props.games[1].gameid;
    if (this.props.balance < this.state.price) {
      await this.setState({ loader: false, btndis: false });
      Toast.show('Insufficient Funds', {
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
      try {
        const ob = {
          gameid: bid,
          ticket: this.state.ticket.toString(),
        };

        const data = await gameService.buyticket(ob);

        if (data.success) {
          get_games();
          Toast.show(data.success, {
            position: Toast.position.CENTER,
            imgSource: require('../assets/images/success.png'),
            imgStyle: {
              resizeMode: 'contain',
              height: 85,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
            containerStyle: {
              backgroundColor: 'rgba(0, 50, 153, 0.8)',
              width: wp('80%'),
              height: hp('40%'),
              borderRadius: 19,
              opacity: 0.7,
            },
          });
          setTimeout(async () => {
            await this.setState({ loader: false, btndis: false });
            var bgame = this.props.games.filter((obj) => {
              return obj.gameid === bid;
            });

            await this.setState({
              bnumbet: this.state.bnumbet + this.state.ticket,
              tpamount:
                bgame[0].status === 'pending'
                  ? bgame[0].totalamount
                  : bgame[0].totalamount,
              ttbought:
                bgame[0].status === 'pending'
                  ? bgame[0].totaltick
                  : bgame[0].totaltick,
              housecomm:
                bgame[0].status === 'pending'
                  ? bgame[0].housecommission
                  : bgame[0].housecommission,
            });
          }, 3000);
        }
      } catch (ex) {
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

          setTimeout(async () => {
            await this.setState({ loader: false, btndis: false });
            Toast.hide();
          }, 2000);
        } else if (ex.response && ex.response.status === 429) {
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

          setTimeout(async () => {
            await this.setState({ loader: false, btndis: false });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          setTimeout(async () => {
            await this.setState({ loader: false, btndis: false });
          }, 2000);
        }
      }
    }
  };
  canceltick = async () => {
    await this.setState({ canbtndis: true });
    Alert.alert(
      'Are You Sure',
      'You Want to Cancel the Tickets ?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            const bid = this.state.bcid
              ? this.state.bcid
              : this.props.games[0].status === 'pending'
                ? this.props.games[0].gameid
                : this.props.games[1].gameid;
            const obj = {
              gameid: bid,
            };
            const dat = await gameService.canceltickets(obj);
            if (dat.success) {
              this.setState({
                bnumbet: 0,
              });
              setTimeout(async () => {
                this._refresh();
                await this.setState({ canbtndis: false });
              }, 2000);

              setTimeout(() => {
                this.setState({
                  tpamount: this.props.games[this.state.selindex].totalamount,

                  ttbought: this.props.games[this.state.selindex].totaltick,
                });
              }, 5000);
              Toast.show(dat.success, {
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
            }
          },
        },
        {
          text: 'No',
          cancelable: false,
          onPress: async () => {
            await this.setState({ canbtndis: false });
          },
        },
      ],
      { cancelable: false }
    );
  };
  defaultimage = (cmm) => {
    var imgsrrr = this.getimgsr(this.state.defimg);
    let cm = cmm;
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: 110, height: 115 }}
          resizeMode='contain'
          source={imgsrrr}
        />

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: font.Bold,
              color: 'green',
              fontSize: 15,
            }}
          >
            Total Pot Amount :{' '}
          </Text>
          <NumberFormat
            value={cm}
            displayType={'text'}
            thousandSeparator={true}
            thousandsGroupStyle={'thousand'}
            decimalScale={2}
            fixedDecimalScale={true}
            renderText={(value) => (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: font.Bold,
                  color: 'green',
                  fontSize: 15,
                }}
              >
                <Text style={{ fontSize: 18 }}>{value} </Text>
                Gems
              </Text>
            )}
          />
        </View>
      </View>
    );
  };
  _refresh = async () => {
    await this.setState({ refreshing: true });

    get_games();

    setTimeout(async () => {
      if (this.state.bingoCards) {
        const da = this.props.games.filter(async (k) => {
          if (k.gameid === this.state.bingoCards.gameid) {
            if (k.gencard && k.gencard.length > 0) {
              await this.setState({ bnumbet: k.gencard.length });
            } else {
              await this.setState({ bnumbet: k.gencard });
            }
          } else {
            await this.setState({ bnumbet: this.state.bnumbet });
          }
        });
      }

      await this.setState({
        defimg:
          this.props.games[0].status === 'pending'
            ? this.props.games[0].pattern
            : this.props.games[1].pattern,
        pattern:
          this.props.games[0].status === 'pending'
            ? this.props.games[0].pattern
            : this.props.games[1].pattern,
        tpamount: !this.state.bingoCards
          ? this.props.games[0].status === 'pending'
            ? this.props.games[0].totalamount
            : this.props.games[1].totalamount
          : this.state.tpamount,
        ttbought: !this.state.bingoCards
          ? this.props.games[0].status === 'pending'
            ? this.props.games[0].totaltick
            : this.props.games[1].totaltick
          : this.state.ttbought,
        housecomm: !this.state.bingoCards
          ? this.props.games[0].status === 'pending'
            ? this.props.games[0].housecommission
            : this.props.games[1].housecommission
          : this.state.housecomm,
        tprice: !this.state.bingoCards
          ? this.props.games[0].status === 'pending'
            ? this.props.games[0].ticketprice
            : this.props.games[1].ticketprice
          : this.state.tprice,
        bnumbet: !this.state.bingoCards
          ? this.props.games[0].status === 'pending'
            ? this.props.games[0].gencard
            : this.props.games[1].gencard
          : this.state.bnumbet,
      });
      await this.setState({ refreshing: false });
    }, 5000);
  };
  render() {
    var tpcm = (this.state.tpamount * this.state.housecomm) / 100;
    let comm = this.state.tpamount - tpcm;
    let wincomm =
      this.props.games &&
        this.props.games.length &&
        this.props.games[0].wincommission > 0
        ? this.props.games[0].wincommission
        : 0;

    let cmm = comm - (comm * wincomm) / 100;

    return (
      <SafeAreaView style={{ flex: 1, height: hp('100%') }}>
        <TouchableOpacity
          onPress={() => Actions.drawerOpen()}
          style={{ position: 'absolute', top: 45, left: 10, zIndex: 1 }}
        >
          <Icon name='bars' type='font-awesome-5' size={36} color='white' />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{ position: 'absolute', top: 46, right: 6, zIndex: 1 }}
          onPress={() => Actions.notifications()}
        >
          <Icon name='bell' color='white' type='feather' size={36} />
        </TouchableOpacity> */}
        <Spinner
          visible={this.state.bploader}
          overlayColor='rgba(0, 0, 0, 0.40)'
          color='white'
          backgroundColor='#999999'
          size='large'
        />
        <Spinner
          visible={this.state.tloader}
          overlayColor='rgba(0, 0, 0, 0.40)'
          color='white'
          backgroundColor='#999999'
          size='large'
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title='Loading...'
            />
          }
        >
          <Image
            style={{
              width: wp('100%'),
              height: hp('30%'),
              zIndex: -1,
            }}
            resizeMode='cover'
            source={images.headBG}
          />

          <ImageBackground
            style={{ height: undefined }}
            resizeMode="cover"
            source={images.bodyBG}>

            <ImageBackground style={styles.ribbonStyle}
              source={images.ribbonBG}
              resizeMode='cover'>

              <Text style={{ fontFamily: font.Bold, fontSize: 29, color: '#2A2A2A', marginTop: 20 }}>SELECT A GAME</Text>

            </ImageBackground>

            <ImageBackground
              style={{ height: 120, width: undefined, marginTop: -50 }}
              resizeMode="cover"
              source={require('../assets/images/horizontalIsland.png')}>
              <Image
                style={{ position: 'absolute', left: 10, bottom: -5, height: 100 }}
                source={require('../assets/images/pirateShip.png')}
                resizeMode='contain'
              />
            </ImageBackground>
          </ImageBackground>


          <View style={{ backgroundColor: '#FFE7C2' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}>
              {this.props.games.length > 0 &&
                this.props.games.map((data, index) => (
                  <TouchableOpacity
                    style={{ alignItems: 'center', marginHorizontal: 5 }}
                    onPress={() => this.sendpage(data, index, cmm)}
                    key={index}
                    disabled={this.state.imbtndis}
                  >
                    {this.getimage(data)}
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: font.Bold,
                            color: '#313630',
                          }}
                        >
                          <Moment format='MM' element={Text} fromNow>
                            {data.sdate ? data.sdate : data.sdate}
                          </Moment>
                          <Text>-</Text>
                          <Moment format='DD' element={Text} fromNow>
                            {data.sdate ? data.sdate : data.sdate}
                          </Moment>
                          <Text>-</Text>
                          <Moment format='YYYY' element={Text} fromNow>
                            {data.sdate ? data.sdate : data.sdate}
                          </Moment>
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: font.Bold,
                            color: '#313630',
                          }}
                        >
                          <Moment format='hh:mm A' element={Text} fromNow>
                            {data.sdate ? data.sdate : data.sdate}
                          </Moment>
                        </Text>
                      </View>
                    </View>
                    <View></View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          <LinearGradient
            colors={['#D40000', '#570000']}
            style={{
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: font.Bold,
                  fontSize: 18,
                  color: 'white',
                }}
              >
                1 CARD = {this.state.tprice ? this.state.tprice : 0.0} Gems
              </Text>
            </View>
          </LinearGradient>

          <ImageBackground
            style={{ alignItems: 'center', paddingVertical: 20 }}
            source={this.state.bsimg}
            resizeMode='cover'
          >
            <ImageBackground
              style={{ width: 450, aspectRatio: 1, padding: 10 }}
              source={require('../assets/images/loginBG.png')}
              resizeMode='contain'
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {this.state.bimg ? (
                    <View style={{ alignItems: 'center' }}>
                      <ImageBackground
                        style={{
                          width: 110,
                          height: 115,
                          alignItems: 'flex-end',
                        }}
                        resizeMode='contain'
                        source={this.state.bimg}
                      >
                        {this.state.bnumbet !== 0 ? (
                          <View style={styles.betBadge}>
                            <Text
                              style={[styles.boldWhiteText, { fontSize: 10 }]}
                            >
                              {this.state.bnumbet}
                            </Text>
                          </View>
                        ) : null}
                      </ImageBackground>
                      <View
                        style={{ alignItems: 'center', flexDirection: 'row' }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Montserrat-Bold',
                            color: 'green',
                            fontSize: 15,
                          }}
                        >
                          Total Pot Amount :{' '}
                        </Text>
                        <NumberFormat
                          value={cmm}
                          displayType={'text'}
                          thousandSeparator={true}
                          thousandsGroupStyle={'thousand'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          renderText={(value) => (
                            <Text
                              style={{
                                textAlign: 'center',
                                fontFamily: 'Montserrat-ExtraBold',
                                color: 'green',
                                fontSize: 15,
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>{value} </Text>
                              Gems
                            </Text>
                          )}
                        />
                      </View>
                    </View>
                  ) : (
                    this.defaultimage(cmm)
                  )}

                  <TouchableOpacity style={{ position: 'absolute', bottom: 5, top: 50, right: 10 }}
                    onPress={this._refresh.bind(this)}>
                    <LinearGradient
                      colors={['#D40000', '#570000']}
                      style={{ height: 40, width: 40, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                      <Icon
                        name='sync-alt'
                        type='font-awesome-5'
                        size={20}
                        color='white'
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontFamily: font.Bold,
                    fontSize: 21,
                    color: '#C72026',
                  }}
                >
                  x{this.state.ticket}
                </Text>

                <Slider
                  value={this.state.ticket}
                  onValueChange={(value) => this.setState({ ticket: value })}
                  step={1}
                  minimumValue={1}
                  maximumValue={2}
                  maximumTrackTintColor='#E6B38B'
                  minimumTrackTintColor='transparent'
                  onSlidingComplete={this.onFinish}
                  thumbTouchSize={{ width: 50, height: 50 }}
                  trackStyle={{ height: 10, width: 280, backgroundColor: '#E6B38B', borderRadius: 30 }}
                  thumbStyle={{ height: 20, width: 20 }}
                  thumbProps={{
                    children: (
                      <Image
                        style={{ width: 50, left: -15, top: -3 }}
                        resizeMode="contain"
                        source={images.thumb} />
                    )
                  }}
                />
                <View style={{ marginHorizontal: 8 }}>
                  <Text
                    style={{
                      fontFamily: font.Bold,
                      fontSize: 12,
                      marginVertical: 5,
                      flexWrap: 'nowrap',
                    }}
                  >
                    BINGO CARD …………………………………. Gems {this.state.tprice}/pc
                  </Text>

                  <Text
                    style={{
                      fontFamily: font.Bold,
                      fontSize: 12,
                      alignSelf: 'flex-end',
                    }}
                  >
                    x{this.state.fin}
                  </Text>
                  <Divider
                    style={{ backgroundColor: '#353535', marginVertical: 5 }}
                  />
                  <View
                    style={{
                      flexDirection: this.state.bnumbet !== 0 ? 'row' : null,
                      justifyContent: 'space-between',
                    }}
                  >
                    {this.state.bnumbet !== 0 ? (
                      <TouchableOpacity
                        onPress={() => this.canceltick()}
                        style={{
                          width: 90,
                          height: 20,
                          alignSelf: 'flex-start',

                          justifyContent: 'center',
                        }}
                        disabled={this.state.canbtndis}
                      >
                        <Text
                          style={{
                            fontFamily: 'Montserrat-ExtraBold',
                            fontSize: 11,
                            color: '#3940DF',
                          }}
                        >
                          Cancel Tickets
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <View style={{ alignSelf: 'flex-end' }}>
                      <Text
                        style={{
                          fontFamily: font.Bold,
                          fontSize: 14,
                          color: '#C72026',
                          alignSelf: 'flex-end',
                        }}
                      >{`Gems ${this.state.price}`}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  {!this.state.loader ? (
                    <TouchableOpacity
                      disabled={this.state.btndis}
                      onPress={() => this.sendbingo()}
                    >
                      <ImageBackground
                        resizeMode='contain'
                        style={{
                          height: undefined,
                          width: 200,
                          aspectRatio: 234 / 52,
                        }}
                        source={images.loginBtn}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            marginBottom: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: font.ExtraBold,
                              fontSize: 17,
                              color: 'white',
                            }}
                          >
                            BUY
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: wp('20%'),
                        height: 100,
                      }}
                    >
                      <BarIndicator color='#001563' count={6} />
                    </View>
                  )}
                </View>
              </View>
            </ImageBackground>
          </ImageBackground>
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
  };
};

export default connect(mapStateToProps)(BuyTicket);

const styles = StyleSheet.create({
  ribbonStyle: {
    height: 90,
    backgroundColor: 'transparent',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betBadge: {
    backgroundColor: '#3B99D4',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    borderRadius: 30 / 2,
  },
  boldWhiteText: {
    fontFamily: font.Bold,
    color: 'white',
  },
  liveBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#A70000',
    width: 60,
    height: 18,
  },
});
