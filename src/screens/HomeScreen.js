import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import LoadingRainbowStreakScreen from './LoadingRainbowStreakScreen';
// import RainbowLepreGameScreen from './RainbowLepreGameScreen';

const homeRainbowScreensButtons = [
  {
    rainbowScreen: 'Home',
    rainbowWhiteIcon: require('../assets/icons/rainbowButtons/trackingIcon.png'),
    rainbowScreenTitle: 'Tracking',
  },
  {
    rainbowScreen: 'Calendar',
    rainbowWhiteIcon: require('../assets/icons/rainbowButtons/calendarIcon.png'),
    rainbowScreenTitle: 'Calendar',
  },
  // {
  //   rainbowScreen: 'Game',
  //   rainbowWhiteIcon: require('../assets/icons/rainbowButtons/gameIcon.png'),
  //   rainbowScreenTitle: 'Game',
  // },
  {
    rainbowScreen: 'Settings',
    rainbowWhiteIcon: require('../assets/icons/rainbowButtons/settingsIcon.png'),
    rainbowScreenTitle: 'Settings',
  },
];

const fontDMSansRegular = 'DMSans-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedRainbowScreen, setSelectedRainbowScreen] = useState('LoadingRainbow');
  const [isHabitVisible, setIsHabitVisible] = useState(false);

  return (
    <View style={{
      width: dimensions.width,
      alignItems: 'center',
      backgroundColor: '#268A42',
      flex: 1,
    }}>
      <SafeAreaView style={{
        alignSelf: 'center',
        backgroundColor: '#1AAC4B',
        alignItems: 'center',
        marginBottom: dimensions.height * 0.01,
        justifyContent: 'center',
        width: dimensions.width,
      }}>
        {isHabitVisible ? (
          <TouchableOpacity
            onPress={() => {
              setIsHabitVisible(false);
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
              paddingHorizontal: dimensions.width * 0.03,
              paddingBottom: dimensions.height * 0.014,
              flexDirection: 'row',
            }}>
            <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
            <Text style={{
              alignItems: 'center',
              fontWeight: 700,
              fontSize: dimensions.width * 0.061,
              textAlign: 'center',
              alignSelf: 'flex-start',
              color: 'white',
              fontFamily: fontDMSansRegular,
            }}
            >
              Info
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={{
            paddingBottom: dimensions.height * 0.014,
            alignSelf: 'flex-start',
            textAlign: 'center',
            fontFamily: fontDMSansRegular,
            fontWeight: 700,
            alignItems: 'center',
            fontSize: dimensions.width * 0.061,
            paddingLeft: dimensions.width * 0.05,
            color: 'white',
          }}
          >
            Habit Tracking
          </Text>
        )}
      </SafeAreaView>
      {selectedRainbowScreen === 'Home' ? (
        <View style={{
          height: dimensions.height,
          width: dimensions.width,
        }}>


          <Text style={{
            alignItems: 'center',
            fontWeight: 700,
            fontSize: dimensions.width * 0.1,
            textAlign: 'center',
            alignSelf: 'center',
            color: 'white',
            fontFamily: fontDMSansRegular,
            marginTop: dimensions.height * 0.25,
          }}
          >
            Hello, User!
          </Text>
        </View>
      ) : selectedRainbowScreen === 'LoadingRainbow' ? (
        <LoadingRainbowStreakScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : null}

      {selectedRainbowScreen !== 'LoadingRainbow' && (
        <View
          style={{
            bottom: dimensions.height * 0,
            height: dimensions.height * 0.12,
            alignSelf: 'center',
            backgroundColor: '#1AAC4B',
            flexDirection: 'row',
            width: dimensions.width,
            position: 'absolute',
            alignItems: 'center',
            paddingTop: dimensions.height * 0.015,
            justifyContent: 'space-between',
            zIndex: 4000,
            paddingHorizontal: dimensions.width * 0.05,
            paddingBottom: dimensions.height * 0.024,
          }}
        >
          {homeRainbowScreensButtons.map((rainbBtn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRainbowScreen(rainbBtn.rainbowScreen)}
              style={{
                width: dimensions.width * 0.24,
                alignItems: 'center',
                height: dimensions.height * 0.088,
                marginHorizontal: dimensions.width * 0.001,
                borderRadius: dimensions.width * 0.07,
                padding: dimensions.height * 0.019,
                backgroundColor: selectedRainbowScreen === rainbBtn.rainbowScreen ? '#268A42' : 'transparent',
              }}
            >
              <Image
                source={rainbBtn.rainbowWhiteIcon}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  marginTop: dimensions.height * 0.008,
                  fontSize: dimensions.width * 0.034,
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {rainbBtn.rainbowScreenTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
