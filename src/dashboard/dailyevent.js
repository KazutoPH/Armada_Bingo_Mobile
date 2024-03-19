import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  AppState,
} from "react-native";
import { color, font, images, style } from "../assets/config/config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Divider, Slider, Button } from "react-native-elements";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Toast from "react-native-tiny-toast";
import DashboardHeader from "../components/dashboardheader";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import gameService from "../services/gameService";
import get_games from "../redux/actions/gamesAction";
import { BarIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import BlinkView from "react-native-blink-view";
import { Alert } from "react-native";

const IColumn = require("../assets/images/bimages/IColumn.png");
const Cross = require("../assets/images/bimages/Cross.png");
const ThreeRowsShaded = require("../assets/images/bimages/ThreeRowsShaded.png");
const BlackOut = require("../assets/images/bimages/BlackOut.png");
const LeftDiagonal = require("../assets/images/bimages/LeftDiagonal.png");
const imgarray = [IColumn, Cross, ThreeRowsShaded, BlackOut, LeftDiagonal];
var intervalId;
class DailyEvent extends Component {
  state = {
    bingoCards: [],
    ticket: 1,
    fin: 1,
    price:
      this.props.games.length > 0
        ? this.props.games[0].status === "pending"
          ? this.props.games[0].ticketprice
          : this.props.games[1].ticketprice
        : 0.0,
    displayGameModes: true,
    bcid: "",
    genid: "",
    bimg: "",
    bnumbet: 0,
    tickmark: false,
    defimg: "",
    pattern: "",
    loader: false,
    tpamount: "",
    ttbought: "",
    bploader: false,
    housecomm: "",
    tprice: "",
    ploader: false,
    sesstime: null,
    timer: false,
    tloader: false,
    appstatestatus: true,
    isBlinking: true,
  };

  async componentDidMount() {
    await this.setState({ tloader: true });
    AppState.addEventListener("change", this.handleAppStateChange.bind(this));

    // if (intervalId) {
    //   clearInterval(intervalId);
    // }
    // intervalId = setInterval(async () => {
    //   this.cronfunc();
    // }, this.state.intervaltime);
    setTimeout(async () => {
      if (this.props.games.length > 0) {
        await this.setState({ tloader: false });
        await this.setState({
          defimg:
            this.props.games[0].status === "pending"
              ? this.props.games[0].pattern
              : this.props.games[1].pattern,
          pattern:
            this.props.games[0].status === "pending"
              ? this.props.games[0].pattern
              : this.props.games[1].pattern,
          tpamount:
            this.props.games[0].status === "pending"
              ? this.props.games[0].totalamount
              : this.props.games[1].totalamount,
          ttbought:
            this.props.games[0].status === "pending"
              ? this.props.games[0].totaltick
              : this.props.games[1].totaltick,
          housecomm:
            this.props.games[0].status === "pending"
              ? this.props.games[0].housecommission
              : this.props.games[1].housecommission,
          tprice:
            this.props.games[0].status === "pending"
              ? this.props.games[0].ticketprice
              : this.props.games[1].ticketprice,
          bnumbet:
            this.props.games[0].status === "pending"
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
      "change",
      this.handleAppStateChange.bind(this)
    );
  }
  handleAppStateChange(currentAppState) {
    if (currentAppState != "active") {
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
  // cronfunc = async () => {
  //   var o = new Date(this.props.games[0].sdate).getTime();
  //   var c = new Date().getTime();
  //   var diff = (c - o) / 1000;

  //   if (diff > -180 && diff < 120) {

  //     get_games();
  //   }
  // };
  getimgsr = (data) => {
    if (data === "ThreeRowsShaded") {
      var imgsr = require("../assets/images/bimages/ThreeRowsShaded.png");
    } else if (data === "IColumn") {
      var imgsr = require("../assets/images/bimages/IColumn.png");
    } else if (data === "BlackOut") {
      var imgsr = require("../assets/images/bimages/BlackOut.png");
    } else if (data === "LeftDiagonal") {
      var imgsr = require("../assets/images/bimages/LeftDiagonal.png");
    } else if (data === "Cross") {
      var imgsr = require("../assets/images/bimages/Cross.png");
    }
    return imgsr;
  };

  sendbingo = async () => {
    await this.setState({ loader: true });
    const bid = this.state.bcid
      ? this.state.bcid
      : this.props.games[0].status === "pending"
      ? this.props.games[0].gameid
      : this.props.games[1].gameid;
    if (this.props.balance < this.state.price) {
      await this.setState({ loader: false });
      Toast.show("Insufficient Funds", {
        position: Toast.position.CENTER,
        imgSource: require("../assets/images/error.png"),
        imgStyle: {
          resizeMode: "contain",
          height: 40,
          width: 85,
          marginVertical: 10,
        },
        textStyle: { fontFamily: "Montserrat-Bold" },
        containerStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
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
            imgSource: require("../assets/images/success.png"),
            imgStyle: {
              resizeMode: "contain",
              height: 85,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: "Montserrat-Bold", fontSize: 20 },
            containerStyle: {
              backgroundColor: "rgba(0, 50, 153, 0.8)",
              width: wp("80%"),
              height: hp("40%"),
              borderRadius: 19,
              opacity: 0.7,
            },
          });
          setTimeout(async () => {
            await this.setState({ loader: false });
            var bgame = this.props.games.filter((obj) => {
              return obj.gameid === bid;
            });

            await this.setState({
              bnumbet: this.state.bnumbet + this.state.ticket,
              tpamount:
                bgame[0].status === "pending"
                  ? bgame[0].totalamount
                  : bgame[0].totalamount,
              ttbought:
                bgame[0].status === "pending"
                  ? bgame[0].totaltick
                  : bgame[0].totaltick,
              housecomm:
                bgame[0].status === "pending"
                  ? bgame[0].housecommission
                  : bgame[0].housecommission,
            });
          }, 3000);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          Toast.show(ex.response.data, {
            position: Toast.position.CENTER,
            imgSource: require("../assets/images/error.png"),
            imgStyle: {
              resizeMode: "contain",
              height: 40,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: "Montserrat-Bold" },
            containerStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
          });

          setTimeout(async () => {
            await this.setState({ loader: false });
            Toast.hide();
          }, 2000);
        } else if (ex.response && ex.response.status === 429) {
          Toast.show(ex.response.data, {
            position: Toast.position.CENTER,
            imgSource: require("../assets/images/error.png"),
            imgStyle: {
              resizeMode: "contain",
              height: 40,
              width: 85,
              marginVertical: 10,
            },
            textStyle: { fontFamily: "Montserrat-Bold" },
            containerStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
          });

          setTimeout(async () => {
            await this.setState({ loader: false });
            Toast.hide();
          }, 2000);
        } else if (ex.response) {
          setTimeout(async () => {
            await this.setState({ loader: false });
          }, 2000);
        }
      }
    }
  };
  _finishCount = async () => {
    this._refresh();
    //await this.setState({timer: false});
    // this._refresh.bind(this)
  };
  _refresh = async () => {
    await this.setState({ refreshing: true });

    await get_games();

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
          this.props.games[0].status === "pending"
            ? this.props.games[0].pattern
            : this.props.games[1].pattern,
        pattern:
          this.props.games[0].status === "pending"
            ? this.props.games[0].pattern
            : this.props.games[1].pattern,
        tpamount: !this.state.bingoCards
          ? this.props.games[0].status === "pending"
            ? this.props.games[0].totalamount
            : this.props.games[1].totalamount
          : this.state.tpamount,
        ttbought: !this.state.bingoCards
          ? this.props.games[0].status === "pending"
            ? this.props.games[0].totaltick
            : this.props.games[1].totaltick
          : this.state.ttbought,
        housecomm: !this.state.bingoCards
          ? this.props.games[0].status === "pending"
            ? this.props.games[0].housecommission
            : this.props.games[1].housecommission
          : this.state.housecomm,
        tprice: !this.state.bingoCards
          ? this.props.games[0].status === "pending"
            ? this.props.games[0].ticketprice
            : this.props.games[1].ticketprice
          : this.state.tprice,
        bnumbet: !this.state.bingoCards
          ? this.props.games[0].status === "pending"
            ? this.props.games[0].gencard
            : this.props.games[1].gencard
          : this.state.bnumbet,
      });
      await this.setState({ refreshing: false });
    }, 5000);
  };
  onFinish = (value) => {
    let price = value * this.state.tprice;

    this.setState({ fin: value, price: price });
  };
  defaultimage = () => {
    var imgsrrr = this.getimgsr(this.state.defimg);

    return (
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 110, height: 115 }}
          resizeMode="contain"
          source={imgsrrr}
        />

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Montserrat-Bold",
              color: "green",
            }}
          >
            Total Pot Amount :{" "}
            {this.state.tpamount -
              (this.state.tpamount * this.state.housecomm) / 100}{" "}
            Credits
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Montserrat-Bold",
              color: "green",
            }}
          >
            Total Tickets Purchased : {this.state.ttbought}
          </Text>
        </View>
      </View>
    );
  };
  getimage = (data) => {
    var imgsrr = this.getimgsr(data.pattern);
    return (
      <ImageBackground
        style={{
          height: 120,
          width: undefined,
          aspectRatio: 213 / 238,
          alignItems: "flex-end",
        }}
        resizeMode="contain"
        source={imgsrr}
      >
        <View
          style={{
            display: this.state.bcid === data.gameid ? "flex" : "none",
            alignSelf: "flex-end",
          }}
        >
          <Image
            source={require("../assets/images/tickcolor.png")}
            style={{
              height: 20,
              width: 20,
              alignSelf: "flex-end",
            }}
          />
        </View>
        {this.state.tickmark === false &&
        this.state.bcid !== data.id &&
        data.gencard !== 0 ? (
          <View style={styles.betBadge}>
            <Text style={[styles.boldWhiteText, { fontSize: 10 }]}>
              {data.gencard.length}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
    );
  };
  sendpage = async (data) => {
    await this.setState({ bploader: true });

    if (data.status === "resume") {
      var imgsrrr = this.getimgsr(data.pattern);
      const obj = {
        gamedata: data,
        bingoimage: imgsrrr,
        ticket: this.state.ticket,
      };
      setTimeout(() => {
        clearInterval(intervalId);
      }, 1000);
      setTimeout(async () => {
        await this.setState({ bploader: false });

        Actions.bingopage({ items: obj });
      }, 2000);
    } else {
      var imgsrrr = this.getimgsr(data.pattern);
      await this.setState({
        bingoCards: data,
        ticket: 1,
        bcid: data.gameid,
        genid: data.gameid,
        tickmark: true,
        bimg: imgsrrr,
        bnumbet: data.gencard.length > 0 ? data.gencard.length : data.gencard,
        pattern: data.pattern,
        tpamount: data.totalamount,
        ttbought: data.totaltick,
        tprice: data.ticketprice,
        price: data.ticketprice,
        fin: 1,
      });

      await this.setState({ bploader: false });

      // this.getnum(data);
    }
  };
  canceltick = async () => {
    Alert.alert(
      "Are You Sure",
      "You Want to Cancel the Tickets ?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const bid = this.state.bcid
              ? this.state.bcid
              : this.props.games[0].status === "pending"
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
              this._refresh();
              setTimeout(() => {
                this.setState({
                  tpamount:
                    this.props.games[0].status === "pending"
                      ? this.props.games[0].totalamount
                      : this.props.games[1].totalamount,
                  ttbought:
                    this.props.games[0].status === "pending"
                      ? this.props.games[0].totaltick
                      : this.props.games[1].totaltick,
                });
              }, 5000);
              Toast.show(dat.success, {
                position: Toast.position.CENTER,
                imgSource: require("../assets/images/success.png"),
                imgStyle: {
                  resizeMode: "contain",
                  height: 40,
                  width: 85,
                  marginVertical: 10,
                },
                textStyle: { fontFamily: "Montserrat-Bold" },
                containerStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
              });
            }
          },
        },
        {
          text: "No",
          cancelable: false,
        },
      ],
      { cancelable: false }
    );
  };
  render() {
    return (
      <SafeAreaView
        style={{ backgroundColor: "#E9E9E9", flex: 1, height: hp("100%") }}
      >
        <DashboardHeader
          back={false}
          title="RIGEL BINGO"
          onPress={() => Actions.pop()}
        />
        <Spinner
          visible={this.state.bploader}
          overlayColor="rgba(0, 0, 0, 0.40)"
          color="white"
          backgroundColor="#999999"
          size="large"
        />
        <Spinner
          visible={this.state.tloader}
          overlayColor="rgba(0, 0, 0, 0.40)"
          color="white"
          backgroundColor="#999999"
          size="large"
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title="Loading..."
            />
          }
        >
          <View>
            <View style={{ alignItems: "center" }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {this.props.games.length > 0 &&
                  this.props.games.map((data, index) => (
                    <View
                      key={data.gameid}
                      style={{ marginHorizontal: 5, marginVertical: 10 }}
                    >
                      <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={() => this.sendpage(data)}
                      >
                        {this.getimage(data)}
                        <View style={{ flexDirection: "row" }}>
                          <View>
                            <Text
                              style={{
                                fontSize: 10,
                                fontFamily: font.Bold,
                                color: "#001563",
                              }}
                            >
                              <Moment format="DD" element={Text} fromNow>
                                {data.sdate ? data.sdate : data.sdate}
                              </Moment>
                              <Text>-</Text>
                              <Moment format="MMM" element={Text} fromNow>
                                {data.sdate ? data.sdate : data.sdate}
                              </Moment>

                              <Text> </Text>
                              <Moment format="hh:mm A" element={Text} fromNow>
                                {data.sdate ? data.sdate : data.sdate}
                              </Moment>
                            </Text>
                          </View>
                        </View>
                        <View>
                          {data.status === "resume" ? (
                            <Button
                              title="PLAY"
                              titleStyle={{ fontSize: 12, color: "white" }}
                              buttonStyle={styles.liveBadge}
                            />
                          ) : // </View>
                          null}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={{ backgroundColor: "#E9E9E9", alignItems: "center" }}>
              <View
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: color.blue,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NumberFormat
                  value={this.state.tprice ? this.state.tprice : 0.0}
                  displayType={"text"}
                  thousandSeparator={true}
                  thousandsGroupStyle={"thousand"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text
                      style={{
                        fontFamily: font.Bold,
                        fontSize: 15,
                        color: "white",
                      }}
                    >
                      1 CARD = C {value}
                    </Text>
                  )}
                />
              </View>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                {this.state.bimg ? (
                  <View style={{ alignItems: "center" }}>
                    <ImageBackground
                      style={{
                        width: 110,
                        height: 115,
                        alignItems: "flex-end",
                      }}
                      resizeMode="contain"
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
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Montserrat-Bold",
                          color: "green",
                        }}
                      >
                        Total Pot Amount :{" "}
                        {this.state.tpamount -
                          (this.state.tpamount * this.state.housecomm) /
                            100}{" "}
                        Credits
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Montserrat-Bold",
                          color: "green",
                        }}
                      >
                        Total Tickets Purchased : {this.state.ttbought}
                      </Text>
                    </View>
                  </View>
                ) : (
                  this.defaultimage()
                )}

                <Text
                  style={{
                    fontFamily: font.Bold,
                    fontSize: 21,
                    color: "#302CE9",
                  }}
                >
                  x{this.state.ticket}
                </Text>
                <Slider
                  value={this.state.ticket}
                  onValueChange={(value) => this.setState({ ticket: value })}
                  step={1}
                  minimumValue={1}
                  maximumValue={4}
                  minimumTrackTintColor="transparent"
                  onSlidingComplete={this.onFinish}
                  thumbTouchSize={{ width: 50, height: 50 }}
                  trackStyle={{
                    height: 10,
                    width: 280,
                    backgroundColor: "transparent",
                    borderRadius: 30,
                  }}
                  thumbStyle={{ height: 20, width: 20 }}
                  thumbProps={{
                    children: (
                      <Image
                        style={{ width: 50, top: -52, left: -15 }}
                        resizeMode="contain"
                        source={images.thumb}
                      />
                    ),
                  }}
                />
                <View>
                  <NumberFormat
                    value={this.state.tprice}
                    displayType={"text"}
                    thousandSeparator={true}
                    thousandsGroupStyle={"thousand"}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={(value) => (
                      <Text
                        style={{
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: 12,
                          marginVertical: 5,
                        }}
                      >
                        BINGO CARD …………………………………. Credits {value}/pc
                      </Text>
                    )}
                  />

                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: 12,
                      alignSelf: "flex-end",
                    }}
                  >
                    x{this.state.fin}
                  </Text>
                  <Divider
                    style={{ backgroundColor: "#353535", marginVertical: 5 }}
                  />
                  <View
                    style={{
                      flexDirection: this.state.bnumbet !== 0 ? "row" : null,
                      justifyContent: "space-between",
                    }}
                  >
                    {this.state.bnumbet !== 0 ? (
                      <TouchableOpacity
                        onPress={() => this.canceltick()}
                        style={{
                          width: 90,
                          height: 20,

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-ExtraBold",
                            fontSize: 11,
                            color: "#3940DF",
                          }}
                        >
                          Cancel Tickets
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <View style={{ alignSelf: "flex-end" }}>
                      <Text
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          fontSize: 14,
                          color: "#3940DF",
                          alignSelf: "flex-end",
                        }}
                      >{`Credits ${this.state.price}.00`}</Text>
                    </View>
                  </View>
                </View>
                {!this.state.loader ? (
                  <TouchableOpacity
                    style={{ alignItems: "center", marginTop: 20 }}
                    onPress={() => this.sendbingo()}
                  >
                    <ImageBackground
                      style={{
                        width: 280,
                        height: 50,
                        transform: [
                          {
                            scaleX: 1.7,
                          },
                          {
                            scaleY: 1.7,
                          },
                        ],
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                      resizeMode="contain"
                      source={images.playbutton}
                    >
                      <Text
                        style={{
                          fontFamily: font.Bold,
                          fontSize: 14,
                          textAlign: "center",
                          textAlignVertical: "center",
                          color: "white",
                          top: -5,
                        }}
                      >
                        BUY
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: wp("20%"),
                      height: 100,
                    }}
                  >
                    <BarIndicator color="#001563" count={6} />
                  </View>
                )}
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
    auth: state.auth,
    balance: state.balance,
    games: state.games,
    ticketprice: state.ticketprice,
    commission: state.commission,
  };
};

export default connect(mapStateToProps)(DailyEvent);

const styles = StyleSheet.create({
  gameModeContainer: {
    backgroundColor: "white",
  },

  betBadge: {
    backgroundColor: "#3B99D4",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 20,
    borderRadius: 30 / 2,
  },

  liveBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#A70000",
    width: 60,
    height: 18,
  },

  liveTextContainer: {
    backgroundColor: "#A70000",
    paddingHorizontal: 10,
  },

  boldWhiteText: {
    fontFamily: font.Bold,
    color: "white",
  },

  boldText: {
    fontFamily: font.Bold,
    fontSize: 22,
  },

  greyContainer: {
    alignItems: "flex-end",
    backgroundColor: "#5E5D5D",
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
  },

  bingoimageContainer: {
    height: 450,
    width: "auto",
    aspectRatio: 599 / 818,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  blackBox: {
    backgroundColor: "#353535",
    height: 45,
    width: 45,
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 30,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  lightYellowContainer: {
    backgroundColor: "#FFFFE4",
    height: 45,
    width: 45,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30 / 2,
  },

  buttonContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -15,
  },

  button: {
    width: 160,
    height: 60,
    borderRadius: 10,
    borderWidth: 10,
    borderColor: "#B00066",
  },
});
