import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, Dimensions, Animated, Text, ActivityIndicator, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fontDMSansRegular = 'DMSans-Regular';

const LoadingBerlinTravelHelperScreen = ({ setSelectedBerlinScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [percentage, setPercentage] = useState(0);

  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(dimensions.width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedOpacity]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedBerlinScreen('Home');
    }, 3000);
  }, [percentage]);

  useEffect(() => {
    Animated.timing(textAnim, {
      toValue: 0,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [textAnim]);

  return (
    <View style={{
      backgroundColor: '#2E2E2E',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}>
      <Animated.Image
        source={require('../assets/images/berlinTravelHelpreLoader.png')}
        resizeMode='contain'
        style={{
          height: dimensions.width * 0.7,
          opacity: animatedOpacity,
          width: dimensions.width * 0.7,
          transform: [{
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-360deg']
            })
          }]
        }}
      />
      <Animated.Text style={{
        fontSize: dimensions.width * 0.1,
        transform: [{ translateX: textAnim }],
        fontFamily: fontDMSansRegular,
        fontWeight: 700,
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        color: 'white',
        paddingBottom: dimensions.height * 0.014,
        paddingHorizontal: dimensions.width * 0.1,
        marginBottom: dimensions.height * 0.014,
      }}>
        Berlin Travel Helper
      </Animated.Text>

      <ActivityIndicator size="large" color="#FF0000" />
    </View>
  );
};

export default LoadingBerlinTravelHelperScreen;