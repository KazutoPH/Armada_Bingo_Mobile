import React from 'react';
import {
  Image,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../assets/config/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

const ArmadaHeader = (props) => {
  // const CenterComponent = () => (
  //   <Image
  //     source={images.drawerLogo}
  //     resizeMode="contain"
  //     style={{
  //       height: hp(10),
  //       aspectRatio: 199 / 108
  //     }}
  //   />
  // )

  // const RightComponent = () => (
  //   <View style={{ flexDirection: 'column', alignItems: 'center' }}>
  //     <Icon name="money-bill" type="font-awesome-5" color="white" size={20} />
  //     <Text style={fonts(15, font.Bold, "white")}>1000</Text>
  //   </View>
  // )
  return (
    // <Header
    //   ViewComponent={LinearGradient}
    //   containerStyle={{ height: hp(10) }}
    //   linearGradientProps={{
    //     colors: ["#FF0000", "#570000"]
    //   }}
    //   leftContainerStyle={props.leftContainerStyle}
    //   centerContainerStyle={{
    //   }}
    //   rightContainerStyle={props.rightContainerStyle}
    //   leftComponent={{
    //     icon: 'home',
    //     type: 'font-awesome-5',
    //     color: 'white',
    //     size: 20
    //   }}
    //   centerComponent={CenterComponent}
    //   rightComponent={RightComponent}
    // />

    <View style={{}}>
      <LinearGradient
        colors={['#FF0000', '#570000']}
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp(4),
          alignItems: 'center',
        }}
      >
        {props.back !== false ? (
          <TouchableOpacity onPress={() => Actions.pop()}>
            <Icon
              name='chevron-left'
              type='font-awesome-5'
              color='white'
              size={38}
            />
          </TouchableOpacity>
        ) : null}

        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={images.armadatextonly}
            resizeMode="contain"
            style={{
              height: hp(10),
              aspectRatio: 228 / 113
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export { ArmadaHeader };
