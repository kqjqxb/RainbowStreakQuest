import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Modal,
  ImageBackground,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontSfProTextRegular = 'SFProText-Regular';

const coinAndStone = [
  {
    image: require('../assets/images/rainbowGameImages/coinImage.png'),
    isPositive: true,
    type: 'coin',
  },
  {
    image: require('../assets/images/rainbowGameImages/stoneImage.png'),
    isPositive: false,
    type: 'stone',
  },
];

const RainbowLepreGameScreen = ({ setSelectedRainbowScreen, isRainbowGameStarted, setIsRainbowGameStarted }) => {
  const [dimensions] = useState(Dimensions.get('window'));

  const [rainbowCoinsAmount, setRainbowCoinsAmount] = useState(0);
  const [heartsAmount, setHeartsAmount] = useState(3);

  const [rainbowTimeRemaining, setRainbowTimeRemaining] = useState(59);
  const [resultsRainbowModalVisible, setResultsRainbowModalVisible] = useState(false);
  const [prevResult, setPrevResult] = useState('');
  const [rainbowPlayerSkin, setRainbowPlayerSkin] = useState(require('../assets/images/rainbowGameImages/persRightImage.png'));

  const [rainbPlayerX] = useState(new Animated.Value(0));

  const [fallingCoinAndStone, setFallingCoinAndStone] = useState([]);

  const handleSaveRainbowPrevResults = async () => {
    await AsyncStorage.setItem('prevResult', rainbowCoinsAmount.toString());
  }

  useEffect(() => {
    const loadPrevResult = async () => {
      try {
        const storedResult = await AsyncStorage.getItem('prevResult');
        if (storedResult !== null) {
          setPrevResult(storedResult);
        }
      } catch (e) {
        console.error('Error loading previous result:', e);
      }
    };
    loadPrevResult();
  }, []);

  const tryRainbowCollision = (item) => {
    const rainbPlayerWidth = dimensions.height * 0.19;
    const margin = 0;
    const rainbPlayerLeft = rainbPlayerX._value - margin;
    const rainbPlayerRight = rainbPlayerX._value + rainbPlayerWidth + margin;
    const rainbItemCenter = item.x - dimensions.width * 0.25;
    return rainbItemCenter >= rainbPlayerLeft && rainbItemCenter <= rainbPlayerRight;
  };

  const lastRainbCoinAndStoneRef = useRef(null);

  const idCounter = useRef(0);

  // Змініть функцію spawnRainbAndStone наступним чином:
  const spawnRainbAndStone = () => {
    let randRainbItem = coinAndStone[Math.floor(Math.random() * coinAndStone.length)];
    let safety = 10;
    while (lastRainbCoinAndStoneRef.current && lastRainbCoinAndStoneRef.current.type === randRainbItem.type && safety > 0) {
      randRainbItem = coinAndStone[Math.floor(Math.random() * coinAndStone.length)];
      safety--;
    }
    lastRainbCoinAndStoneRef.current = randRainbItem;

    const randX = Math.random() * (dimensions.width - 40);
    // Використовуємо лічильник для створення унікального ідентифікатора
    idCounter.current += 1;
    const uniqueId = `${Date.now()}-${idCounter.current}`;
    const newItem = {
      id: uniqueId,
      x: randX,
      y: new Animated.Value(-50),
      caught: false,
      ...randRainbItem,
    };

    setFallingCoinAndStone((prev) => [...prev, newItem]);

    const collisionThresholdRainbY = dimensions.height * 0.46;
    const listenerRainbId = newItem.y.addListener(({ value }) => {
      if (value > dimensions.height * 0.8) {
        newItem.y.removeListener(listenerRainbId);
        return;
      }
      if (!newItem.caught && value >= collisionThresholdRainbY && value <= dimensions.height * 0.95) {
        if (tryRainbowCollision(newItem)) {
          newItem.caught = true;
          if (newItem.isPositive) {
            if (newItem.type === 'coin') setRainbowCoinsAmount((prev) => prev + 50);
          } else {
            setHeartsAmount((prev) => prev - 1);
          }
          setFallingCoinAndStone((prev) => prev.filter((f) => f.id !== newItem.id));
          newItem.y.removeListener(listenerRainbId);
        }
      }
    });

    Animated.timing(newItem.y, {
      toValue: dimensions.height + 50,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      newItem.y.removeListener(listenerRainbId);
      setTimeout(() => {
        setFallingCoinAndStone((prev) => prev.filter((f) => f.id !== newItem.id));
      }, 0);
    });
  };

  useEffect(() => {
    let timerId = null;
    if (!resultsRainbowModalVisible && isRainbowGameStarted) {
      timerId = setInterval(() => {
        if (!resultsRainbowModalVisible && isRainbowGameStarted) {
          spawnRainbAndStone();
        }
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [resultsRainbowModalVisible, isRainbowGameStarted]);

  useEffect(() => {
    if (isRainbowGameStarted) {
      setRainbowTimeRemaining(59);
      const timerInterval = setInterval(() => {
        setRainbowTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setResultsRainbowModalVisible(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [isRainbowGameStarted]);


  useEffect(() => {
    if (heartsAmount <= 0) {
      setResultsRainbowModalVisible(true);
    }
  }, [heartsAmount])

  useEffect(() => {
    if (resultsRainbowModalVisible) {
      handleSaveRainbowPrevResults();
    }
  }, [resultsRainbowModalVisible])


  const moveLeft = () => {
    const rainbPlayerWidth = dimensions.height * 0.19;
    const newX = Math.max(0 - dimensions.width * 0.4, rainbPlayerX._value - dimensions.width * 0.2);
    setRainbowPlayerSkin(require('../assets/images/rainbowGameImages/persLeftImage.png'));
    Animated.spring(rainbPlayerX, {
      toValue: newX,
      useNativeDriver: true,
    }).start();
  };

  const moveRight = () => {
    const rainbPlayerWidth = dimensions.height * 0.19;
    const newX = Math.min(dimensions.width * 0.8 - rainbPlayerWidth, rainbPlayerX._value + dimensions.width * 0.2);
    setRainbowPlayerSkin(require('../assets/images/rainbowGameImages/persRightImage.png'));
    Animated.spring(rainbPlayerX, {
      toValue: newX,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Image source={isRainbowGameStarted
        ? require('../assets/images/rainbowGameImages/rainbowGameBg.png')
        : require('../assets/images/rainbowGameImages/rainbowPreGameImage.png')}
        style={{
          flex: 1,
          width: dimensions.width,
          height: dimensions.height,
          position: 'absolute',
        }} />

      <SafeAreaView style={{
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: dimensions.height * 0.01,
        backgroundColor: '#1AAC4B',
        alignItems: 'center',
        width: dimensions.width,
      }}>
        {isRainbowGameStarted ? (
          <View style={{
            width: dimensions.width,
            justifyContent: 'space-between',
            paddingBottom: dimensions.height * 0.019,
            flexDirection: 'row',
            paddingHorizontal: dimensions.width * 0.025,
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => {
                setIsRainbowGameStarted(false);
              }}
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
              <Text style={{
                fontFamily: fontSfProTextRegular,
                alignItems: 'center',
                fontSize: dimensions.width * 0.055,
                textAlign: 'center',
                alignSelf: 'flex-start',
                color: 'white',
                fontWeight: 700,
              }}
              >
                Back
              </Text>
            </TouchableOpacity>

            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: dimensions.width * 0.5,
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
              {[1, 2, 3].map((hearts) => (
                <Image
                  key={hearts}
                  source={heartsAmount >= hearts
                    ? require('../assets/images/rainbowGameImages/yellowRainbowHeartImage.png')
                    : require('../assets/images/rainbowGameImages/emptyYellowRainbowHeartImage.png')
                  }
                  style={{
                    height: dimensions.width * 0.08,
                    marginHorizontal: dimensions.width * 0.01,
                    width: dimensions.width * 0.08,
                  }}
                  resizeMode="contain"
                />
              ))}
            </View>

            <View style={{
              alignItems: 'center',
              height: dimensions.height * 0.035,
              borderRadius: dimensions.width * 0.5,
              justifyContent: 'center',
              backgroundColor: '#FDB938',
              width: dimensions.width * 0.21,
            }}>
              <Text style={{
                fontWeight: 600,
                textAlign: 'center',
                fontFamily: fontSfProTextRegular,
                fontSize: dimensions.width * 0.04,
                color: 'black',
              }}
              >
                00:{rainbowTimeRemaining < 10 ? '0' : ''}{rainbowTimeRemaining}
              </Text>
            </View>
          </View>
        ) : (
          <View style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingBottom: dimensions.height * 0.014,
            paddingHorizontal: dimensions.width * 0.025,
            alignItems: 'center',
            width: dimensions.width,
          }}>
            <Text style={{
              color: 'white',
              fontFamily: fontSfProTextRegular,
              fontWeight: 700,
              fontSize: dimensions.width * 0.061,
              paddingLeft: dimensions.width * 0.05,
              alignItems: 'center',
              alignSelf: 'flex-start',
              textAlign: 'center',
            }}
            >
              Game
            </Text>

            {prevResult && prevResult !== '' && (
              <View style={{
                borderRadius: dimensions.width * 0.5,
                height: dimensions.height * 0.035,
                backgroundColor: '#FDB938',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: dimensions.width * 0.07,
              }}>
                <Text style={{
                  color: '#393E42',
                  fontFamily: fontSfProTextRegular,
                  alignSelf: 'center',
                  fontSize: dimensions.width * 0.034,
                  fontWeight: 500,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                >
                  Last score: {prevResult}
                </Text>
              </View>
            )}
          </View>
        )}

      </SafeAreaView >

      {!isRainbowGameStarted ? (
        <SafeAreaView
          style={{
            flex: 1,
            height: dimensions.height,
            width: dimensions.width,
          }}>
          <Image
            source={require('../assets/images/homePersImage.png')}
            style={{
              marginTop: dimensions.height * 0.05,
              height: dimensions.height * 0.28,
              textAlign: 'center',
              alignSelf: 'center',
              width: dimensions.width * 0.5,
            }}
            resizeMode="contain"
          />
          <Text style={{
            alignSelf: 'center',
            fontFamily: fontSfProTextRegular,
            shadowRadius: 2,
            fontWeight: 700,
            fontSize: dimensions.width * 0.059,
            alignItems: 'center',
            marginTop: dimensions.height * 0.019,
            paddingHorizontal: dimensions.width * 0.025,
            textAlign: 'center',
            shadowColor: 'black',
            color: 'white',
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 1 },
          }}
          >
            Try your luck and collect all the coins in 1 minute! {'\n'}(1 coin - 50 points)
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsRainbowGameStarted(true);
              setRainbowTimeRemaining(59);
              setHeartsAmount(3);
            }}
            style={{
              alignSelf: 'center',
              marginTop: dimensions.height * 0.05,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/images/rainbowGameImages/startImage.png')}
              style={{
                width: dimensions.width * 0.3,
                height: dimensions.width * 0.3,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{ flex: 1, width: dimensions.width, height: dimensions.height }}>
          <View
            style={{
              width: dimensions.width,
              height: dimensions.height * 0.88,
              alignSelf: 'center',
              alignItems: 'center',
            }}
          >
            {fallingCoinAndStone.map((item) => (
              <Animated.View
                key={item.id}
                style={{
                  position: 'absolute',
                  left: item.x,
                  transform: [{ translateY: item.y }],
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    height: dimensions.width * 0.16,
                    resizeMode: 'contain',
                    width: dimensions.width * 0.16,
                  }}
                />
              </Animated.View>
            ))}

            <Animated.View
              style={{
                position: 'absolute',
                bottom: dimensions.height * 0.17,
                transform: [{ translateX: rainbPlayerX }],
              }}
            >
              <Image
                resizeMode="contain"
                source={rainbowPlayerSkin}
                style={{
                  height: dimensions.height * 0.19,
                  width: dimensions.height * 0.19,
                }}
              />
            </Animated.View>

            <View style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: dimensions.width * 0.7,
              bottom: dimensions.height * 0.07,
              position: 'absolute',
            }}>
              <TouchableOpacity onPress={moveLeft}>
                <Image
                  source={require('../assets/images/rainbowGameImages/leftButton.png')}
                  style={{
                    width: dimensions.height * 0.077,
                    height: dimensions.height * 0.077,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={moveRight}>
                <Image
                  source={require('../assets/images/rainbowGameImages/rightButton.png')}
                  style={{
                    width: dimensions.height * 0.077,
                    height: dimensions.height * 0.077,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={resultsRainbowModalVisible}
        onRequestClose={() => {
          setResultsRainbowModalVisible(false);
        }}
      >
        <ImageBackground source={require('../assets/images/rainbowGameImages/rainbowPreGameImage.png')} style={{ flex: 1, width: dimensions.width, height: dimensions.height }}>
          <View style={{
            flex: 1,
          }}>
            <SafeAreaView style={{
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.01,
              justifyContent: 'center',
              backgroundColor: '#1AAC4B',
              width: dimensions.width,
            }}>
              <TouchableOpacity
                onPress={() => {
                  setHeartsAmount(3);
                  setResultsRainbowModalVisible(false);
                  setRainbowTimeRemaining(59);
                  setRainbowCoinsAmount(0);
                  setIsRainbowGameStarted(false);
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  paddingBottom: dimensions.height * 0.014,
                  paddingHorizontal: dimensions.width * 0.03,
                }}>
                <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
                <Text style={{
                  color: 'white',
                  fontFamily: fontSfProTextRegular,
                  fontWeight: 700,
                  fontSize: dimensions.width * 0.061,
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </SafeAreaView>

            <Text
              style={{
                marginTop: dimensions.height * 0.1,
                color: '#393E42',
                fontSize: dimensions.width * 0.08,
                textAlign: 'center',
                fontFamily: fontSfProTextRegular,
                fontWeight: 700,
              }}>
              Game over
            </Text>

            <Text
              style={{
                marginTop: dimensions.height * 0.03,
                color: '#393E42',
                textAlign: 'center',
                fontSize: dimensions.width * 0.043,
                fontFamily: fontSfProTextRegular,
                fontWeight: 400,
              }}>
              You get
            </Text>

            <View style={{
              backgroundColor: '#268A42',
              width: dimensions.width * 0.4,
              alignSelf: 'center',
              height: dimensions.height * 0.07,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: dimensions.height * 0.016,
              borderRadius: dimensions.width * 0.03,
            }}>
              <Text
                style={{
                  fontFamily: fontSfProTextRegular,
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: dimensions.width * 0.059,
                }}>
                {rainbowCoinsAmount}
              </Text>

              <Image
                source={require('../assets/images/rainbowGameImages/coinImage.png')}
                style={{
                  width: dimensions.height * 0.043,
                  height: dimensions.height * 0.043,
                  marginLeft: dimensions.width * 0.01,
                }}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setRainbowCoinsAmount(0);
                setIsRainbowGameStarted(true);
                setHeartsAmount(3);
                setRainbowTimeRemaining(59);
                setResultsRainbowModalVisible(false);
              }}
              style={{
                justifyContent: 'center',
                backgroundColor: '#F9CF22',
                borderRadius: dimensions.width * 0.5,
                width: dimensions.width * 0.93,
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.05,
                height: dimensions.height * 0.07,
              }}>
              <Text
                style={{
                  fontSize: dimensions.width * 0.043,
                  fontFamily: fontSfProTextRegular,
                  color: '#151515',
                  textAlign: 'center',
                  fontWeight: 600,
                }}>
                Try again
              </Text>
            </TouchableOpacity>

            <Image
              source={require('../assets/images/rainbowGameImages/gamePersModalImage.png')}
              style={{
                zIndex: 10,
                height: dimensions.height * 0.5,
                bottom: -dimensions.height * 0.03,
                alignSelf: 'center',
                position: 'absolute',
                width: dimensions.width * 0.5,
              }}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      </Modal>
    </View >
  );
};

export default RainbowLepreGameScreen;
