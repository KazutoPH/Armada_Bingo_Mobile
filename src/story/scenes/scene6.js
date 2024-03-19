import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import { color, font, images, navigate, style } from '../../assets/config/config'
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Scene6 extends Component {

	render() {
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground
					source={require('../../assets/images/story/windowbg.png')}
					style={{ height: '100%', width: '100%' }}
					resizeMode='cover'>

					<ImageBackground
						source={require('../../assets/images/story/header.png')}
						style={styles.headerImageStyle}
						resizeMode='stretch'>
						<View style={{ paddingHorizontal: wp(2) }}>
						<Text style={styles.text}>
							Spanish galleons were loaded with coins, ingots and objects made of gold and silver bound for Spain. 
						</Text>
						</View>
					</ImageBackground>

					<View style={{ flex: 1 }}>
						<Image
							source={require('../../assets/images/story/treasure.png')}
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
		bottom: hp(9),
		width: '100%',
		height: undefined,
		aspectRatio: 752 / 608,
	}
})