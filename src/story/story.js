import React, { Component } from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import { color, font, images, navigate, style } from '../assets/config/config'
import { Button, Divider, Slider } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from 'react-native-elements';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

import Scene1 from './scenes/scene1'
import Scene2 from './scenes/scene2'
import Scene3 from './scenes/scene3'
import Scene4 from './scenes/scene4'
import Scene5 from './scenes/scene5'
import Scene6 from './scenes/scene6'
import Scene7 from './scenes/scene7'
import Scene8 from './scenes/scene8'
import Scene9 from './scenes/scene9'
import Scene10 from './scenes/scene10'
import Scene11 from './scenes/scene11'

export default class Story extends Component {
	constructor(props) {
		super(props)

		this.state = {
			scenes: [
				{
					page: Scene1,
				},
				{
					page: Scene2,
				},
				{
					page: Scene3,
				},
				{
					page: Scene4,
				},		
				{
					page: Scene5,
				},
				{
					page: Scene6,
				},
				{
					page: Scene7,
				},			
				{
					page: Scene8,
				},	
				{
					page: Scene9,
				},
				{
					page: Scene10,
				},
				{
					page: Scene11,
				},			
			],
		}

		this.currentStepIndex = 0;
		this.onNextPress = this._onNextPress.bind(this);
		this.onSkipPress = this._onSkipPress.bind(this);
	}

	_onNextPress() {

		if (this.currentStepIndex < this.state.scenes.length - 1) {
			this.currentStepIndex = this.currentStepIndex + 1;
			this.flatListRef.scrollToIndex({ index: this.currentStepIndex });
		}

		else
		Actions.sevenseas()
	}

	_onSkipPress() {
		Actions.sevenseas()
	}

	render() {


		return (
			<View style={{ flex: 1 }}>
				<FlatList
					style={{ flex: 1 }}
					horizontal
					scrollEnabled={false}
					ref={(ref) => { this.flatListRef = ref; }}
					initialScrollIndex={0}
					showsHorizontalScrollIndicator={false}
					data={this.state.scenes}
					renderItem={({ item }) => (
						<View style={{ flex: 1, width: wp(100) }}>
							<item.page />
						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>

				<View style={styles.bottomContainer}>

					<TouchableOpacity
						onPress={this.onSkipPress}>
						<LinearGradient
							colors={['#D39D2A', '#FFEA8F', '#FFEA8F', '#D39129', '#FFEA8F', '#D39D2A']}
							style={[styles.button, { padding: 5 }]}>

							<LinearGradient
								colors={['#D40000', '#570000']}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>

								<Text style={{ fontFamily: font.ExtraBold, fontSize: 15, color: 'white' }}>SKIP</Text>
							</LinearGradient>
						</LinearGradient>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={this.onNextPress}>
						<LinearGradient
							colors={['#D39D2A', '#FFEA8F', '#FFEA8F', '#D39129', '#FFEA8F', '#D39D2A']}
							style={[styles.button, { padding: 5 }]}>

							<LinearGradient
								colors={['#D40000', '#570000']}
								style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>

								<Text style={{ fontFamily: font.ExtraBold, fontSize: 15, color: 'white' }}>NEXT</Text>
							</LinearGradient>
						</LinearGradient>
					</TouchableOpacity>

				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},

	bottomContainer: {
		position: 'absolute',
		bottom: 5,
		width: wp(100),
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: wp(2),
		paddingVertical: hp(1.5)
	},

	button: {
		width: 100,
		height: 50,
		borderRadius: 10,
	},
})