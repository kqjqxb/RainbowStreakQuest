import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, Dimensions, Animated, Text, ActivityIndicator, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fontDMSansRegular = 'DMSans-Regular';

const LoadingBerlinTravelHelperScreen = ({ setSelectedRainbowScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Змініть початкове значення animatedOpacity на 0 і використовуйте просте Animated.timing
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: true,
    }).start();
  }, [animatedOpacity]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedRainbowScreen('Home');
    }, 2800);
  }, []);

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}>
      <ImageBackground
        source={require('../assets/images/loadingBg.png')}
        style={{
          width: dimensions.width,
          height: dimensions.height * 1.1,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.Image
          source={require('../assets/images/loadingImage.png')}
          resizeMode='contain'
          style={{
            height: dimensions.width * 0.7,
            opacity: animatedOpacity,
            width: dimensions.width * 0.7,
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default LoadingBerlinTravelHelperScreen;