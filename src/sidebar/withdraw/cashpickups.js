import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	TextInput,
	Image,
	ScrollView,
	Keyboard,
	SafeAreaView,
	KeyboardAvoidingView
} from 'react-native';
import NumberFormat from 'react-number-format';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-tiny-toast';
import { connect } from 'react-redux';
import MainHeader from '../../Component/mainheader';

var Joi = require('joi-browser');
const { width, height } = Dimensions.get('window');

const schema = Joi.object().keys({
	firstname: Joi.string().min(2).max(15).required(),
	middlename: Joi.string().min(2).max(15).required(),
	lastname: Joi.string().min(2).max(15).required(),
	accountnumber: Joi.string().min(8).max(20).required(),
	amount: Joi.string().required()
});
class CashPickups extends Component {
	state = {
		bankdetails: [],
		value: '',
		errors: '',
		dataloader: false,
		withdrawbanks: [],
		text: '',
		con: [],
		bankform: false,
		bankname: '',
		banklogo: '',
		firstname: '',
		middlename: '',
		lastname: '',
		accountnumber: '',
		amount: '',
		procid: '',
		success: '',
		loader: false,
		fee: '',
		sendpin: false,
		otp: false,
		pin: '',
		errorcolor: 'red',
		presspin: true,
		buttonpress: 0,
		token: '',
		formdata: {},
		isLoading: false,
		code: '',
		error: '',
		errors: '',
		buttonDisabled: true,
		otpbutton: true,
		shownewcode: false,
		fees: {}
	};
	_onPressAction = () => {
		Actions.pop();
	};
	componentDidMount = async () => {
		Toast.showLoading();
		await this.setState({ dataloader: true });
		setTimeout(async () => {
			const withdrawbanks = this.props.withdrawbanks.cpus;
			await this.setState({
				withdrawbanks: withdrawbanks,
				con: withdrawbanks,
				dataloader: false
			});
			Toast.hide();
		}, 2000);
	};

	_searchonChange = async (value) => {
		const searchdata = this.state.withdrawbanks.filter((item) => {
			const contact = item.name.toLowerCase();
			const conData = value.toLowerCase();
			return contact.indexOf(conData) > -1;
		});
		if (value) {
			await this.setState({
				text: value,
				withdrawbanks: searchdata
			});
		} else {
			await this.setState({ text: '', withdrawbanks: this.state.con });
		}
	};
	bankform = async (item) => {
		await this.setState({
			bankform: true,
			bankname: item.name,
			banklogo: item.logo,
			procid: item.procId,
			fee: item.merchantFee
		});
	};
	submit = async () => {
		Keyboard.dismiss();
		Toast.showLoading();
		await this.setState({ loader: true });
		let val = '';
		const validata = Joi.validate(
			{
				firstname: this.state.firstname,
				middlename: this.state.middlename,
				lastname: this.state.lastname,
				amount: this.state.amount,
				nationality: this.state.nationality,
				street1: this.state.street1,
				barangay: this.state.barangay,
				city: this.state.city,
				province: this.state.province,
				country: this.state.country
			},
			schema,
			function(err, value) {
				if (!err) return null;
				const reter = err.details[0].message;

				val = err.details[0].context.key;
				return reter;
			}
		);
		if (!!validata) {
			Toast.hide();
			await this.setState({ errors: validata });
			Toast.show(validata, {
				position: Toast.position.CENTER,
				imgSource: require('../../../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			setTimeout(async () => {
				Toast.hide();
				await this.setState({
					errors: null,
					loader: false
				});
				if (val === 'firstname') {
					this.setState({ firstname: '' });
				} else if (val === 'middlename') {
					this.setState({ middlename: '' });
				} else if (val === 'lastname') {
					this.setState({ lastname: '' });
				} else if (val === 'amount') {
					this.setState({ amount: '' });
				} else if (val === 'nationality') {
					this.setState({ nationality: '' });
				} else if (val === 'street1') {
					this.setState({ street1: '' });
				} else if (val === 'barangay') {
					this.setState({ barangay: '' });
				} else if (val === 'city') {
					this.setState({ city: '' });
				} else if (val === 'province') {
					this.setState({ province: '' });
				} else if (val === 'country') {
					this.setState({ country: '' });
				}
			}, 2000);
		} else if (this.state.amount <= 0) {
			Toast.hide();
			alert('Insufficient Funds');
			await this.setState({
				loader: false
			});
		} else {
			if (this.props.balance < parseFloat(this.state.amount)) {
				Toast.hide();
				await this.setState({ loader: false, showimage: false });
				alert('Insufficient Funds');
			} else {
				const obj = {
					FirstName: this.state.firstname,
					MiddleName: this.state.middlename,
					LastName: this.state.lastname,
					Amount: this.state.amount,
					ProcId: this.state.procid,

					Nationality: this.state.nationality,
					Address: {
						Street1: this.state.street1,
						Barangay: this.state.barangay,
						City: this.state.city,
						Province: this.state.province,
						Country: this.state.country
					}
				};

				await this.setState({ formdata: obj, sendpin: true, loader: false });
				Toast.hide();
			}
		}
	};
	render() {
		const balance = this.props.balance;
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View>
						<MainHeader
							menu={false}
							notifications={false}
							onPress={() => Actions.pop()}
							title='Withdraw Cash'
						/>

						<View>
							<ScrollView style={{ marginBottom: hp('15%') }}>
								<View />
								{this.state.bankform ? (
									<View>
										<View
											style={{
												flexDirection: 'column',
												marginHorizontal: wp('9%'),
												alignItems: 'center',
												marginTop: hp('2%')
											}}
										>
											<Image
												style={styles.circleContainer}
												source={{ uri: this.state.banklogo }}
											/>
										</View>

										<KeyboardAvoidingView behavior={'position'} enabled>
											<View
												style={{
													width: wp('80%'),
													alignSelf: 'center',
													marginTop: hp('2%')
												}}
											>
												<View style={editstyles.ProfileText}>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															FIRST NAME
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															value={this.state.firstname}
															returnKeyType='done'
															onChangeText={(firstname) => this.setState({ firstname })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															MIDDLE NAME
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															returnKeyType='done'
															value={this.state.middlename}
															onChangeText={(middlename) => this.setState({ middlename })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															LAST NAME
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															returnKeyType='done'
															value={this.state.lastname}
															onChangeText={(lastname) => this.setState({ lastname })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															Amount
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='number'
															keyboardType='decimal-pad'
															returnKeyType='done'
															value={this.state.amount}
															onChangeText={(amount) => this.setState({ amount })}
														/>
													</View>

													<Text style={[ editstyles.container, editstyles.Label ]}>
														NATIONALITY
													</Text>

													<View style={editstyles.DPinputStyle}>
														<View>
															<CountryPicker
																value={this.state.nationality}
																withAlphaFilter
																withFilter
																placeholder={
																	this.state.nationality ? (
																		this.state.nationality
																	) : (
																		this.state.nationalityplaceholder
																	)
																}
																onSelect={(country) =>
																	this.setState({
																		nationality: country.name,
																		placeholder: ''
																	})}
															/>
														</View>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															Street1
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															returnKeyType='done'
															value={this.state.street1}
															onChangeText={(street1) => this.setState({ street1 })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															Barangay
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															returnKeyType='done'
															value={this.state.barangay}
															onChangeText={(barangay) => this.setState({ barangay })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															City
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															value={this.state.city}
															returnKeyType='done'
															onChangeText={(city) => this.setState({ city })}
														/>
													</View>
													<View style={editstyles.formcont}>
														<Text style={[ editstyles.container, editstyles.Label ]}>
															Province
														</Text>
														<TextInput
															style={[ editstyles.container, editstyles.inputStyle ]}
															type='text'
															value={this.state.province}
															returnKeyType='done'
															onChangeText={(province) => this.setState({ province })}
														/>
													</View>
													<Text style={[ editstyles.container, editstyles.Label ]}>
														Country
													</Text>

													<View style={editstyles.DPinputStyle}>
														<View>
															<CountryPicker
																value={this.state.country}
																withAlphaFilter
																withFilter
																placeholder={
																	this.state.country ? (
																		this.state.country
																	) : (
																		this.state.countryplaceholder
																	)
																}
																onSelect={(country) =>
																	this.setState({
																		country: country.name,
																		placeholder: ''
																	})}
															/>
														</View>
													</View>
												</View>
											</View>
										</KeyboardAvoidingView>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'center',
												marginHorizontal: wp('10%')
											}}
										>
											<View
												style={{
													alignSelf: 'flex-start',
													flex: 1,
													marginTop: hp('2%')
												}}
											>
												<View style={{ flexDirection: 'row' }}>
													<NumberFormat
														value={balance ? balance.balance : 0.0}
														displayType={'text'}
														thousandSeparator={true}
														thousandsGroupStyle={'thousand'}
														decimalScale={2}
														fixedDecimalScale={true}
														renderText={(value) => (
															<Text style={{ color: '#001563' }}>Credits : {value}</Text>
														)}
													/>
												</View>
											</View>
											<View style={{ alignSelf: 'flex-end' }}>
												<Text
													style={{
														color: 'red',
														alignSelf: 'flex-end',
														marginTop: hp('2%')
													}}
												>
													Fee : {this.state.fee}
												</Text>
											</View>
										</View>
										<View>
											<View style={styles.buttonContainer}>
												<View style={styles.signinwrapper}>
													{!this.state.loader ? (
														<TouchableOpacity
															activeOpacity={0.5}
															onPress={() => this.submit()}
														>
															<View style={styles.depositraisedbutton}>
																<Text style={styles.raisedbuttonText}>Submit</Text>
															</View>
														</TouchableOpacity>
													) : null}
												</View>
											</View>
										</View>
									</View>
								) : (
									<View>
										<View style={styles.screen}>
											<View style={styles.dropheader}>
												<View>
													<View style={styles.searchcontainer}>
														<View style={styles.searchpadding}>
															<TextInput
																style={styles.inputStyle}
																onChangeText={(value) => this._searchonChange(value)}
																value={this.state.text}
																placeholder={'Search For Banks'}
																returnKeyType='done'
															/>
														</View>
														<TouchableOpacity
															style={styles.searchicon}
															onPress={this.searchreciever}
														>
															<View>
																<Icon name='search' color='#001563' size={18} />
															</View>
														</TouchableOpacity>
													</View>
												</View>
											</View>
										</View>

										{!this.state.dataloader ? this.state.withdrawbanks &&
										this.state.withdrawbanks.length > 0 ? (
											this.state.withdrawbanks.map((bank, index) => {
												return (
													<TouchableOpacity
														style={{
															height: hp('12%'),
															padding: 15,
															borderBottomColor: 'gray',
															borderBottomWidth: 1
														}}
														onPress={() => Actions.comingsoon()}
													>
														<View
															style={{
																flexDirection: 'row',
																justifyContent: 'space-between'
															}}
														>
															<View>
																<Image
																	resizeMode='cover'
																	style={styles.circleContainer}
																	source={
																		!!bank.logo ? (
																			{ uri: bank.logo }
																		) : (
																			require('../../../assets/images/profile.png')
																		)
																	}
																/>
															</View>
															<View
																style={{
																	width: wp('50%'),
																	height: hp('6%'),

																	color: '#fff',

																	justifyContent: 'center'
																}}
															>
																<Text style={styles.cardText}> {bank.name}</Text>
															</View>
														</View>
													</TouchableOpacity>
												);
											})
										) : (
											<View style={{ justifyContent: 'center', alignItems: 'center' }}>
												<Text style={{ color: 'red' }}>No Banks Available</Text>
											</View>
										) : null}
									</View>
								)}
							</ScrollView>
						</View>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		balance: state.balance,
		auth: state.auth,
		withdrawbanks: state.withdrawbank
	};
};

export default connect(mapStateToProps)(CashPickups);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	header: {
		width: wp('100%'),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#353535',
		paddingHorizontal: wp('2%'),
		paddingVertical: hp('2%')
	},
	backArrow: {
		marginLeft: wp('2%')
	},

	backButtonIcon: {
		width: wp('5%'),
		height: hp('5%')
	},

	titles: {
		color: 'white',
		padding: 12,
		fontSize: hp('2.5%'),
		fontFamily: 'Montserrat-SemiBold',
		textAlign: 'center',
		flex: 1
	},
	cardContainer: {
		width: wp('100%'),
		borderRadius: 0,
		borderBottomColor: 'grey',
		borderBottomWidth: 0.4,
		height: hp('9.5%'),
		flexDirection: 'row'
	},
	cardContainerInfo: {},
	cardText: {
		color: '#001563',
		fontSize: 14,
		fontFamily: 'Montserrat-SemiBold'
	},
	circleContainer: {
		width: wp('38%'),
		height: hp('6%'),

		fontSize: 20,
		color: '#fff',

		justifyContent: 'center'
	},
	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#794F9B'
	},
	holderinputcontainer: {
		marginTop: hp('0.5%'),
		width: wp('80%'),
		height: 35,
		borderColor: '#011563',
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
		justifyContent: 'center'
	},
	holderinput: {
		height: 40,
		fontSize: 14
	},
	balancecontainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: wp('10%'),
		marginTop: wp('6%')
	},
	balancetext: {
		flex: 3,
		alignSelf: 'flex-start'
	},
	balance: {
		flex: 3,
		alignSelf: 'center',
		width: wp('20%'),
		flexDirection: 'row'
	},
	signinwrapper: {
		marginTop: hp('8%'),
		paddingHorizontal: wp('10%')
	},
	buttoncontainer: {
		backgroundColor: '#001563',
		borderWidth: 1,
		borderRadius: 5,
		borderColor: 'transparent',
		width: wp('78%'),
		height: hp('6%'),
		alignItems: 'center',
		justifyContent: 'center'
	},

	buttonText: {
		color: 'white',
		fontSize: hp('2.5%'),
		fontFamily: 'Montserrat-Medium',
		justifyContent: 'center'
	},

	bankerrorContainer: {
		textAlign: 'center',
		alignItems: 'center',
		marginBottom: hp('2%')
	},
	image2: {
		width: 10,
		height: 10
	},
	dropdowninfo: {
		overflow: 'scroll',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'grey'
	},
	screen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		alignContent: 'center',
		marginTop: hp('4%'),
		marginBottom: hp('4%')
	},
	parent: {
		flexWrap: 'wrap',
		flexDirection: 'row',

		paddingHorizontal: wp('4.2%')
	},
	children: {
		margin: 10,
		width: wp('40%'),
		backgroundColor: '#fff',
		borderColor: '#eee',
		borderWidth: 1
	},
	chimg: {
		width: 80,
		height: 80,
		alignSelf: 'center'
	},
	imagetext: {
		color: 'black',
		textAlign: 'center',
		padding: 10,
		alignContent: 'center',
		fontSize: 14,
		minHeight: 50
	},
	searchcontainer: {
		height: hp('6%'),
		width: wp('85%'),
		flexDirection: 'row',
		borderColor: '#eee',
		marginTop: hp('1%'),
		fontSize: 25,
		paddingHorizontal: wp('6%'),
		fontFamily: 'Montserrat-SemiBold',
		borderWidth: 2,
		borderColor: '#eee',
		fontSize: 14,
		borderRadius: 10
	},

	inputStyle: {
		fontSize: 12,
		padding: 10,
		fontFamily: 'Montserrat-Regular'
	},
	searchicon: {
		width: wp('10%'),
		height: hp('5.3%'),
		position: 'absolute',
		right: wp('4%'),
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	otpbuttonContainer: {
		alignSelf: 'center',
		alignItems: 'center'
	},

	depositraisedbutton: {
		backgroundColor: '#353535',
		paddingVertical: hp('1.5%'),
		alignItems: 'center',

		borderRadius: 5,
		marginTop: hp('0.5%')
	},
	raisedbuttonText: {
		color: 'white',
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		textTransform: 'uppercase'
	},
	errorDefaultStyle: {
		justifyContent: 'center',
		alignItems: 'center',

		color: 'red',
		fontSize: wp('4%'),
		fontWeight: 'bold',

		paddingHorizontal: wp('0%')
	},

	successDefaultStyle: {
		justifyContent: 'center',
		alignItems: 'center',

		color: 'green',
		fontSize: wp('4%'),
		fontWeight: 'bold',

		paddingHorizontal: wp('0%')
	},
	otperrorContainer: {
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: hp('3%')
	},
	input: {
		height: 40,
		color: '#011563'
	},
	pinContStyle: {
		height: hp('8%'),
		width: wp('80%'),
		marginHorizontal: wp('12%')
	},
	keyTextStyle: {
		fontSize: hp('3.5%'),
		fontFamily: 'Montserrat-SemiBold',
		color: 'rgba(0,21,99,1)'
	},
	textWrapper: {
		height: hp('35%'),
		width: wp('90%'),
		marginHorizontal: wp('5%'),
		marginVertical: hp('15%'),
		borderRadius: 10,
		borderWidth: 4,
		borderColor: '#fff'
	},
	pinStyle: {
		borderRadius: 0,
		height: 8,
		color: '#ffffff'
	},
	pinActiveStyle: {
		borderRadius: 9,
		height: 15,
		width: 15
	},
	rect36: {
		width,
		height,
		backgroundColor: 'rgba(0,21,99,1)',
		shadowOpacity: 1,
		overflow: 'visible',
		flex: 1
	},
	text6: {
		height: hp('5%'),
		width: wp('78%'),
		marginVertical: hp('5%'),
		color: 'rgba(255,255,255,1)',
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center'
	},
	text7: {
		paddingTop: hp('5%'),
		paddingBottom: 0,
		color: 'rgba(255,255,255,1)',

		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
		lineHeight: 20,
		paddingHorizontal: wp('5%'),
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center'
	},
	keypad: {
		backgroundColor: 'rgba(255,255,255,1)'
	},
	cell: {
		borderColor: 'rgba(0,21,99,1)',
		borderWidth: 1
	},
	headerIconView: {
		width: wp('20%'),
		height: hp('5%'),
		flex: 0.5,
		alignSelf: 'flex-start',
		marginLeft: wp('1%'),
		backgroundColor: 'transparent',
		marginTop: hp('6%'),
		marginBottom: hp('6%')
	},
	headerBackButtonView: {
		width: wp('4%'),
		height: hp('4%'),
		paddingBottom: hp('4%')
	},
	backButtonIcon: {
		width: wp('6%'),
		height: hp('6%'),
		marginLeft: wp('4%')
	},
	keyboardcontainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: wp('4%'),
		paddingTop: hp('4%')
	},
	container: {
		flex: 1
	},
	errorDefaultStyle: {
		justifyContent: 'center',
		alignItems: 'center',

		color: 'white',
		fontSize: wp('5%'),
		fontWeight: 'bold',
		color: 'red',
		paddingHorizontal: wp('0%')
	},
	errorContainer: {
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: hp('20%')
	},

	newcode: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: hp('5%'),
		paddingTop: hp('2%'),
		flexWrap: 'wrap'
	},
	newcodeleft: {
		justifyContent: 'flex-start',
		color: 'white',
		alignContent: 'space-between'
	},
	newcoderight: {
		color: 'white',
		justifyContent: 'flex-end',
		paddingVertical: hp('0%'),
		marginTop: hp('-2%')
	},

	markWrap: {
		paddingTop: hp('2%')
	},
	mark: {
		fontSize: 22,
		width: null,
		height: null,
		color: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: hp('5%'),
		flexDirection: 'column',
		textAlign: 'center'
	},
	timelabel: {
		color: 'white',
		alignSelf: 'flex-end'
	},

	authentication: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: wp('15%'),
		flexDirection: 'column',
		textAlign: 'center',
		color: 'white',
		paddingBottom: hp('8%')
	},
	otpbackground: {
		width,
		height
	},
	loaderbackground: {
		width: 100,
		height: 100,
		flex: 1
	},

	wrapper: {
		paddingVertical: hp('5%'),
		paddingHorizontal: wp('2.5%')
	},

	inputWrap: {
		flexDirection: 'row',
		marginBottom: hp('4%'),
		paddingHorizontal: wp('10%'),
		height: hp('10%'),
		marginHorizontal: wp('0%')
	},

	otpinput: {
		flex: 1,
		paddingHorizontal: wp('5%'),
		color: 'white'
	},

	button: {
		backgroundColor: 'white',
		paddingVertical: hp('1.5%'),
		alignItems: 'center',
		justifyContent: 'center',

		borderRadius: 10
	},
	buttonText: {
		color: 'black',
		fontSize: wp('4%'),
		fontFamily: 'Montserrat-Medium'
	},

	signupWrap: {
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	accountText: {
		color: '#D8D8D8'
	},
	signupLinkText: {
		color: '#FFF',
		marginLeft: wp('1%')
	},
	footerwrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: hp('1%')
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: wp('5%')
	},
	footerleft: {
		justifyContent: 'flex-start',
		color: 'white',
		alignContent: 'space-between'
	},
	footerright: {
		color: 'white',
		justifyContent: 'flex-end'
	},

	borderStyleHighLighted: {
		borderColor: '#03DAC6'
	},

	underlineStyleBase: {
		width: wp('8%'),
		height: wp('10%'),
		borderWidth: 0,
		borderBottomWidth: 1,
		color: 'white'
	},

	underlineStyleHighLighted: {
		borderColor: '#03DAC6'
	},
	headerIconView: {
		width: wp('20%'),
		height: hp('5%'),
		flex: 0.5,
		alignSelf: 'flex-start',
		marginLeft: wp('1%'),
		backgroundColor: 'transparent',
		marginTop: hp('6%'),
		marginBottom: hp('6%')
	},
	headerBackButtonView: {
		width: wp('4%'),
		height: hp('4%'),
		paddingBottom: hp('4%')
	},
	backButtonIcon: {
		width: wp('6%'),
		height: hp('6%'),
		marginLeft: wp('4%')
	},
	errorDefaultStyle: {
		justifyContent: 'center',
		alignItems: 'center',

		color: 'white',
		fontSize: wp('5%'),
		fontWeight: 'bold',
		color: 'red',
		paddingHorizontal: wp('0%')
	},
	errorContainer: {
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: hp('20%')
	},
	bankerrorContainer: {
		textAlign: 'center',
		alignItems: 'center',
		marginBottom: hp('2%')
	}
});
const editstyles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		width,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#353535',
		paddingHorizontal: wp('3%'),
		paddingVertical: hp('1.8%')
	},
	backArrow: {
		marginLeft: wp('2%')
	},
	backButtonIcon: {
		width: wp('5%'),
		height: hp('4.5%')
	},
	titles: {
		color: 'white',
		fontSize: hp('2.5%'),
		fontFamily: 'Montserrat-SemiBold',
		marginLeft: wp('3%')
	},
	Body: {
		paddingHorizontal: wp('4%'),
		backgroundColor: '#FFFCFC',
		flexDirection: 'row',
		flex: 1
	},
	Panel: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.23,
		shadowRadius: 2,
		elevation: 10,
		paddingVertical: hp('5%'),
		paddingHorizontal: wp('7%')
	},

	ProfileText: {
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	Label: {
		fontFamily: 'Montserrat-Medium',
		fontSize: hp('1.8%'),
		marginVertical: hp('0.1%')
	},
	inputStyle: {
		height: hp('5%'),
		alignItems: 'center',
		alignContent: 'center',
		fontSize: hp('1.8%'),
		fontFamily: 'Montserrat-Regular',
		backgroundColor: '#EBEBEB',
		paddingHorizontal: wp('3%'),
		flexGrow: wp('80%'),
		letterSpacing: wp('0.2%')
	},
	DPinputStyle: {
		height: hp('4%'),
		alignItems: 'center',
		alignContent: 'center',
		fontSize: hp('1.3%'),
		fontFamily: 'Montserrat-Regular',
		backgroundColor: '#EBEBEB',
		flexGrow: wp('80%')
	},
	sideconts: {
		backgroundColor: '#353535',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomStartRadius: 5,
		borderTopLeftRadius: 5,
		flexGrow: wp('20%'),
		height: hp('4%'),
		color: 'white',
		fontSize: hp('1.3%'),
		fontFamily: 'Montserrat-SemiBold'
	},
	sidecont: {
		height: hp('5%'),
		flexDirection: 'row',
		borderRadius: 7,
		fontSize: hp('1.3%'),
		fontFamily: 'Montserrat-SemiBold'
	},
	BoxText: {
		color: 'white',
		fontSize: hp('1.3%'),
		fontFamily: 'Montserrat-SemiBold'
	},
	EditProfile: {
		backgroundColor: '#353535',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: hp('1.5%'),
		borderRadius: 40,

		width: wp('70%')
	},
	EditText: {
		fontFamily: 'Montserrat-Bold',
		fontSize: hp('2%'),
		color: 'white'
	},
	formcont: {
		marginBottom: hp('1.5%')
	}
});
