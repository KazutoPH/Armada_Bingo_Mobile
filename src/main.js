import React, { Component } from 'react';
import { Router, Scene, ActionConst, Drawer } from 'react-native-router-flux';
import { View } from 'react-native';
import Landing from './landing';
import Login from './auth/login';
import Register from './auth/register';
import Forgot from './auth/forgot';
import OTP from './auth/otp';
import ResetPassword from './auth/resetpassword';
import Story from './story/story';
import DailyEvent from './dashboard/dailyevent';
import BingoPage from './dashboard/bingopage';
import Sidebar from './components/drawer';
import QRcode from './sidebar/qrcode';
import PrepaidLoadCard from './sidebar/topup/prepaidloadcard';
import Result from './sidebar/topup/result';
import History from './sidebar/history';
import Withdraw from './sidebar/withdraw';
import QrScanning from './sidebar/topup/qrscanning';
import CardScanning from './sidebar/topup/cardscanning';
import ContactUs from './sidebar/ContactUs/ContactUs';
import RaiseTicket from './sidebar/ContactUs/RaiseTicket';
import TicketDetails from './sidebar/ContactUs/ticketdetails';
import TheSevenSeas from './dashboard/sevenseas';
import BuyTicket from './dashboard/buyticket';
import WinnerPage from './dashboard/winnerpage';

import SendViaNumber from './sidebar/withdraw/sendvianumber/sendvianumber';
import SendTo from './sidebar/withdraw/sendvianumber/sendto';
import Notifications from './components/notifications';

export default class Main extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Router>
          <Drawer
            hideNavBar
            key='drawerMenu'
            contentComponent={Sidebar}
            drawerWidth={'80%'}
          >
            <Scene
              key='root'
              drawerLockMode='locked-closed'
              type={ActionConst.RESET}
              panHandlers={null}
            >
              <Scene
                initial={true}
                key='landing'
                component={Landing}
                animation='fade'
                hideNavBar={true}
              />
              {/* <Scene
                initial={true}
                key='bingopage'
                component={BingoPage}
                animation='fade'
                hideNavBar={true}
              /> */}
              <Scene
                key='login'
                component={Login}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='register'
                component={Register}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='forgot'
                component={Forgot}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='otps'
                component={OTP}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='resetpassword'
                component={ResetPassword}
                animation='fade'
                hideNavBar={true}
              />
            </Scene>
            <Scene
              key='root2'
              type={ActionConst.RESET}
              panHandlers={null}
              drawerLockMode='unlocked'
            >
              <Scene
                key='story'
                component={Story}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='dailyevent'
                component={DailyEvent}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='sevenseas'
                component={TheSevenSeas}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='buyticket'
                component={BuyTicket}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                // initial={true}
                key='bingopage'
                component={BingoPage}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='qrcode'
                component={QRcode}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='prepaidloadcard'
                component={PrepaidLoadCard}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='history'
                component={History}
                animation='fade'
                hideNavBar={true}
              />

              <Scene
                key='withdraw'
                component={Withdraw}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='result'
                component={Result}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='qrscanning'
                component={QrScanning}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='notifications'
                component={Notifications}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='winnerpage'
                component={WinnerPage}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='cardscanning'
                component={CardScanning}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='contactus'
                component={ContactUs}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='raiseticket'
                component={RaiseTicket}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='ticketdetails'
                component={TicketDetails}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='sendvianumber'
                component={SendViaNumber}
                animation='fade'
                hideNavBar={true}
              />
              <Scene
                key='sendto'
                component={SendTo}
                animation='fade'
                hideNavBar={true}
              />
            </Scene>
          </Drawer>
        </Router>
      </View>
    );
  }
}
