import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Header, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const menu = require('../assets/images/header/menu.png');
const notification = require('../assets/images/newnotification.png');

class MainHeader extends Component {
	state = {};
	async componentDidMount() {}
	render() {
		let region = this.props.title;

		return (
			<Header
				containerStyle={styles.headerStyle}
				leftComponent={
					<View style={{ flexDirection: 'row' }}>
						{this.props.menu !== false ? (
							<TouchableOpacity onPress={() => Actions.drawerOpen()}>
								<Image source={menu} resizeMode='contain' style={styles.leftIcon} />
							</TouchableOpacity>
						) : this.props.back !== false ? (
							<TouchableOpacity onPress={() => this.props.onPress()}>
								<Icon name='arrowleft' type='antdesign' size={30} color='#353535' />
							</TouchableOpacity>
						) : null}
					</View>
				}
				centerComponent={
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<View style={{ alignItems: 'center', marginHorizontal: 5 }}>
							<Text
								style={{
									color: '#003299',
									fontFamily: 'Montserrat-Bold',
									fontSize: 16
								}}
							>
								{this.props.title}
							</Text>
						</View>
					</View>
				}
				rightComponent={
					this.props.notifications !== false ? (
						<View>
							<TouchableOpacity onPress={() => Actions.notifications()}>
								<Image source={notification} resizeMode='contain' style={{ height: 25 }} />
							</TouchableOpacity>
						</View>
					) : null
				}
			/>
		);
	}
}

export default MainHeader;
const styles = StyleSheet.create({
	headerStyle: {
		backgroundColor: 'white',
		//height: 60,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,

		elevation: 6,
		justifyContent: 'center',
		//height: hp('8%')
		marginTop: hp('3%'),
		paddingVertical: hp('2%')
	},
	leftIcon: {
		height: 30,
		width: 40,
		marginLeft: 10
	}
});
