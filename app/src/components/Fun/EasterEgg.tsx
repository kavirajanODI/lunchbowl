import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import SoundPlayer from 'react-native-sound-player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EasterEgg = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

  const playSound = () => {
    try {
      SoundPlayer.playSoundFile('bell', 'mp3');
    } catch (e) {
      console.log('Error playing sound', e);
    }
  };

  useEffect(() => {
    const triggerEasterEgg = async () => {
      try {
        // const hasShown = await AsyncStorage.getItem('@easterEggShown');

        // if (!hasShown) {
          setShowConfetti(true);
          confettiRef.current && confettiRef.current.start();
          playSound();

          setTimeout(() => setShowConfetti(false), 4000);

          // await AsyncStorage.setItem('@easterEggShown', 'true');
        // }
      } catch (error) {
        console.log('EasterEgg AsyncStorage error:', error);
      }
    };

    triggerEasterEgg();
  }, []);

  return (
    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{x: -10, y: 0}}
          fadeOut
          autoStart={false}
        />
      )}
    </View>
  );
};

export default EasterEgg;
