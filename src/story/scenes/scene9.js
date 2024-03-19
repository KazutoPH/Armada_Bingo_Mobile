import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import { color, font, images, navigate, style } from '../../assets/config/config'
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Scene8 extends Component {

	render() {
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground
					source={require('../../assets/images/story/sunsetbgdarker.png')}
					style={{ height: '100%', width: '100%' }}
					resizeMode='cover'>

					<ImageBackground
						source={require('../../assets/images/story/header.png')}
						style={styles.headerImageStyle}
						resizeMode='stretch'>
						<View style={{ paddingHorizontal: wp(2) }}>
						<Text style={styles.text}>
							The Spanish Armada was a fleet of warships which brought gold bullion from the mines of Peru and Mexico to Spain.
						</Text>
						</View>
					</ImageBackground>

					<View style={{ flex: 1, alignItems: 'center' }}>
						<Image
							source={require('../../assets/images/story/fog.png')}
							style={styles.mapImageStyle}
							resizeMode='contain'
						/>
					</View>


				</ImageBackground>

			</View>
		)
	}
}

const styles = StyleSheet.create({

	headerImageStyle: {
		width: '100%',
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},

	text: {
		fontFamily: font.SemiBold,
		fontSize: 15,
		color: '#2A2A2A',
		textAlign: 'center'
	},

	mapImageStyle: {
		position: 'absolute',
		bottom: hp(15),
		width: '100%',
		height: undefined,
		aspectRatio: 754 / 200,
	}
})