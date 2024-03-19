import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Card } from 'react-native-shadow-cards';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import MainHeader from '../../components/mainheader';

import Spinner from 'react-native-loading-spinner-overlay';
import DashboardHeader from '../../components/dashboardheader';
import { ArmadaHeader } from '../../components/armadaheader';
const { width } = Dimensions.get('window');

class Withdraw extends Component {
  state = {
    spinner: false,
  };
  async componentDidMount() {
    // await this.setState({ spinner: true });
    // if (this.props.withdrawbanks) {
    // 	await this.setState({ spinner: false });
    // } else {
    // 	await withdraw_banks();
    // 	setTimeout(async () => {
    // 		await this.setState({ spinner: false });
    // 	}, 2000);
    // }
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEBEB' }}>
        <Spinner
          visible={this.state.spinner}
          overlayColor='rgba(0, 0, 0, 0.40)'
          color='white'
          backgroundColor='#999999'
          size='large'
        />
        <View style={styles.container}>
          {/* <DashboardHeader
            menu={false}
            title='Peer to Peer Top-up /Withdraw'
            onPress={() => Actions.buyticket()}
            notifications={false}
          /> */}
          <ArmadaHeader />
          <View style={{ marginBottom: hp('12%') }}>
            {/* <View>
								<TouchableOpacity onPress={() => Actions.comingsoon()}>
									<Card elevation={5} style={styles.cardContainer}>
										<View style={styles.cardContainerInfo}>
											<View
												style={{
													borderBottomColor: 'white',
													borderBottomWidth: 2,
													marginHorizontal: wp('5%')
												}}
											>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														alignSelf: 'center',
														marginBottom: hp('1.5%')
													}}
												>
													<Text style={styles.cardText}>WITHDRAW TO</Text>
													<Text style={styles.cardTextdest}> BANK</Text>
												</View>
											</View>
											<Text style={styles.description}>
												Money will be Transferred to your Bank Account
											</Text>
										</View>
									</Card>
								</TouchableOpacity>
							</View> */}
            {/* <View>
								<TouchableOpacity>
									<Card elevation={5} style={styles.cardContainer}>
										<View style={styles.cardContainerInfo}>
											<View
												style={{
													borderBottomColor: 'white',
													borderBottomWidth: 2,
													marginHorizontal: wp('5%')
												}}
											>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														alignSelf: 'center',
														marginBottom: hp('1.5%')
													}}
												>
													<Text style={styles.cardText}>Withdraw To </Text>
													<Text style={styles.cardTextdest}> Cash</Text>
												</View>
											</View>
											<Text style={styles.description}>
												Money will collected in the cash pickup points
											</Text>
										</View>
									</Card>
								</TouchableOpacity>
							</View> */}
            <View>
              <TouchableOpacity onPress={() => Actions.qrscanning()}>
                <Card elevation={5} style={styles.cardContainer}>
                  <View style={styles.cardContainerInfo}>
                    <View
                      style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: 2,
                        marginHorizontal: wp('5%'),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginBottom: hp('1.5%'),
                          flexWrap: 'wrap',
                        }}
                      >
                        <Text style={styles.cardText}>
                          Withdraw To{' '}
                          <Text style={{ fontFamily: 'Montserrat-Bold' }}>
                            Accredited Partners
                          </Text>
                        </Text>
                        <Text style={styles.cardTextdest} />
                      </View>
                    </View>
                    <Text style={styles.description}>
                      Money will be Transferred to Accredited Partners Account
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    withdrawbanks: state.withdrawbank,
  };
};

export default connect(mapStateToProps)(Withdraw);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    width,
    backgroundColor: '#011563',
    height: hp('15%'),
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    backgroundColor: '#F1D8B9',
    height: hp('20%'),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp('4%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContainer1: {
    flexDirection: 'row',
    width: wp('80%'),
    height: hp('18%'),
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: hp('2%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContainerInfo: {
    flex: 1,
    width: wp('80%'),
    height: hp('20%'),
    justifyContent: 'center',
  },
  cardText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  cardTextdest: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  description: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('4%'),
  },
  back: {
    flex: 1,
    alignSelf: 'flex-start',

    marginLeft: wp('4%'),
  },
  backtext: {
    fontSize: 18,
    color: 'white',
  },
  title: {
    flex: 2,
    alignSelf: 'center',

    fontSize: 22,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
});
