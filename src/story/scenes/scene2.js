import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import { color, font, images, navigate, style } from '../../assets/config/config'
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Scene2 extends Component {


	render() {
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground
					source={require('../../assets/images/story/woodbg.png')}
					style={{ height: '100%', width: '100%' }}
					resizeMode='cover'>

					<ImageBackground
						source={require('../../assets/images/story/header.png')}
						style={styles.headerImageStyle}
						resizeMode='stretch'>
						<View style={{ paddingHorizontal: wp(2) }}>
							<Text style={styles.text}>Spain amassed tremendous wealth and a vast colonial empire. </Text>
						</View>
					</ImageBackground>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Image
							source={require('../../assets/images/story/markmap.png')}
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
		width: '100%',
		aspectRatio: 750 / 998,
		height: undefined
	}
})