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
import LinearGradient from 'react-native-linear-gradient';
import { Bingo, font, images, style, color } from '../../assets/config/config';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import { ScrollView } from 'react-native-gesture-handler';

import QRCode from 'react-native-qrcode-svg';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ArmadaHeader } from '../../components/armadaheader';

export default class QRcode extends Component {
  saveQRCode = () => {
    this.refs.viewShot.capture().then((uri) => {
      var shareImageBase64 = {
        type: 'image/jpg',
        title: 'Bingo',
        message: 'Bingo QR-Code',
        url: uri,
        subject: 'Share Link',
      };
      if (uri.length > 10) {
        Share.open(shareImageBase64);
      }
    });
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'stretch' }}>
        <ArmadaHeader />
        {/* <ArmadaHeader/> */}
        <ImageBackground
          style={{ flex: 1, }}
          resizeMode="cover"
          source={images.bodyBG}>

          <View>
            <ImageBackground
              style={{ width: '100%', height: undefined, justifyContent: 'center', alignItems: 'center', marginVertical: 20, paddingVertical: 35 }}
              source={require('../../assets/images/loginBG.png')}
              resizeMode='cover'>

            <View>
            <Text style={{ fontFamily: font.Bold, fontSize: 20, color: '#C72026', alignSelf: 'center', marginTop: 10 }}>MY QR Code</Text>
            
              <View style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'white', padding: 10 }}>
                <QRCode
                  color="black"
                  size={wp('50')}
                  // value={}
                  linearGradient={['rgb(0,21,99)', 'rgb(0,255,255)']}
                  // logo={logo}
                  logoSize={65}
                  logoBorderRadius={30}
                  logoMargin={5}
                  logoBackgroundColor="white"
                  ecl="M"
                />
              </View>

              <View style={{ backgroundColor: '#F0C094', borderRadius: 5, paddingVertical: 10, marginTop: 20 }}>
                <Text style={{ fontFamily: font.Bold, fontSize: 15, color: '#C72026', alignSelf: 'center', textAlign: 'center' }}>
                  {this.props.username}{'\n'}{this.props.phone}{'\n'}{this.props.userid}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={{ alignSelf: 'center', marginTop: 20 }}
            onPress={this.saveQRCode}>
									<LinearGradient
										colors={['#D39D2A', '#FFEA8F', '#FFEA8F', '#D39129', '#FFEA8F', '#D39D2A']}
										style={[styles.button, { padding: 5 }]}>

										<LinearGradient
											colors={['#D40000', '#570000']}
											style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>

											<Text style={{ fontFamily: font.ExtraBold, fontSize: 15, color: 'white' }}>SHARE</Text>
										</LinearGradient>
									</LinearGradient>
									</TouchableOpacity>

            </ImageBackground>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
  },
});
