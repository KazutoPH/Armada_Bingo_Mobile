import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import MainHeader from '../../components/mainheader';
import { Actions } from 'react-native-router-flux';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

export default class Result extends Component {
  render() {
    return (
      <SafeAreaView style={style.body}>
        <MainHeader
          notifications={false}
          title='Prepaid Card Load'
          onPress={() => Actions.buyticket()}
          regionimage={false}
          menu={false}
          back={false}
        />
        <Card containerStyle={{ padding: 0 }}>
          <View
            style={{
              backgroundColor: '#00AC00',
              height: 95,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                color: 'white',
              }}
            >
              Prepaid Card Load SUCCESSFUL
            </Text>
          </View>
          <View
            style={{
              height: 328,
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: 43,
            }}
          >
            <View style={style.col}>
              <View style={style.row}>
                <Text style={style.key}>Source</Text>
              </View>
              <View style={style.row}>
                <Text style={style.value}>{this.props.data.comment}</Text>
              </View>
            </View>
            <View style={style.col}>
              <View style={style.row}>
                <Text style={style.key}>Amount</Text>
              </View>
              <View style={style.row}>
                <NumberFormat
                  value={this.props.data.amount}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'lakh'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text style={style.value}>{value}</Text>
                  )}
                />
              </View>
            </View>
            <View style={style.col}>
              <View style={style.row}>
                <Text style={style.key}>Date</Text>
              </View>
              <View style={style.row}>
                <Text style={style.value}>
                  <Moment format='DD/MM/YYYY hh:mm:ss' element={Text} fromNow>
                    {this.props.date}
                  </Moment>
                </Text>
              </View>
            </View>
            <View style={style.col}>
              <View style={style.row}>
                <Text style={style.key}>Reference ID</Text>
              </View>
              <View style={style.row}>
                <Text style={style.value}>{this.props.data.transactionid}</Text>
              </View>
            </View>
          </View>
        </Card>
        <Button
          title='DONE'
          titleStyle={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14 }}
          containerStyle={{ margin: 10, borderRadius: 40 }}
          buttonStyle={{ backgroundColor: '#00AC00' }}
          onPress={() => Actions.buyticket()}
        />
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  col: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
  row: {
    flex: 1,
  },
  key: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#35353580',
  },
  value: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#353535',
  },
});
