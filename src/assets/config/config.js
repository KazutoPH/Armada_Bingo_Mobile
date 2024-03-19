import { StyleSheet } from 'react-native';
import _ from 'lodash';

const Bingo = {
  B: _.range(1, 16),
  I: _.range(16, 31),
  N: _.range(31, 46),
  G: _.range(46, 61),
  O: _.range(61, 76),
};

const images = {
  mainbg: require('../images/mainScreenBG.png'),
  bingosp: require('../images/mainScreen.png'),
  headBG: require('../../assets/images/headBG.png'),
  ribbonBG: require('../images/ribbonBG.png'),
  bodyBG: require('../images/bodyBG.png'),
  bingocardContainer: require('../images/bingocardContainer.png'),
  bingopageBG: require('../images/bingopageBG.png'),
  scan: require('../images/scan.png'),
  peopleWatching: require('../images/peopleWatching.png'),
  star: require('../images/star.png'),
  ribbon: require('../images/ribbon.png'),
  anydiagonal: require('../images/anyDiagonal.png'),
  ticket: require('../images/ticket.png'),
  thumb: require('../images/thumb.png'),
  playbutton: require('../images/playbutton.png'),
  loginBG: require('../images/loginBG.png'),
  loginBtn: require('../images/loginBtn.png'),
  fourCorners: require('../images/fourCorners.png'),
  anyDiagonal: require('../images/anyDiagonal.png'),
  plusSign: require('../images/plusSign.png'),
  fullHouse: require('../images/fullHouse.png'),
  anyHorizontal: require('../images/anyHorizontal.png'),
  regBtn: require('../images/regBtn.png'),
  liveusers: require('../images/liveuser.png'),
  winner: require('../images/winner.gif'),
  ball: require('../images/ball.png'),
  regBG: require('../images/regBG.png'),
  drawerLogo: require('../images/drawerLogo.png'),
  armadatextonly: require('../images/armadatextonly.png'),


};
const ballimages = [require('../images/greenball.png')];
const color = {
  black: '#353535',
  blue: '#003299',
};

const font = {
  Regular: 'Raleway-Regular',
  Bold: 'Raleway-Bold',
  SemiBold: 'Raleway-SemiBold',
  Medium: 'Raleway-Medium',
  ExtraBold: 'Raleway-ExtraBold'
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export { images, color, style, font, Bingo, ballimages };
