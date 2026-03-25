import SoundPlayer from 'react-native-sound-player';

type PlaySoundProps = {
  fileName: string; 
};

const PlaySound = ({ fileName }: PlaySoundProps) => {
  try {
    SoundPlayer.playSoundFile(fileName.replace(/\.[^/.]+$/, ''), fileName.split('.').pop()!);
  } catch (error) {
    console.log('❌ Sound playback error:', error);
  }
};

export default PlaySound;
