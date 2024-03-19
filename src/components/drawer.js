import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  // Modal
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Modal from 'react-native-modal';
import NumberFormat from 'react-number-format';
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-tiny-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, Icon, Image, Badge } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { color, font, images, fonts } from '../assets/config/config';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import auth from '../services/authService';

const blue = '#003299';
const red = '#A70000';

class Sidebar extends Component {
  state = {
    balance: 10000,
    reflink: '',
    // showModal: false,
  };
  componentDidMount() { }

  buildLink = async () => {
    if (this.props.auth && this.props.auth.userid) {
      var getlink = await AsyncStorage.getItem('Reflink');

      if (!getlink) {
        const link = await dynamicLinks().buildShortLink({
          link: `https://armadatech.xyz/ref?ref=${this.props.auth.userid}`,
          domainUriPrefix: 'https://armadatech.xyz/ref',

          android: {
            packageName: 'xyz.armadatech',
            fallbackUrl: 'https://armadatech.xyz/',
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
  };
  toggleModal = async () => {
    this.buildLink();
    await this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  contactusModal = async () => {
    this.setState({ isContModalVisible: !this.state.isContModalVisible });
  };
  // contactusModal = async () => {
  //   await this.setState({ showModal: !this.state.showModal });
  // };
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
      subject: 'Armada Games',
      message:
        'Install this wonderful App and Enjoy this online version of the beloved board game with family and friends',
      url: copylink,
    };
    Share.open(options)
      .then((res) => { })
      .catch((err) => {
        err && console.log('Share failed: ', err);
      });
  };
  render() {
    const copylink = this.state.reflink;

    const balance = this.props.balance;
    return (
      <SafeAreaView style={styles.body}>
        {/* <View style={styles.halfcir} /> */}

        {/* <Image
          style={{ height: 120, marginTop: 50 }}
          resizeMode='contain'
          source={images.bingosp}
        ></Image> */}
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'center' }}>
            <Image style={{ height: undefined, width: '85%', marginTop: hp(4.5), aspectRatio: 520 / 388 }}
              resizeMode="contain"
              source={require('../assets/images/drawerLogo.png')} />
          </View>

          <View style={{ flex: 1, paddingHorizontal: 30 }}>


            <Text style={[styles.txt, { color: 'red', fontFamily: font.Bold, fontSize: 20, marginTop: 10 }]}>  {this.props.auth.name}</Text>
            <Text style={[styles.txt, { color: 'red', marginTop: 5, fontSize: 18 }]}> +{this.props.auth.phone}</Text>

            <View
              style={[
                styles.drawerMenu,
                { justifyContent: 'space-between', marginVertical: 20 },
              ]}
            >
              <Text style={[styles.txt, { color: 'red' }]}>GEMS :</Text>
              {balance ? (
                <NumberFormat
                  value={balance ? balance : 0.0}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text style={[styles.txt, { fontFamily: font.Bold, fontSize: 20 }]}>
                      {value}{' '}
                    </Text>
                  )}
                />
              ) : (
                  <Text style={[styles.txt, { fontFamily: font.Bold, fontSize: 20 }]}>0.00 </Text>
                )}
            </View>
            <View style={styles.drawerMenuContainer}>
              {/* {this.menu.map((item) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.drawerMenu}
                  onPress={() => this.props.navigation.navigate(item.navigate)}
                >
                 
                  <Text style={styles.txt}>{item.title}</Text>
                  {item.requestNo ? (
                    <Text style={[styles.txt, { color: '#C72026' }]}>
                      {'\t'}
                      {'\t'}
                      {item.requestNo}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            ))} */}
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() =>
                  Actions.qrcode({
                    username: this.props.auth.name,
                    userid: this.props.auth.userid,
                    title: this.props.auth.region,
                    phone: this.props.auth.phone,
                  })
                }
              >
                <Text style={styles.txt}>My QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() => Actions.prepaidloadcard()}
              >
                <Text style={styles.txt}>Load Gems</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() => Actions.qrscanning()}
              >
                <Text style={styles.txt}>Send Gems To Royal Treasury</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() => this.toggleModal()}
              >
                <Text style={styles.txt}>Recruit a friend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() => Actions.history()}
              >
                <Text style={styles.txt}>History</Text>
              </TouchableOpacity>
              <View style={{ marginVertical: hp(1.5) }}>
                <TouchableOpacity
                  onPress={() => this.contactusModal()}>
                  <Text style={styles.txt}>Contact Us</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity
              style={styles.drawerMenu}
              onPress={() => Actions.contactus()}
            >
              <Text style={styles.txt}>Contact Us</Text>
            </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.drawerMenu}
                onPress={() => auth.logout()}
              >
                <Text style={styles.txt}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              bottom: 0,
              // flexDirection: 'row',
              // justifyContent: 'space-between',
              padding: 20,
            }}
          >
            {/* <View style={{ bottom: 20 }}>
            <Text style={[styles.txt, { bottom: 10 }]}>ARMADA SUPPORT : </Text>
            <Text style={[styles.txt, { marginLeft: 40, bottom: 10 }]}>
              +63 960 6902700
            </Text>
            <Text style={[styles.txt, { marginLeft: 40, bottom: 10 }]}>
              +63 966 3150509
            </Text>
            <Text style={[styles.txt, { marginLeft: 40, bottom: 10 }]}>
              +63 966 3150909
            </Text>
          </View> */}
            <View>
              <Text> </Text>
              <TouchableOpacity>
                <Text style={[styles.txt, { textDecorationLine: 'underline' }]}>
                  Privacy Policy
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>

          <Modal
					transparent={true}
            // onBackdropPress={() => this.toggleModal()}
            isVisible={this.state.isModalVisible}
          >
            <View style={styles.modalTransparentBackground}>
              <View style={styles.recruitfriendContainer}>
                {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  bottom: 10,
                }}
              > */}
                <Text style={[styles.txt, { alignSelf: 'center', textAlign: 'center' }]}>
                  Invite Family && Friends to {'\n'} Get Free Gems
                </Text>
                <Image
                  source={require('../assets/images/refermin.png')}
                  style={{ height: 150, width: undefined, aspectRatio: 400 / 262, marginTop: 20 }}
                  resizeMode='contain'
                />
                {/* </View> */}

                <Text style={[styles.txt, { alignSelf: 'center', color: 'rgba(42, 42, 42, 0.48)', marginTop: 20 }]}>
                  Copy link or share below:
              </Text>
                <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
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
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 5,
                  }}
                  onPress={() => this.onshare(copylink)}
                >
                  <Icon
                    name='sharealt'
                    type='antdesign'
                    size={25}
                    color='white'
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor: '#01CAF7',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100
                    }}
                  />
                  <Text style={[styles.txt, { marginLeft: 5, fontSize: 20 }]}>
                    Share
                </Text>
                </TouchableOpacity>

                <View style={{
                  marginTop: 15,
                alignItems: 'center',
              }}>
                <TouchableOpacity
                  onPress={() => this.toggleModal()}>
                  <LinearGradient
                    colors={['#D39D2A', '#FFEA8F', '#FFEA8F', '#D39129', '#FFEA8F', '#D39D2A']}
                    style={[styles.button, { padding: 5 }]}>

                    <LinearGradient
                      colors={['#D40000', '#570000']}
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>

                      <Text style={{ fontFamily: font.ExtraBold, fontSize: 15, color: 'white' }}>BACK</Text>
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              </View>
              {/* <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                bottom: 10,
                right: 0,
                left: 0,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#00c7fe',
                  color: 'white',
                  padding: 5,
                  width: 120,
                  alignItems: 'center',
                }}
                onPress={() => this.toggleModal()}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Montserrat-Bold',
                  }}
                >
                  BACK
                </Text>
              </TouchableOpacity>
            </View> */}


            </View>
          </Modal>

          <Modal
            style={{
              // backgroundColor: '#F1D8B9',
              // marginVertical: hp('19%'),
              // borderRadius: 10,
            }}
            // onBackdropPress={() => this.toggleModal()}
            isVisible={this.state.isContModalVisible}
          >
            <View style={styles.modalTransparentBackground}>
              <ImageBackground
                source={require('../assets/images//brownPaper.png')}

                style={{ width: wp(100), height: undefined, aspectRatio: 375 / 345, justifyContent: 'center', alignItems: 'center' }}>

                <Text style={[styles.txt, { fontSize: 30 }]}>ARMADA SUPPORT</Text>
                <Text style={[styles.txt, { marginTop: 20, fontSize: 20 }]}>
                  +63 960 6902700{'\n'}
                 +63 966 3150509{'\n'}
                 +63 966 3150909{'\n'}
                </Text>

                <View style={{ alignSelf: 'center', marginTop: '5%' }}>
                  <TouchableOpacity
                    onPress={() => this.contactusModal()}>
                    <LinearGradient
                      colors={['#D39D2A', '#FFEA8F', '#FFEA8F', '#D39129', '#FFEA8F', '#D39D2A']}
                      style={[styles.button, { padding: 5 }]}>

                      <LinearGradient
                        colors={['#D40000', '#570000']}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>

                        <Text style={{ fontFamily: font.ExtraBold, fontSize: 15, color: 'white' }}>BACK</Text>
                      </LinearGradient>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>


              </ImageBackground>
            </View>
          </Modal>


        </View>
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

export default connect(mapStateToProps)(Sidebar);
const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F1D8B9',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  halfcir: {
    position: 'absolute',
    top: -230,
    left: -9,
    height: 350,
    width: 350,
    borderRadius: 350 / 2,
    backgroundColor: 'white',
  },
  txt: {
    fontFamily: font.Bold,
    fontSize: 14,
    color: color.black,
  },
  drawerMenuContainer: {
    marginVertical: 10,
  },
  drawerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  drawerIcon: {
    height: 40,
    width: 40,
  },
  img: {
    width: 150,
    height: 220,
    resizeMode: 'contain',
  },
  info: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  infotop: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  infotxt: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: 140,
    height: 50,
    borderRadius: 10,
  },
  modalTransparentBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    // backgroundColor: 'rgba(0,0,0,0.87)',
  },
  recruitfriendContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#F1D8B9',
    width: '100%',
    paddingVertical: 30,
    borderRadius: 10
  },
});
