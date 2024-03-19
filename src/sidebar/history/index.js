import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Image,
  ImageBackground,
  Modal
} from 'react-native';
const { width } = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import Toast from 'react-native-tiny-toast';
import Moment from 'react-moment';
import { Icon } from 'react-native-elements';
import { Bingo, font, images, style, color } from '../../assets/config/config';
import { Table, Row, Cell } from 'react-native-gifted-table';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';
import get_history from '../../redux/actions/historyAction';
import DashboardHeader from '../../components/dashboardheader';
import { ArmadaHeader } from '../../components/armadaheader';

class History extends Component {

  constructor(props) {
		super(props)
    
  this.state = {
    isModalVisible: false,
    modaldata: [],
    loader: false,
    refreshing: false,
    loadbutton: false,
    comment: '',
    showModal: false,
    onpressIndex: 0,
    history: [
      {
        type: 'ticketPurchase',
        name: 'TICKET PURCHASE',
        trxid: '105462X658',
        gameid: '5632145847',
        userid: 'Raymart',
        pattern: 'Full House',
        gems: 100,
        date: '05-07-2021',
        time: '11:19 AM',
      },
      {
        type: 'creditGem',
        name: 'CREDIT GEMS',
        trxid: '105462X658',
        gameid: '5632145847',
        gemSent: 150,
        tax: 30,
        gems: 120,
        sendername: 'DELIMASUYO',
        receivername: 'P@ASH',
        date: '05-07-2021',
        time: '11:19 AM'
      },
      {
        type: 'creditGem',
        name: 'CREDIT GEMS',
        trxid: '105462X658',
        gameid: '5632145847',
        gemSent: 150,
        tax: 30,
        gems: 120,
        sendername: 'ESCOBAR',
        receivername: 'P@ASH',
        date: '05-07-2021',
        time: '11:19 AM'
      },
      {
        type: 'commission',
        name: 'COMMISSION',
        trxid: '105462X658',
        gameid: '5632145847',
        userid: 'Raymart',
        player: 'Kite',
        from: 'P@ASH',
        gems: 60,
        date: '05-07-2021',
        time: '11:19 AM'
      },
      {
        gameid: '5632145847',
        transactionid: '2054X34584',
        type: 'refund',
        name: 'REFUND',
        trxid: '105462X658',
        userid: 'Raymart',
        from: 'P@ASH',
        pattern: 'Any Horizontal',
        gems: 60,
        date: '05-07-2021',
        time: '11:19 AM'
      },
      {
        type: 'winnings',
        name: 'WINNINGS',
        trxid: '105462X658',
        gameid: '5632145847',
        userid: 'Raymart',
        pattern: 'Any Diagonal',
        commissionfrom: 'P@ASH',
        gems: 60,
        date: '05-07-2021',
        time: '11:19 AM'
      },
      {
        type: 'debitGem',
        name: 'DEBIT GEMS',
        trxid: '105462X658',
        gameid: '5632145847',
        gemSent: 150,
        tax: 30,
        gems: 120,
        sendername: 'P@ASH',
        receivername: 'ESCOBAR',
        date: '05-07-2021',
        time: '11:19 AM'
      },
    ]
  }
  };

  componentDidMount = async () => {
    get_history();
    if (!this.props.history.length > 0) {
      await this.setState({ loadbutton: true });
    } else {
      await this.setState({ loadbutton: false });
    }
    setTimeout(async () => {
      await this.setState({ loader: false });
    }, 2500);
  };
  loaddata = async () => {
    Toast.showLoading();
    this.setState({ loader: true, loadbutton: false });
    await get_history();
    setTimeout(() => {
      Toast.hide();
      this.setState({ loader: false });
    }, 2000);
  };

  toggleModal = async (data) => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      modaldata: data,
      comment: data.comment,
    });
  };

  _refresh = async () => {
    await this.setState({ refreshing: true });
    setTimeout(async () => {
      await get_history();
      await this.setState({ refreshing: false });
    }, 1000);
  };

  renderHistory = (data, index) => {
		let time = data.time.split(' ')
		if (data.type == 'creditGem' || data.type == 'debitGem') {
			return (
				<TouchableOpacity style={styles.requestContainer}
					onPress={() => this.setState({ onpressIndex: index, showModal: true })}>
					<Text style={styles.textTitle}>{data.name}</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', mmarginTop: 2 }}>
						<Table>
							<Row>
								<Cell style={styles.cell1} render={() =>
									<Text style={styles.text}>FROM</Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}> : </Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}>{data.sendername}</Text>
								} />
							</Row>
							<Row>
								<Cell style={styles.cell1} render={() =>
									<Text style={styles.text}>TO</Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}> : </Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}>{data.receivername}</Text>
								} />
							</Row>
						</Table>
						<View>
							<Text style={[styles.text, { color: '#C72026' }]}>{data.date}&emsp;{time[0]} <Text style={{ fontSize: 9 }}>{time[1]}</Text></Text>
							<Text style={[styles.text, { color: '#C72026' }]}>GEMS : <Text style={{ fontSize: 15, lineHeight: 15 }}>{data.gems}</Text></Text>
						</View>

					</View>

				</TouchableOpacity>
			)

			// DISPLAY IF DATA TYPE == commission or refund
		} else {
			return (
				<TouchableOpacity style={styles.requestContainer}
					onPress={() => this.setState({ onpressIndex: index, showModal: true })}>
					<Text style={styles.textTitle}>{data.name}</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
						<Table>
							<Row>
								<Cell style={styles.cell1} render={() =>
									<Text style={styles.text}>GAME ID</Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}> : </Text>
								} />
								<Cell style={styles.cell2} render={() =>
									<Text style={styles.text}>{data.gameid}</Text>
								} />
							</Row>

							{data.type == 'commission' ? (
								<Row>
									<Cell style={styles.cell1} render={() =>
										<Text style={styles.text}>PLAYER</Text>
									} />
									<Cell style={styles.cell2} render={() =>
										<Text style={styles.text}> : </Text>
									} />
									<Cell style={styles.cell2} render={() =>
										<Text style={styles.text}>{data.player}</Text>
									} />
								</Row>
							) : (
								<Row>
									<Cell style={styles.cell1} render={() =>
										<Text style={styles.text}>PATTERN</Text>
									} />
									<Cell style={styles.cell2} render={() =>
										<Text style={styles.text}> : </Text>
									} />
									<Cell style={styles.cell2} render={() =>
										<Text style={styles.text}>{data.pattern}</Text>
									} />
								</Row>
							)}

						</Table>

						<View>
							<Text style={[styles.text, { color: '#C72026' }]}>{data.date}&emsp;{time[0]} <Text style={{ fontSize: 9 }}>{time[1]}</Text></Text>
							<Text style={[styles.text, { color: '#C72026' }]}>GEMS : <Text style={{ fontSize: 15, lineHeight: 15 }}>{data.gems}</Text></Text>
						</View>

					</View>

				</TouchableOpacity>
			)
		}
	}

  render() {
    let time = this.state.history[this.state.onpressIndex].time.split(' ');
    const history = this.props.history;
    const { modaldata } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEBEB' }}>
        <ArmadaHeader />

				<ImageBackground
					style={{ flex: 1, }}
					resizeMode="cover"
					source={images.bodyBG}>
					<ScrollView style={{ flex: 1 }}>
						{this.state.history.map((data, index) =>
							<View key={index} style={{
								marginHorizontal: 10,
								marginTop: index == 0 ? 20 : 10,
								marginBottom: index == this.state.history.length - 1 ? 20 : 10,
							}}>
								{this.renderHistory(data, index)}
							</View>
						)}
					</ScrollView>
				</ImageBackground>

				<Modal
					visible={this.state.showModal}
					transparent={true}
					animationType='fade'>
					<View style={styles.modalTransparentBackground}>
						<View style={{ borderRadius: 10, overflow: 'hidden', width: '80%', alignSelf: 'center' }}>
							<LinearGradient
								colors={["#FF0000", "#570000"]}
								style={{ backgroundColor: '#F1D8B9', alignItems: 'center', paddingVertical: 10, justifyContent: 'center' }}>

								<Image
									source={require('../../assets/images/armadatextonly.png')}
									resizeMode="contain"
									style={{
										height: 80,
										aspectRatio: 228 / 113
									}}
								/>

								<View style={{ position: 'absolute', right: 15 }}>
									<Icon
										name='times'
										type='font-awesome-5'
										color='white'
										size={25}
										onPress={() => this.setState({ showModal: false })} />
								</View>
							</LinearGradient>

							<View style={{ backgroundColor: 'white', padding: 15, overflow: 'hidden' }}>

								<Table>
									{/* DISPLAY USER ID ON MODAL */}
									{this.state.history[this.state.onpressIndex].userid ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>User ID</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].userid}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY TRANSACTION TYPE ON MODAL */}
									<Row style={[styles.modalRow, { marginTop: 20 }]}>
										<Cell style={styles.cell1} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Tran Type</Text>
										} />
										<Cell style={styles.cell2} render={() =>
											<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
										} />
										<Cell style={styles.cell3} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].name}</Text>
										} />
									</Row>

									{/* DISPLAY TRANSACTION ID ON MODAL */}
									<Row style={styles.modalRow}>
										<Cell style={styles.cell1} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Tran ID</Text>
										} />
										<Cell style={styles.cell2} render={() =>
											<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
										} />
										<Cell style={styles.cell3} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].trxid}</Text>
										} />
									</Row>

									{/* DISPLAY GAME ID ON MODAL */}
									{this.state.history[this.state.onpressIndex].type != 'creditGem' && this.state.history[this.state.onpressIndex].type != 'debitGem' ? (
										<Row style={[styles.modalRow, { marginTop: 20 }]}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Game ID</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}> {this.state.history[this.state.onpressIndex].gameid}</Text>
											} />
										</Row>
									) : null}


									{/* DISPLAY PATERN */}
									{this.state.history[this.state.onpressIndex].pattern ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Pattern</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].pattern}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY PLAYER */}
									{this.state.history[this.state.onpressIndex].player ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Player</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].player}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY AMOUNT */}
									{this.state.history[this.state.onpressIndex].type != 'creditGem' && this.state.history[this.state.onpressIndex].type != 'debitGem' ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Amount</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].gems}</Text>
											} />
										</Row>
									) : null}


									{/* DISPLAY SENDER */}
									{this.state.history[this.state.onpressIndex].sendername ? (
										<Row style={[styles.modalRow, { marginTop: 20 }]}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Sender</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].sendername}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY RECEIVER */}
									{this.state.history[this.state.onpressIndex].receivername ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Receiver</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].receivername}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY GEM SENT */}
									{this.state.history[this.state.onpressIndex].gemSent ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Gems Sent</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].gemSent}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY TAX ON MODAL */}
									{this.state.history[this.state.onpressIndex].tax ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Pirate Tax (P2P)</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].tax}</Text>
											} />
										</Row>
									) : null}

									{this.state.history[this.state.onpressIndex].type == 'creditGem' || this.state.history[this.state.onpressIndex].type == 'debitGem' ? (
										<Row style={styles.modalRow}>
											<Cell style={styles.cell1} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Gems Received</Text>
											} />
											<Cell style={styles.cell2} render={() =>
												<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
											} />
											<Cell style={styles.cell3} render={() =>
												<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].gems}</Text>
											} />
										</Row>
									) : null}

									{/* DISPLAY DATE */}
									<Row style={[styles.modalRow, { marginTop: 20 }]}>
										<Cell style={styles.cell1} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Date</Text>
										} />
										<Cell style={styles.cell2} render={() =>
											<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
										} />
										<Cell style={styles.cell3} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{this.state.history[this.state.onpressIndex].date}</Text>
										} />
									</Row>

									{/* DISPLAY TIME */}
									<Row style={styles.modalRow}>
										<Cell style={styles.cell1} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-start', color: 'rgba(42, 42, 42, 0.48)' }]}>Time</Text>
										} />
										<Cell style={styles.cell2} render={() =>
											<Text style={[styles.textTitle, { color: 'rgba(42, 42, 42, 0.48)' }]}> : </Text>
										} />
										<Cell style={styles.cell3} render={() =>
											<Text style={[styles.textTitle, { alignSelf: 'flex-end' }]}>{time[0]}<Text style={{ fontSize: 10 }}> {time[1]}</Text></Text>
										} />
									</Row>

								</Table>

							</View>
						</View>
					</View>
				</Modal>

      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    history: state.history,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(History);

const styles = StyleSheet.create({
	button: {
		width: 80,
		height: 35,
		borderRadius: 10,
	},

	requestContainer: {
		backgroundColor: '#F1D8B9',
		borderRadius: 5,
		padding: 10,
		flexShrink: 1
	},

	textTitle: {
		fontFamily: font.Bold,
		fontSize: 15,
		color: '#2A2A2A',
		alignSelf: 'center'
	},

	text: {
		fontFamily: font.Bold,
		fontSize: 12,
		color: '#2A2A2A',
		marginTop: 2,
		lineHeight: 15
	},

	modalTransparentBackground: {
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.95)',
	},

	cell1: {
		alignItems: 'flex-start'
	},

	cell2: {
		flexShrink: 1
	},

	cell3: {
		flex: 1,
	},

	cell4: {
		alignItems: 'flex-start',
		flexShrink: 1
	},

	modalRow: {
		marginTop: 0,
	}
});
