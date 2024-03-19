import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import { color, font, images, navigate, style } from '../../assets/config/config'
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Scene1 extends Component {

	render() {
		return (
			<View style={{ flex: 1 }}>

				<ImageBackground
					source={require('../../assets/images/story/cloudbg.png')}
					style={{ height: '100%', width: '100%' }}
					resizeMode='cover'>

					<ImageBackground
						source={require('../../assets/images/story/header.png')}
						style={styles.headerImageStyle}
						resizeMode='stretch'>
						<View style={{ paddingHorizontal: wp(2) }}>
							<Text style={styles.text}>In the era of exploration,{'\n'}discovery and colonization.</Text>
						</View>
					</ImageBackground>


					<Image
						source={require('../../assets/images/story/bigboat.png')}
						style={styles.boatImageStyle}
						resizeMode='contain'
					/>

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

	boatImageStyle: {
		aspectRatio: 718 / 1000,
		width: '70%',
		height: undefined,
		position: 'absolute',
		left: 0,
		bottom: 0
	}
})