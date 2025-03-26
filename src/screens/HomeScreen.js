import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import SettingsScreen from './SettingsScreen';
import BerlinPlaceDetailsScreen from './BerlinPlaceDetailsScreen';
import BerlinWishlistsScreen from './BerlinWishlistsScreen';
import CasScreen from './CasScreen';
import LoadingBerlinTravelHelperScreen from './LoadingBerlinTravelHelperScreen';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import CatchScreen from './CatchScreen';
import RainbowCalendarScreen from './RainbowCalendarScreen';

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
  {
    rainbowScreen: 'Game',
    rainbowWhiteIcon: require('../assets/icons/rainbowButtons/gameIcon.png'),
    rainbowScreenTitle: 'Game',
  },
  {
    rainbowScreen: 'Settings',
    rainbowWhiteIcon: require('../assets/icons/rainbowButtons/settingsIcon.png'),
    rainbowScreenTitle: 'Settings',
  },
];

const fontSfProTextRegular = 'SFProText-Regular';
const fontDMSansRegular = 'DMSans-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedRainbowScreen, setSelectedRainbowScreen] = useState('Home');

  const [selectedDay, setSelectedDay] = useState(new Date());
  const [rainbowHabbits, setRainbowHabbits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [rainbHabitTitle, setRainbHabitTitle] = useState('');

  const [rainbExecutionFrequencies, setRainbExecutionFrequencies] = useState('');
  const [rainbSkipBy, setRainbSkipBy] = useState('');
  const [isRainbReminder, setIsRainbReminder] = useState(false);
  const [rainbReminderTime, setRainbReminderTime] = useState(new Date());
  const [isHabitVisible, setIsHabitVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isRainbowNotificationEnabled, setRainbowNotificationEnabled] = useState(true);
  const [isRainbowGameStarted, setIsRainbowGameStarted] = useState(false);

  const rainbowScrollViewRef = useRef(null);

  const loadRainbowSettings = async () => {
    try {
      const notificationRainbowValue = await AsyncStorage.getItem('isRainbowNotificationEnabled');

      if (notificationRainbowValue !== null) setRainbowNotificationEnabled(JSON.parse(notificationRainbowValue));
    } catch (error) {
      console.error("Error loading notificationRainbowValue:", error);
    }
  };

  useEffect(() => {
    loadRainbowSettings();
  }, [isRainbowNotificationEnabled, selectedRainbowScreen]);

  useEffect(() => {
    if (rainbowScrollViewRef.current) {
      rainbowScrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [selectedDay]);

  const handleBerlWlistImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('Berlin Travel Helper ImagePicker Error: ', response.error);
      } else {
        setCoverImage(response.assets[0].uri);
      }
    });
  };

  const handleDeleteRainbowHabitImage = () => {
    Alert.alert(
      "Delete image",
      "Really delete image of your habit?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            setCoverImage('');
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    console.log('rainbowHabbits', rainbowHabbits);
  }, [setRainbowHabbits,]);

  const saveRainbowHabbit = async () => {
    try {
      const existingRainbowHabbits = await AsyncStorage.getItem('rainbowHabbits');
      const rainbowHabbits = existingRainbowHabbits ? JSON.parse(existingRainbowHabbits) : [];

      const maxRainbHabitId = rainbowHabbits.length > 0 ? Math.max(...rainbowHabbits.map(bwList => bwList.id)) : 0;

      const newBerlinWishlist = {
        id: maxRainbHabitId + 1,
        image: coverImage,
        title: rainbHabitTitle,
        executionFrequencies: rainbExecutionFrequencies,
        skipBy: rainbSkipBy,
        isReminder: isRainbReminder,
        reminderTime: rainbReminderTime,
        date: selectedDay,
        status: 'not done'
      };

      rainbowHabbits.unshift(newBerlinWishlist);

      setRainbowHabbits(rainbowHabbits);

      await AsyncStorage.setItem('rainbowHabbits', JSON.stringify(rainbowHabbits));

      setModalVisible(false);
      setCoverImage('');
      setRainbHabitTitle('');
      setRainbExecutionFrequencies('');
      setRainbSkipBy('');
      setIsRainbReminder(false);
      setRainbReminderTime(new Date());

    } catch (error) {
      console.error('Error saving checklist', error);
    }
  };

  useEffect(() => {
    const loadRainbowHabbits = async () => {
      try {
        const existingRainbowHabbits = await AsyncStorage.getItem('rainbowHabbits');
        if (existingRainbowHabbits) {
          setRainbowHabbits(JSON.parse(existingRainbowHabbits));
        }
      } catch (error) {
        console.error('Error loading rainbowHabbits', error);
      }
    };

    loadRainbowHabbits();
  }, [rainbowHabbits, selectedRainbowScreen]);

  useEffect(() => {
    console.log('selectedDay', selectedDay);
  }, [selectedDay]);

  const toggleReminderSwitch = () => {
    const newValue = !isRainbReminder;
    setIsRainbReminder(newValue);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const now = new Date();
      if (selectedDay.toDateString() === now.toDateString()) {
        if (selectedTime < now) {
          setRainbReminderTime(now);
          return;
        }
      }
      setRainbReminderTime(selectedTime);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedHabit) return;

    // Зберігаємо попередній статус вибраної звички для визначення delta
    const wasDone = selectedHabit.status === 'done';

    const updatedHabits = rainbowHabbits.map(habit => {
      if (habit.id === selectedHabit.id) {
        const newStatus = habit.status === 'done' ? 'not done' : 'done';
        return { ...habit, status: newStatus };
      }
      return habit;
    });
    setRainbowHabbits(updatedHabits);

    try {
      await AsyncStorage.setItem('rainbowHabbits', JSON.stringify(updatedHabits));

      // Отримуємо поточне значення rainbowSeries (як число)
      const currentSeriesString = await AsyncStorage.getItem('rainbowSeries');
      const currentSeries = currentSeriesString ? parseInt(currentSeriesString, 10) : 0;

      // Якщо звичка переходить з not done -> done (wasDone === false), додаємо 1,
      // якщо з done -> not done (wasDone === true), віднімаємо 1.
      const delta = wasDone ? -1 : 1;
      const newSeries = currentSeries + delta;
      await AsyncStorage.setItem('rainbowSeries', newSeries.toString());

      setIsHabitVisible(false);
    } catch (error) {
      console.error('Error updating habit status', error);
    }
  };

  useEffect(() => {
    const scheduleMidnightUpdate = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = nextMidnight - now;

      const timerId = setTimeout(async () => {
        const updatedHabits = rainbowHabbits.map(habit => ({ ...habit, status: 'done' }));
        setRainbowHabbits(updatedHabits);
        try {
          await AsyncStorage.setItem('rainbowHabbits', JSON.stringify(updatedHabits));
        } catch (error) {
          console.error('Error updating habits at midnight', error);
        }
        setSelectedDay(new Date(nextMidnight));
        scheduleMidnightUpdate();
      }, msUntilMidnight);

      return timerId;
    };

    const timerId = scheduleMidnightUpdate();
    return () => clearTimeout(timerId);
  }, [rainbowHabbits]);

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#268A42',
      width: dimensions.width
    }}>

      {selectedRainbowScreen === 'Home' ? (
        <View style={{
          width: dimensions.width,
          height: dimensions.height,
        }}>
          <SafeAreaView style={{
            width: dimensions.width,
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1AAC4B',
          }}>
            {isHabitVisible ? (
              <TouchableOpacity
                onPress={() => {
                  setIsHabitVisible(false);
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
                  textAlign: 'center',
                  fontFamily: fontDMSansRegular,
                  fontWeight: 700,
                  fontSize: dimensions.width * 0.061,
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  color: 'white',

                }}
                >
                  Info
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{
                textAlign: 'center',
                fontFamily: fontDMSansRegular,
                fontWeight: 700,
                fontSize: dimensions.width * 0.061,
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingLeft: dimensions.width * 0.05,
                color: 'white',
                paddingBottom: dimensions.height * 0.014,
              }}
              >
                Habit Tracking
              </Text>
            )}

          </SafeAreaView>

          {!isHabitVisible ? (
            <>
              <View style={{
                marginVertical: dimensions.height * 0.01,
              }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: dimensions.width,
                    alignSelf: 'center',
                    paddingLeft: dimensions.width * 0.05,
                  }}
                  contentContainerStyle={{
                    paddingRight: dimensions.width * 0.1,
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    marginRight: dimensions.width * 0.25,
                  }}>
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return {
                        date,
                        day: date.getDate(),
                        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                      };
                    }).map((dateObj, index) => {
                      const isSelected = dateObj.date.toDateString() === selectedDay.toDateString();
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedDay(dateObj.date)}
                          style={{
                            backgroundColor: isSelected ? '#FDB938' : '#1AAC4B',
                            borderRadius: dimensions.width * 0.1,
                            width: dimensions.width * 0.16,
                            height: dimensions.height * 0.1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: dimensions.width * 0.016,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontSfProTextRegular,
                              textAlign: 'center',
                              fontSize: dimensions.width * 0.037,
                              fontWeight: 700,
                              color: isSelected ? '#393E42' : 'white',
                              opacity: 0.55,

                            }}
                          >
                            {dateObj.dayOfWeek}
                          </Text>
                          <Text
                            style={{
                              fontFamily: fontSfProTextRegular,
                              textAlign: 'center',
                              fontSize: dimensions.width * 0.043,
                              fontWeight: 700,
                              color: isSelected ? '#393E42' : 'white',
                              marginTop: dimensions.height * 0.004,
                            }}
                          >
                            {dateObj.day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {rainbowHabbits.filter(habit => {
                const habitDay = new Date(habit.date);
                habitDay.setHours(0, 0, 0, 0);
                const selectedDayOnly = new Date(selectedDay);
                selectedDayOnly.setHours(0, 0, 0, 0);
                if (habitDay.getTime() < selectedDayOnly.getTime()) return false;
                if (habit.status === 'done') return false;
                if (habit.skipBy && habit.skipBy.trim() !== '') {
                  const selectedDayFull = selectedDay.toLocaleDateString('en-US', { weekday: 'long' });
                  if (selectedDayFull === habit.skipBy) return false;
                }
                return true;
              }).length === 0 ? (
                <View style={{
                  width: dimensions.width,
                  height: dimensions.height * 0.77,
                  alignSelf: 'center',
                  justifyContent: 'flex-end',
                }}>
                  <View style={{
                    width: dimensions.width * 0.9,
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: dimensions.height * 0.1,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontSfProTextRegular,
                        textAlign: 'center',
                        fontSize: dimensions.width * 0.046,
                        fontWeight: 400,
                        color: 'white',
                        paddingHorizontal: dimensions.width * 0.1,
                        bottom: -dimensions.height * 0.07,
                      }}
                    >
                      There are no habits here yet, it's time to create one!
                    </Text>

                    <Image
                      source={require('../assets/images/homePersImage.png')}
                      style={{
                        width: dimensions.width * 0.4,
                        height: dimensions.height * 0.4,
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.05,
                      }}
                      resizeMode='contain'
                    />
                  </View>
                </View>
              ) : (
                <>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                      width: dimensions.width,
                      alignSelf: 'center',
                    }}
                    contentContainerStyle={{
                      paddingBottom: dimensions.height * 0.25,
                    }}
                  >
                    <View style={{
                      width: dimensions.width * 0.93,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      marginTop: dimensions.height * 0.021,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                      <Image
                        source={require('../assets/images/userHasHabitsImage.png')}
                        style={{
                          width: dimensions.width * 0.17,
                          height: dimensions.height * 0.064,
                        }}
                        resizeMode='stretch'
                      />

                      <View style={{
                        marginLeft: dimensions.width * 0.03,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            textAlign: 'left',
                            fontSize: dimensions.width * 0.037,
                            fontWeight: 700,
                            color: 'white',
                            alignSelf: 'flex-start',
                          }}
                        >
                          You have {rainbowHabbits.filter(habit => {
                            const habitDay = new Date(habit.date);
                            habitDay.setHours(0, 0, 0, 0);
                            const selectedDayOnly = new Date(selectedDay);
                            selectedDayOnly.setHours(0, 0, 0, 0);
                            if (habitDay.getTime() < selectedDayOnly.getTime()) return false;
                            if (habit.status === 'done') return false;
                            if (habit.skipBy && habit.skipBy.trim() !== '') {
                              const selectedDayFull = selectedDay.toLocaleDateString('en-US', { weekday: 'long' });
                              if (selectedDayFull === habit.skipBy) return false;
                            }
                            return true;
                          }).length} unfulfilled habit{rainbowHabbits.length > 1 ? 's' : ''}
                        </Text>

                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            textAlign: 'left',
                            fontSize: dimensions.width * 0.034,
                            fontWeight: 400,
                            color: 'white',
                            alignSelf: 'flex-start',
                            marginTop: dimensions.height * 0.01,
                          }}
                        >
                          Fulfill all to continue the rainbow streak
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: dimensions.height * 0.03 }}></View>

                    {rainbowHabbits.filter(habit => {
                      const habitDay = new Date(habit.date);
                      habitDay.setHours(0, 0, 0, 0);
                      const selectedDayOnly = new Date(selectedDay);
                      selectedDayOnly.setHours(0, 0, 0, 0);
                      if (habitDay.getTime() < selectedDayOnly.getTime()) return false;
                      if (habit.status === 'done') return false;
                      if (habit.skipBy && habit.skipBy.trim() !== '') {
                        const selectedDayFull = selectedDay.toLocaleDateString('en-US', { weekday: 'long' });
                        if (selectedDayFull === habit.skipBy) return false;
                      }
                      return true;
                    }).map((rainbowHabit, index) => (
                      <View key={rainbowHabit.id} style={{
                        width: dimensions.width * 0.93,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        marginBottom: dimensions.height * 0.016,
                        backgroundColor: '#1AAC4B',
                        borderRadius: dimensions.width * 0.04,
                        paddingHorizontal: dimensions.width * 0.04,
                        paddingVertical: dimensions.height * 0.016,
                        alignItems: 'center',
                      }}>
                        <Image
                          source={{ uri: rainbowHabit.image }}
                          style={{
                            width: dimensions.width * 0.25,
                            height: dimensions.width * 0.25,
                            borderRadius: dimensions.width * 0.03,
                          }}
                          resizeMode='stretch'
                        />

                        <Image
                          source={rainbowHabit.isReminder
                            ? require('../assets/images/rainbowReminderImage.png')
                            : require('../assets/images/rainbowNonReminderImage.png')
                          }
                          style={{
                            width: dimensions.width * 0.048,
                            height: dimensions.width * 0.048,
                            zIndex: 50,
                            position: 'absolute',
                            top: dimensions.height * 0.016,
                            right: dimensions.width * 0.037,
                          }}
                          resizeMode='contain'
                        />

                        <View style={{
                          marginLeft: dimensions.width * 0.04,
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          alignSelf: 'flex-start',
                        }}>
                          <View style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1
                          }}>
                            <Text
                              style={{
                                fontFamily: fontSfProTextRegular,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontSize: dimensions.width * 0.046,
                                color: 'white',
                                fontWeight: 700,
                                maxWidth: dimensions.width * 0.5,
                              }}
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {rainbowHabit.title}
                            </Text>

                            <Text
                              style={{
                                fontFamily: fontSfProTextRegular,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontSize: dimensions.width * 0.04,
                                fontWeight: 400,
                                color: 'white',
                                marginTop: dimensions.height * 0.01,
                                maxWidth: dimensions.width * 0.5,
                              }}
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {rainbowHabit.executionFrequencies}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              setSelectedHabit(rainbowHabit);
                              setIsHabitVisible(true);
                            }}
                            style={{
                              backgroundColor: '#FDB938',
                              borderRadius: dimensions.width * 0.5,
                              height: dimensions.height * 0.043,
                              alignItems: 'center',
                              justifyContent: 'center',
                              alignSelf: 'flex-start',
                              width: dimensions.width * 0.4,
                            }}>
                            <Text
                              style={{
                                fontFamily: fontSfProTextRegular,
                                textAlign: 'center',
                                fontSize: dimensions.width * 0.04,
                                fontWeight: 400,
                                color: '#393E42',
                              }}
                            >
                              Read more
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                  </ScrollView>
                </>
              )}
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  position: 'absolute',
                  bottom: dimensions.height * 0.14,
                  right: dimensions.width * 0.05,
                  alignSelf: 'flex-end',
                }}>
                <Image
                  source={require('../assets/images/plusImage.png')}
                  style={{
                    width: dimensions.width * 0.19,
                    height: dimensions.width * 0.19,

                  }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={{
                width: dimensions.width * 0.93,
                alignSelf: 'center',
                backgroundColor: '#1AAC4B',
                borderRadius: dimensions.width * 0.04,
                paddingHorizontal: dimensions.width * 0.04,
                paddingVertical: dimensions.height * 0.016,
                marginTop: dimensions.height * 0.016,
              }}>
                <Image
                  source={{ uri: selectedHabit?.image }}
                  style={{
                    width: dimensions.width * 0.84,
                    height: dimensions.height * 0.21,
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.03,
                  }}
                  resizeMode='stretch'
                />

                <View style={{
                  width: dimensions.width * 0.16,
                  marginTop: dimensions.height * 0.019,
                  height: dimensions.height * 0.025,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FDB938',
                  borderRadius: dimensions.width * 0.5,
                }}>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.032,
                    color: 'white',
                  }}
                  >
                    {selectedHabit?.executionFrequencies}
                  </Text>
                </View>

                <View style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: dimensions.height * 0.019,
                  paddingHorizontal: dimensions.width * 0.0104,
                }}>
                  <Text style={{
                    textAlign: 'left',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.048,
                    maxWidth: dimensions.width * 0.7,
                    color: 'white',
                  }}
                  >
                    {selectedHabit?.title}
                  </Text>

                  <Image
                    source={selectedHabit?.isReminder
                      ? require('../assets/images/rainbowReminderImage.png')
                      : require('../assets/images/rainbowNonReminderImage.png')
                    }
                    style={{
                      width: dimensions.width * 0.048,
                      height: dimensions.width * 0.048,
                      alignSelf: 'flex-start'
                    }}
                    resizeMode='contain'
                  />
                </View>

                {selectedHabit?.skipBy !== '' && (
                  <Text style={{
                    textAlign: 'flex-start',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.04,
                    alignItems: 'left',
                    paddingLeft: dimensions.width * 0.01,
                    color: 'white',
                    marginTop: dimensions.height * 0.014,
                  }}
                  >
                    Skip by {selectedHabit?.skipBy}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handleMarkAsDone}
                  style={{
                    width: dimensions.width * 0.84,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    height: dimensions.height * 0.059,
                    borderRadius: dimensions.width * 0.5,
                    backgroundColor: '#B71F1D',
                    marginTop: dimensions.height * 0.019,
                  }}>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.037,
                    color: 'white',
                  }}
                  >
                    Mark as done
                  </Text>
                </TouchableOpacity>

              </View>
            </>
          )}
        </View>
      ) : selectedRainbowScreen === 'Settings' ? (
        <SettingsScreen setSelectedRainbowScreen={setSelectedRainbowScreen} isRainbowNotificationEnabled={isRainbowNotificationEnabled} setRainbowNotificationEnabled={setRainbowNotificationEnabled}
        />
      ) : selectedRainbowScreen === 'Game' ? (
        <CatchScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} isRainbowGameStarted={isRainbowGameStarted} setIsRainbowGameStarted={setIsRainbowGameStarted}
        />
      ) : selectedRainbowScreen === 'Calendar' ? (
        <RainbowCalendarScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : selectedRainbowScreen === 'Checklists' ? (
        <BerlinWishlistsScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : selectedRainbowScreen === 'LoadingBerlin' ? (
        <LoadingBerlinTravelHelperScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : null}

      {selectedRainbowScreen !== 'LoadingBerlin' && !(selectedRainbowScreen === 'Game' && isRainbowGameStarted) && (
        <View
          style={{
            width: dimensions.width,
            bottom: 0,
            height: dimensions.height * 0.12,
            paddingHorizontal: dimensions.width * 0.03,
            flexDirection: 'row',
            backgroundColor: '#1AAC4B',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: dimensions.height * 0.016,
            alignSelf: 'center',
            zIndex: 5000,
            paddingBottom: dimensions.height * 0.025,
            position: 'absolute',
          }}
        >
          {homeRainbowScreensButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRainbowScreen(button.rainbowScreen)}
              style={{
                borderRadius: dimensions.width * 0.07,
                padding: dimensions.height * 0.019,
                alignItems: 'center',
                marginHorizontal: dimensions.width * 0.001,
                backgroundColor: selectedRainbowScreen === button.rainbowScreen ? '#268A42' : 'transparent',
                width: dimensions.width * 0.23,
                height: dimensions.height * 0.088,
              }}
            >
              <Image
                source={button.rainbowWhiteIcon}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: dimensions.width * 0.034,
                  color: 'white',
                  fontFamily: fontDMSansRegular,
                  marginTop: dimensions.height * 0.008,
                }}
              >
                {button.rainbowScreenTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            zIndex: 1000,
            alignSelf: 'center',
            width: '100%',
            paddingHorizontal: dimensions.width * 0.05,
            width: dimensions.width,
            backgroundColor: '#268A42',
            height: dimensions.height,
            alignItems: 'center',
          }}
        >
          <SafeAreaView style={{
            width: dimensions.width,
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1AAC4B',
          }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setCoverImage('');
                setRainbHabitTitle('');
                setRainbExecutionFrequencies('');
                setRainbSkipBy('');
                setIsRainbReminder(false);
                setRainbReminderTime(new Date());
              }}
              style={{
                borderRadius: dimensions.width * 0.5,
                zIndex: 100,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingLeft: dimensions.width * 0.01,
                paddingBottom: dimensions.height * 0.014,
              }}>
              <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
              <Text style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: dimensions.width * 0.05,
                alignItems: 'center',
                fontFamily: fontDMSansRegular,
                alignSelf: 'center',
                marginLeft: dimensions.width * 0.01,
              }}
              >
                New habit
              </Text>
            </TouchableOpacity>
          </SafeAreaView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: dimensions.height * 0.01,
              width: dimensions.width,
              alignSelf: 'center',
            }}
            contentContainerStyle={{
              paddingBottom: dimensions.height * 0.1,
            }}
          >
            <Text style={{
              color: 'white',
              fontFamily: fontDMSansRegular,
              alignSelf: 'flex-start',
              fontWeight: 500,
              fontSize: dimensions.width * 0.043,
              textAlign: 'left',
              marginLeft: dimensions.width * 0.03,
            }}
            >
              Cover
            </Text>
            <View style={{
              width: dimensions.width * 0.93,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
              {coverImage === '' || !coverImage ? (
                <TouchableOpacity
                  onPress={() => handleBerlWlistImagePicker()}
                  style={{
                    marginTop: dimensions.height * 0.01,
                    borderRadius: dimensions.width * 0.037,
                    alignSelf: 'center',
                    width: dimensions.width * 0.93,
                    height: dimensions.width * 0.41,
                    backgroundColor: 'white',
                  }}>
                  <Image
                    source={require('../assets/icons/redPlusIcon.png')}
                    style={{
                      width: dimensions.width * 0.07,
                      height: dimensions.width * 0.07,
                      alignSelf: 'center',
                      position: 'absolute',
                      top: '40%',
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteRainbowHabitImage();
                  }}
                  style={{
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                  }}>
                  <Image
                    source={{ uri: coverImage }}
                    style={{
                      height: dimensions.width * 0.41,
                      borderRadius: dimensions.width * 0.037,
                      alignSelf: 'center',
                      width: dimensions.width * 0.93,
                    }}
                    resizeMode='stretch'
                  />
                  <Image
                    source={require('../assets/icons/redRainbowMinusIcon.png')}
                    style={{
                      width: dimensions.width * 0.07,
                      height: dimensions.width * 0.07,
                      alignSelf: 'center',
                      position: 'absolute',
                      top: '40%',
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              )}

              <Text style={{
                color: 'white',
                fontFamily: fontDMSansRegular,
                alignSelf: 'flex-start',
                fontWeight: 500,
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
                marginTop: dimensions.height * 0.025,
              }}
              >
                Title
              </Text>
              <TextInput
                placeholder="Title"
                value={rainbHabitTitle}
                onChangeText={setRainbHabitTitle}
                placeholderTextColor="#B8B8B8"
                style={{
                  marginTop: dimensions.height * 0.01,
                  color: '#393E42',
                  justifyContent: 'space-between',
                  paddingHorizontal: dimensions.width * 0.04,
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.03,
                  width: dimensions.width * 0.93,
                  height: dimensions.height * 0.052,
                  flexDirection: 'row',
                  fontFamily: fontDMSansRegular,
                  fontSize: rainbHabitTitle.length === 0 ? dimensions.width * 0.035 : dimensions.width * 0.039,
                  fontWeight: 400,
                  textAlign: 'left',
                  alignItems: 'center',
                }}
              />

              <Text style={{
                color: 'white',
                marginTop: dimensions.height * 0.03,
                fontFamily: fontDMSansRegular,
                alignSelf: 'flex-start',
                fontWeight: 500,
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
              }}
              >
                Execution frequencies
              </Text>

              <View style={{
                width: dimensions.width * 0.93,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: dimensions.height * 0.01,
                alignItems: 'center',
                alignSelf: 'center',
              }}>
                {['Daily', 'Weekly', 'Monthly'].map((status, index) => (
                  <TouchableOpacity
                    onPress={() => setRainbExecutionFrequencies(status)}
                    key={index}
                    style={{
                      height: dimensions.height * 0.048,
                      backgroundColor: rainbExecutionFrequencies === status ? '#B71F1D' : 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: dimensions.width * 0.3,
                      borderRadius: dimensions.width * 0.5,
                      marginTop: dimensions.height * 0.01,
                      alignSelf: 'center',
                    }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontFamily: fontDMSansRegular,
                      fontWeight: 400,
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'left',
                      color: rainbExecutionFrequencies === status ? 'white' : '#151515',
                    }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{
                color: 'white',
                marginTop: dimensions.height * 0.03,
                fontFamily: fontDMSansRegular,
                alignSelf: 'flex-start',
                fontWeight: 500,
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
              }}
              >
                Skip by (optional)
              </Text>

              <View style={{
                width: dimensions.width * 0.93,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginTop: dimensions.height * 0.01,
                alignItems: 'center',
                alignSelf: 'center',
                flexWrap: 'wrap',
              }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((skipBy, index) => (
                  <TouchableOpacity
                    onPress={() => setRainbSkipBy(skipBy)}
                    key={index}
                    style={{
                      height: dimensions.height * 0.048,
                      backgroundColor: rainbSkipBy === skipBy ? '#B71F1D' : 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: dimensions.width * 0.04,
                      borderRadius: dimensions.width * 0.5,
                      marginTop: dimensions.height * 0.01,
                      alignSelf: 'center',
                      marginRight: dimensions.width * 0.01,
                    }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontFamily: fontDMSansRegular,
                      fontWeight: 400,
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'left',
                      color: rainbSkipBy === skipBy ? 'white' : '#151515',
                    }}
                    >
                      {skipBy}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{
                width: dimensions.width * 0.93,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.03,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                }}>
                  <Image
                    source={require('../assets/icons/rainbowReminderIcon.png')}
                    style={{
                      width: dimensions.width * 0.07,
                      height: dimensions.width * 0.07,
                      alignSelf: 'center',
                    }}
                    resizeMode='contain'
                  />
                  <Text style={{
                    alignSelf: 'center',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.041,
                    textAlign: 'left',
                    color: 'white',
                    marginLeft: dimensions.width * 0.03,
                  }}
                  >
                    Remind about meals
                  </Text>
                </View>

                <Switch
                  trackColor={{ false: '#948ea1', true: '#B71F1D' }}
                  thumbColor={'white'}
                  ios_backgroundColor="#3E3E3d"
                  onValueChange={toggleReminderSwitch}
                  value={isRainbReminder}
                />
              </View>
            </View>

            {isRainbReminder && (
              <DateTimePicker
                value={rainbReminderTime || new Date()}
                mode="time"
                display="spinner"
                textColor='white'
                zIndex={1000}
                onChange={(event, selectedTime) => {
                  handleTimeChange(event, selectedTime);
                }}
                style={{
                  width: dimensions.width * 0.9,
                  fontSize: dimensions.width * 0.03,
                  alignSelf: 'center',
                }}
                themeVariant='dark' //worked on ios only
              />
            )}

            <TouchableOpacity
              disabled={rainbHabitTitle === '' || rainbExecutionFrequencies === '' || coverImage === '' || !coverImage}
              onPress={saveRainbowHabbit}
              style={{
                alignSelf: 'center',
                width: dimensions.width * 0.93,
                height: dimensions.height * 0.064,
                borderRadius: dimensions.width * 0.037,
                marginTop: dimensions.height * 0.025,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: rainbHabitTitle === '' || rainbExecutionFrequencies === '' || coverImage === '' || !coverImage ? 0.5 : 1,
                backgroundColor: rainbHabitTitle === '' || rainbExecutionFrequencies === '' || coverImage === '' || !coverImage ? '#ffffff80' : '#B71F1D',
              }}
            >
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  fontSize: dimensions.width * 0.037,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Save habbit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
