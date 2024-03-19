import TrackPlayer from 'react-native-track-player';
const welcometone = { url: require('./src/assets/welcome.mp3') };

function playsound() {
  TrackPlayer.setupPlayer().then(async () => {
    TrackPlayer.setVolume(0.6);
    TrackPlayer.updateOptions({
      stopWithApp: true,
    });
    await TrackPlayer.add([welcometone]);
    TrackPlayer.play();
  });
}

export default playsound;
