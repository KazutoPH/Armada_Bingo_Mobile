import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Bingo, font, images, style } from '../assets/config/config';
import { Header, Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
const menu = require('../assets/images/header/menu.png');
const notification = require('../assets/images/newnotification.png');
const headerimg = require('../assets/images/rigelheader.png');
class DashboardHeader extends Component {
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
                <Image
                  source={menu}
                  resizeMode='contain'
                  style={styles.leftIcon}
                />
              </TouchableOpacity>
            ) : this.props.back !== false ? (
              <TouchableOpacity onPress={() => this.props.onPress()}>
                <Icon
                  name='arrowleft'
                  type='antdesign'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            ) : null}
          </View>
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-SemiBold',
                color: 'white',
              }}
            >
              {this.props.title}
            </Text>
          </View>
        }
        rightComponent={
          this.props.notifications !== false ? (
            <View style={{ alignItems: 'center', display: 'flex' }}>
              <Icon
                name='gg-circle'
                type='font-awesome-5'
                color='white'
                iconStyle={{ width: 32, alignSelf: 'center', left: 8 }}
              />
              <View style={{ flexWrap: 'wrap' }}>
                {this.props.balance ? (
                  <NumberFormat
                    value={this.props.balance ? this.props.balance : 0.0}
                    displayType={'text'}
                    thousandSeparator={true}
                    thousandsGroupStyle={'thousand'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={(value) => (
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: font.SemiBold,
                          color: 'white',
                          marginHorizontal: 6.4,
                          flexWrap: 'nowrap',
                        }}
                      >
                        {value}
                      </Text>
                    )}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: font.SemiBold,
                      color: 'white',
                      marginHorizontal: 6.4,
                    }}
                  >
                    0.00
                  </Text>
                )}
              </View>
            </View>
          ) : null
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    balance: state.balance,
  };
};

export default connect(mapStateToProps)(DashboardHeader);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#674a62',
    height: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent: 'center',
    //height: hp('8%')
    marginTop: hp('3%'),
    paddingVertical: hp('2%'),
  },
  leftIcon: {
    height: 25,
    width: 32,
    marginLeft: 10,
  },
});
