import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import museumsData from '../components/museumsData';
import historicalMonumentsData from '../components/historicalMonumentsData';
import contemporaryArtObjectsData from '../components/contemporaryArtObjectsData';

import SettingsScreen from './SettingsScreen';
import BerlinPlaceDetailsScreen from './BerlinPlaceDetailsScreen';
import BerlinWishlistsScreen from './BerlinWishlistsScreen';
import CasScreen from './CasScreen';
import LoadingBerlinTravelHelperScreen from './LoadingBerlinTravelHelperScreen';

const homeBerlinScreensButtons = [
  {
    bthScreen: 'Home',
    bthSilverIcon: require('../assets/icons/bthSilverIcons/bthHomeIcon.png'),
    bthRedIcon: require('../assets/icons/bthRedIcons/bthHomeIcon.png'),
    bthScreenTitle: 'Local',
  },
  {
    bthScreen: 'Casino',
    bthSilverIcon: require('../assets/icons/bthSilverIcons/bthCasIcon.png'),
    bthRedIcon: require('../assets/icons/bthRedIcons/bthCasIcon.png'),
    bthScreenTitle: 'Casino',
  },
  {
    bthScreen: 'Checklists',
    bthSilverIcon: require('../assets/icons/bthSilverIcons/bthWidhlistIcon.png'),
    bthRedIcon: require('../assets/icons/bthRedIcons/bthWidhlistIcon.png'),
    bthScreenTitle: 'Wish-list',
  },
  {
    bthScreen: 'Settings',
    bthSilverIcon: require('../assets/icons/bthSilverIcons/bthSettingsIcon.png'),
    bthRedIcon: require('../assets/icons/bthRedIcons/bthSettingsIcon.png'),
    bthScreenTitle: 'Settings',
  },
];

const allData = [...museumsData, ...historicalMonumentsData, ...contemporaryArtObjectsData];


const fontSfProTextRegular = 'SFProText-Regular';
const fontDMSansRegular = 'DMSans-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedBerlinScreen, setSelectedBerlinScreen] = useState('LoadingBerlin');

  const [favorites, setFavorites] = useState([]);
  const [selectedBerlinCategory, setSelectedBerlinCategory] = useState('All');
  const [selectedBerlinPlace, setSelectedBerlinPlace] = useState(null);
  const scrollViewRef = useRef(null);

  const getBerlinDataByCategory = (category) => {
    switch (category) {
      case 'All':
        return allData;
      case 'Museums':
        return museumsData;
      case 'Historical monuments':
        return historicalMonumentsData;
      case 'Contemporary art objects':
        return contemporaryArtObjectsData;
      default:
        return [];
    }
  };

  const berlinData = getBerlinDataByCategory(selectedBerlinCategory);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedBerlinCategory]);

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#2E2E2E',
      width: dimensions.width
    }}>

      {selectedBerlinScreen === 'Home' ? (
        <SafeAreaView style={{
          width: dimensions.width,
        }}>
          <View style={{
            width: dimensions.width,
            borderBottomColor: '#FFFFFF80',
            borderBottomWidth: dimensions.height * 0.00055,
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              textAlign: 'center',
              fontFamily: fontDMSansRegular,
              fontWeight: 700,
              fontSize: dimensions.width * 0.05,
              alignItems: 'center',
              alignSelf: 'center',
              color: 'white',
              paddingBottom: dimensions.height * 0.014,
            }}
            >
              Local
            </Text>
          </View>

          <View style={{
            marginVertical: dimensions.height * 0.01,
          }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                {['All', 'Museums', 'Historical monuments', 'Contemporary art objects'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={{
                      borderRadius: dimensions.width * 0.016,
                      backgroundColor: selectedBerlinCategory === category ? '#FF0000' : '#848484',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: dimensions.width * 0.021,
                      height: dimensions.height * 0.05,
                    }}
                    onPress={() => {
                      setSelectedBerlinCategory(`${category}`);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.043,
                        color: 'white',
                        fontWeight: 400,

                        paddingHorizontal: dimensions.width * 0.05,
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: dimensions.height * 0.01,
              width: '100%',
            }}
            contentContainerStyle={{
              paddingBottom: dimensions.height * 0.25,
            }}
          >
            {berlinData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedBerlinPlace(item);
                  setSelectedBerlinScreen('EventDetails')
                }}
                style={{
                  alignSelf: 'center',
                  width: dimensions.width * 0.95,
                  marginBottom: dimensions.height * 0.021,
                  zIndex: 500
                }}
              >
                <Image
                  source={item.bthImage}
                  style={{
                    width: dimensions.width * 0.93,
                    height: dimensions.height * 0.25,
                    alignSelf: 'center',
                    textAlign: 'center',
                    borderRadius: dimensions.width * 0.03,
                  }}
                  resizeMode="stretch"
                />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: dimensions.width * 0.97,
                }}>
                  <Text
                    style={{
                      fontFamily: fontDMSansRegular,
                      fontSize: dimensions.width * 0.046,
                      color: 'white',
                      padding: dimensions.width * 0.021,
                      fontWeight: 600,
                      maxWidth: dimensions.width * 0.9,
                    }}
                  >
                    {item.bthTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      ) : selectedBerlinScreen === 'Settings' ? (
        <SettingsScreen setSelectedBerlinScreen={setSelectedBerlinScreen}
        />
      ) : selectedBerlinScreen === 'EventDetails' ? (
        <BerlinPlaceDetailsScreen setSelectedBerlinScreen={setSelectedBerlinScreen} selectedBerlinScreen={selectedBerlinScreen} favorites={favorites} setFavorites={setFavorites}
          selectedBerlinPlace={selectedBerlinPlace} setSelectedBerlinPlace={setSelectedBerlinPlace}
        />
      ) : selectedBerlinScreen === 'Casino' ? (
        <CasScreen setSelectedBerlinScreen={setSelectedBerlinScreen} selectedBerlinScreen={selectedBerlinScreen} selectedBerlinPlace={selectedBerlinPlace} setSelectedBerlinPlace={setSelectedBerlinPlace} />
      ) : selectedBerlinScreen === 'Checklists' ? (
        <BerlinWishlistsScreen setSelectedBerlinScreen={setSelectedBerlinScreen} selectedBerlinScreen={selectedBerlinScreen} />
      ) : selectedBerlinScreen === 'LoadingBerlin' ? (
        <LoadingBerlinTravelHelperScreen setSelectedBerlinScreen={setSelectedBerlinScreen} selectedBerlinScreen={selectedBerlinScreen} />
      ) : null}

      {selectedBerlinScreen !== 'LoadingBerlin' && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            height: dimensions.height * 0.12,
            paddingHorizontal: dimensions.width * 0.05,
            backgroundColor: '#404040',
            width: dimensions.width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: 5000,
            paddingBottom: dimensions.height * 0.025,
          }}
        >
          {homeBerlinScreensButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedBerlinScreen(button.bthScreen)}
              style={{
                borderRadius: dimensions.width * 0.5,
                padding: dimensions.height * 0.019,
                alignItems: 'center',
                marginHorizontal: dimensions.width * 0.001,
              }}
            >
              <Image
                source={selectedBerlinScreen === button.bthScreen ? button.bthRedIcon : button.bthSilverIcon}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  fontSize: dimensions.width * 0.034,
                  color: selectedBerlinScreen === button.bthScreen ? '#FF0000' : '#848484',
                  marginTop: dimensions.height * 0.008,
                  fontWeight: 400
                }}
              >
                {button.bthScreenTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
