import React, { Component } from "react";
import SplashScreen from "react-native-splash-screen";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppRegistry,
  BackHandler,
  Alert,
} from "react-native";

import Main from "./src/main";

export default class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#353535"
          barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
        />
        <Main />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
});

AppRegistry.registerComponent("App", () => App);
