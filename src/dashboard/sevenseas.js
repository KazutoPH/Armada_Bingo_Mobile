import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { color, font, images, style } from '../assets/config/config';

export default class TheSevenSeas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seas: [
        {
          name: 'Cresent Isle',
          horizontalImage: require('../assets/images/7seas/shipwreckIsland.png'),
          coverImage: '../assets/images/7seas/shipwreckIslandbg.jpg',
        },
        {
          name: 'Salty Sands',
          horizontalImage: require('../assets/images/7seas/dayIsland.png'),
          coverImage: '../assets/images/7seas/dayIslandbg.jpg',
        },
        {
          name: `Flame's End`,
          horizontalImage: require('../assets/images/7seas/sunsetSeas.png'),
          coverImage: '../assets/images/7seas/sunsetSeasbg.jpg',
        },
        {
          name: `Devil's Ridge`,
          horizontalImage: require('../assets/images/7seas/rockyRainingIsland.png'),
          coverImage: '../assets/images/7seas/rockyRainingIslandbg.jpg',
        },
        {
          name: `Kraken's Fall`,
          horizontalImage: require('../assets/images/7seas/ocean.png'),
          coverImage: '../assets/images/7seas/oceanbg.jpg',
        },
        {
          name: 'Ashen Reaches',
          horizontalImage: require('../assets/images/7seas/foggyseas.png'),
          coverImage: '../assets/images/7seas/foggyseasbg.jpg',
        },
        {
          name: 'Multineer Rock',
          horizontalImage: require('../assets/images/7seas/nightIsland.png'),
          coverImage: '../assets/images/7seas/nightIslandbg.jpg',
        },
      ]
    };
  }
  sendpage = async (index) => {
    await AsyncStorage.setItem('backgroundimage', JSON.stringify(index));
    Actions.buyticket();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          style={{ width: wp('100%'), height: hp('30%') }}
          resizeMode='cover'
          source={images.headBG}
        />

        <ImageBackground
          style={{ flex: 1 }}
          resizeMode="cover"
          source={images.bodyBG}>

          <ImageBackground style={styles.ribbonStyle}
            source={images.ribbonBG}
            resizeMode='cover'>
            <Image
              style={{ position: 'absolute', left: 10, height: 100 }}
              source={images.pirateShip}
              resizeMode='contain'
            />

            <Text style={{ fontFamily: font.Bold, fontSize: 29, color: '#2A2A2A', marginTop: 20 }}>THE 7 SEAS</Text>

            <Image
              style={{ position: 'absolute', right: 10, height: 100, transform: [{ scaleX: -1 },] }}
              source={images.pirateShip}
              resizeMode='contain'
            />
          </ImageBackground>

          <ScrollView
          style={{ alignSelf: 'center' }}
          showsVerticalScrollIndicator={false}
          >
            {this.state.seas.map((item, index) => 
              <View style={{ marginVertical: 15 }} key={index}>
                <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 10 }}
                  onPress={() => this.sendpage(index)}>
                  <ImageBackground
                    style={styles.imageStyle}
                    source={item.horizontalImage}
                    resizeMode='contain'>
                    <Text style={styles.islandNameStyle}>{item.name}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

        </ImageBackground>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
	ribbonStyle: {
		height: 90,
		backgroundColor: 'transparent',
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},

	imageStyle: {
		aspectRatio: 622 / 162,
		width: wp(90),
		height: undefined,
	},

	islandNameStyle: {
		marginTop: 5,
		marginLeft: 10,
		fontFamily: font.bold,
		fontSize: 18,
		color: 'white',
		textShadowColor: 'black',
		textShadowRadius: 1,
		textShadowOffset: { 
			width: 1,
			height: 1
		}
	}
});


              // <View style={{ marginVertical: 15 }}>
              //   <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 10 }}
              //     onPress={() => this.sendpage(item.coverImage, index )}>
              //     <ImageBackground
              //       style={styles.imageStyle}
              //       source={item.horizontalImage}
              //       resizeMode='contain'>
              //       <Text style={styles.islandNameStyle}>{item.name}</Text>
              //     </ImageBackground>
              //   </TouchableOpacity>
              // </View>
