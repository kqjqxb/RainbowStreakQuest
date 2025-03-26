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
import LoadingRainbowStreakScreen from './LoadingRainbowStreakScreen';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import RainbowLepreGameScreen from './RainbowLepreGameScreen';
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
  const [selectedRainbowScreen, setSelectedRainbowScreen] = useState('LoadingRainbow');

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

  const handleRainbowImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('Rainbow ImagePicker catched Error: ', response.error);
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

  const saveRainbowHabbit = async () => {
    try {
      const existingRainbowHabbits = await AsyncStorage.getItem('rainbowHabbits');
      const rainbowHabbits = existingRainbowHabbits ? JSON.parse(existingRainbowHabbits) : [];

      const maxRainbHabitId = rainbowHabbits.length > 0 ? Math.max(...rainbowHabbits.map(bwList => bwList.id)) : 0;

      const newRainbowHabit = {
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

      rainbowHabbits.unshift(newRainbowHabit);

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

  const toggleReminderSwitch = () => {
    const newValue = !isRainbReminder;
    setIsRainbReminder(newValue);
  };

  const handleRainbowTimeChange = (event, selectedTime) => {
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

      const currentSeriesString = await AsyncStorage.getItem('rainbowSeries');
      const currentSeries = currentSeriesString ? parseInt(currentSeriesString, 10) : 0;

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
      width: dimensions.width,
      alignItems: 'center',
      backgroundColor: '#268A42',
      flex: 1,
    }}>
      {selectedRainbowScreen === 'Home' ? (
        <View style={{
          height: dimensions.height,
          width: dimensions.width,
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
                textAlign: 'center',
                fontFamily: fontDMSansRegular,
                fontSize: dimensions.width * 0.061,
                alignItems: 'center',
                alignSelf: 'flex-start',
                paddingLeft: dimensions.width * 0.05,
                fontWeight: 700,
                color: 'white',
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
                    paddingLeft: dimensions.width * 0.05,
                    alignSelf: 'center',
                    width: dimensions.width,
                  }}
                  contentContainerStyle={{
                    paddingRight: dimensions.width * 0.1,
                  }}
                >
                  <View style={{
                    marginRight: dimensions.width * 0.25,
                    alignItems: 'center',
                    width: dimensions.width * 0.9,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    flexDirection: 'row',
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
                            alignItems: 'center',
                            borderRadius: dimensions.width * 0.1,
                            width: dimensions.width * 0.16,
                            height: dimensions.height * 0.1,
                            backgroundColor: isSelected ? '#FDB938' : '#1AAC4B',
                            justifyContent: 'center',
                            marginRight: dimensions.width * 0.016,
                          }}
                        >
                          <Text
                            style={{
                              opacity: 0.55,
                              fontSize: dimensions.width * 0.037,
                              textAlign: 'center',
                              fontWeight: 700,
                              color: isSelected ? '#393E42' : 'white',
                              fontFamily: fontSfProTextRegular,
                            }}
                          >
                            {dateObj.dayOfWeek}
                          </Text>
                          <Text
                            style={{
                              marginTop: dimensions.height * 0.004,
                              textAlign: 'center',
                              color: isSelected ? '#393E42' : 'white',
                              fontSize: dimensions.width * 0.043,
                              fontWeight: 700,
                              fontFamily: fontSfProTextRegular,
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
                  justifyContent: 'flex-end',
                  height: dimensions.height * 0.77,
                  alignSelf: 'center',
                  width: dimensions.width,
                }}>
                  <View style={{
                    bottom: dimensions.height * 0.1,
                    position: 'absolute',
                    alignSelf: 'center',
                    width: dimensions.width * 0.9,
                  }}>
                    <Text
                      style={{
                        bottom: -dimensions.height * 0.07,
                        fontSize: dimensions.width * 0.046,
                        fontWeight: 400,
                        textAlign: 'center',
                        color: 'white',
                        paddingHorizontal: dimensions.width * 0.1,
                        fontFamily: fontSfProTextRegular,
                      }}
                    >
                      There are no habits here yet, it's time to create one!
                    </Text>

                    <Image
                      source={require('../assets/images/homePersImage.png')}
                      style={{
                        marginTop: dimensions.height * 0.05,
                        height: dimensions.height * 0.4,
                        alignSelf: 'flex-start',
                        width: dimensions.width * 0.4,
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
                      justifyContent: 'flex-start',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: dimensions.height * 0.021,
                      width: dimensions.width * 0.93,
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
                        alignSelf: 'flex-start',
                        justifyContent: 'flex-start',
                        marginLeft: dimensions.width * 0.03,
                        alignItems: 'flex-start',
                      }}>
                        <Text
                          style={{
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 700,
                            fontSize: dimensions.width * 0.037,
                            color: 'white',
                            fontFamily: fontSfProTextRegular,
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
                            alignSelf: 'flex-start',
                            fontWeight: 400,
                            color: 'white',
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
                        borderRadius: dimensions.width * 0.04,
                        alignSelf: 'center',
                        marginBottom: dimensions.height * 0.016,
                        paddingVertical: dimensions.height * 0.016,
                        backgroundColor: '#1AAC4B',
                        flexDirection: 'row',
                        paddingHorizontal: dimensions.width * 0.04,
                        width: dimensions.width * 0.93,
                        alignItems: 'center',
                      }}>
                        <Image
                          source={{ uri: rainbowHabit.image }}
                          style={{
                            height: dimensions.width * 0.25,
                            borderRadius: dimensions.width * 0.03,
                            width: dimensions.width * 0.25,
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
                            right: dimensions.width * 0.037,
                            zIndex: 50,
                            position: 'absolute',
                            top: dimensions.height * 0.016,
                            height: dimensions.width * 0.048,
                          }}
                          resizeMode='contain'
                        />

                        <View style={{
                          alignSelf: 'flex-start',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginLeft: dimensions.width * 0.04,
                        }}>
                          <View style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flex: 1
                          }}>
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'left',
                                maxWidth: dimensions.width * 0.5,
                                fontSize: dimensions.width * 0.046,
                                alignSelf: 'flex-start',
                                fontWeight: 700,
                                fontFamily: fontSfProTextRegular,
                              }}
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {rainbowHabit.title}
                            </Text>

                            <Text
                              style={{
                                fontSize: dimensions.width * 0.04,
                                alignSelf: 'flex-start',
                                fontFamily: fontSfProTextRegular,
                                color: 'white',
                                textAlign: 'left',
                                marginTop: dimensions.height * 0.01,
                                fontWeight: 400,
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
                              justifyContent: 'center',
                              width: dimensions.width * 0.4,
                              height: dimensions.height * 0.043,
                              alignItems: 'center',
                              borderRadius: dimensions.width * 0.5,
                              alignSelf: 'flex-start',
                              backgroundColor: '#FDB938',
                            }}>
                            <Text
                              style={{
                                fontWeight: 400,
                                textAlign: 'center',
                                fontFamily: fontSfProTextRegular,
                                color: '#393E42',
                                fontSize: dimensions.width * 0.04,
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
                  alignSelf: 'flex-end',
                  right: dimensions.width * 0.05,
                  bottom: dimensions.height * 0.14,
                  position: 'absolute',
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
                paddingVertical: dimensions.height * 0.016,
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.04,
                backgroundColor: '#1AAC4B',
                width: dimensions.width * 0.93,
                marginTop: dimensions.height * 0.016,
                borderRadius: dimensions.width * 0.04,
              }}>
                <Image
                  source={{ uri: selectedHabit?.image }}
                  style={{
                    borderRadius: dimensions.width * 0.03,
                    height: dimensions.height * 0.21,
                    alignSelf: 'center',
                    width: dimensions.width * 0.84,
                  }}
                  resizeMode='stretch'
                />

                <View style={{
                  height: dimensions.height * 0.025,
                  marginTop: dimensions.height * 0.019,
                  borderRadius: dimensions.width * 0.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FDB938',
                  width: dimensions.width * 0.16,
                }}>
                  <Text style={{
                    fontWeight: 400,
                    fontFamily: fontDMSansRegular,
                    fontSize: dimensions.width * 0.032,
                    color: 'white',
                    textAlign: 'center',
                  }}
                  >
                    {selectedHabit?.executionFrequencies}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  marginTop: dimensions.height * 0.019,
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal: dimensions.width * 0.0104,
                }}>
                  <Text style={{
                    maxWidth: dimensions.width * 0.7,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.048,
                    textAlign: 'left',
                    fontFamily: fontDMSansRegular,
                    color: 'white',
                    maxWidth: dimensions.width * 0.77,
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
                    marginTop: dimensions.height * 0.014,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.04,
                    alignItems: 'left',
                    textAlign: 'flex-start',
                    paddingLeft: dimensions.width * 0.01,
                    color: 'white',
                    fontFamily: fontDMSansRegular,
                  }}
                  >
                    Skip by {selectedHabit?.skipBy}
                  </Text>
                )}

                <TouchableOpacity
                  // onPress={handleMarkAsDone}
                  onPress={() => {handleCompleteHabbit()}}
                  style={{
                    height: dimensions.height * 0.059,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.019,
                    justifyContent: 'center',
                    borderRadius: dimensions.width * 0.5,
                    backgroundColor: '#B71F1D',
                    width: dimensions.width * 0.84,
                  }}>
                  <Text style={{
                    color: 'white',
                    fontFamily: fontDMSansRegular,
                    fontSize: dimensions.width * 0.037,
                    fontWeight: 400,
                    textAlign: 'center',
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
        <RainbowLepreGameScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} isRainbowGameStarted={isRainbowGameStarted} setIsRainbowGameStarted={setIsRainbowGameStarted}
        />
      ) : selectedRainbowScreen === 'Calendar' ? (
        <RainbowCalendarScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : selectedRainbowScreen === 'LoadingRainbow' ? (
        <LoadingRainbowStreakScreen setSelectedRainbowScreen={setSelectedRainbowScreen} selectedRainbowScreen={selectedRainbowScreen} />
      ) : null}

      {selectedRainbowScreen !== 'LoadingRainbow' && !(selectedRainbowScreen === 'Game' && isRainbowGameStarted) && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            height: dimensions.height * 0.12,
            alignSelf: 'center',
            backgroundColor: '#1AAC4B',
            flexDirection: 'row',
            width: dimensions.width,
            paddingBottom: dimensions.height * 0.025,
            alignItems: 'center',
            paddingTop: dimensions.height * 0.016,
            justifyContent: 'space-between',
            zIndex: 5000,
            paddingHorizontal: dimensions.width * 0.03,
          }}
        >
          {homeRainbowScreensButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRainbowScreen(button.rainbowScreen)}
              style={{
                width: dimensions.width * 0.23,
                borderRadius: dimensions.width * 0.07,
                alignItems: 'center',
                height: dimensions.height * 0.088,
                marginHorizontal: dimensions.width * 0.001,
                backgroundColor: selectedRainbowScreen === button.rainbowScreen ? '#268A42' : 'transparent',
                padding: dimensions.height * 0.019,
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
                  marginTop: dimensions.height * 0.008,
                  fontSize: dimensions.width * 0.034,
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontWeight: 600,
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
            paddingHorizontal: dimensions.width * 0.05,
            alignSelf: 'center',
            width: '100%',
            alignItems: 'center',
            width: dimensions.width,
            backgroundColor: '#268A42',
            height: dimensions.height,
            zIndex: 1000,
          }}
        >
          <SafeAreaView style={{
            backgroundColor: '#1AAC4B',
            width: dimensions.width,
            justifyContent: 'center',
            marginBottom: dimensions.height * 0.01,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setRainbSkipBy('');
                setRainbHabitTitle('');
                setRainbExecutionFrequencies('');
                setIsRainbReminder(false);
                setRainbReminderTime(new Date());
                setCoverImage('');
              }}
              style={{
                paddingBottom: dimensions.height * 0.014,
                alignSelf: 'flex-start',
                zIndex: 100,
                justifyContent: 'center',
                flexDirection: 'row',
                borderRadius: dimensions.width * 0.5,
                alignItems: 'center',
                paddingLeft: dimensions.width * 0.01,
              }}>
              <ChevronLeftIcon size={dimensions.height * 0.034} color='white' />
              <Text style={{
                fontFamily: fontDMSansRegular,
                color: 'white',
                fontWeight: 600,
                fontSize: dimensions.width * 0.05,
                alignItems: 'center',
                alignSelf: 'center',
                marginLeft: dimensions.width * 0.01,
                textAlign: 'center',
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
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 500,
              fontSize: dimensions.width * 0.043,
              fontFamily: fontDMSansRegular,
              marginLeft: dimensions.width * 0.03,
              color: 'white',
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
                  onPress={() => handleRainbowImagePicker()}
                  style={{
                    height: dimensions.width * 0.41,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.037,
                    width: dimensions.width * 0.93,
                    marginTop: dimensions.height * 0.01,
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
                      width: dimensions.width * 0.93,
                      alignSelf: 'center',
                      borderRadius: dimensions.width * 0.037,
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
                  flexDirection: 'row',
                  color: '#393E42',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.03,
                  width: dimensions.width * 0.93,
                  alignItems: 'center',
                  fontSize: rainbHabitTitle.length === 0 ? dimensions.width * 0.035 : dimensions.width * 0.039,
                  paddingHorizontal: dimensions.width * 0.04,
                  fontFamily: fontDMSansRegular,
                  marginTop: dimensions.height * 0.01,
                  fontWeight: 400,
                  textAlign: 'left',
                  height: dimensions.height * 0.052,
                }}
              />

              <Text style={{
                color: 'white',
                marginTop: dimensions.height * 0.03,
                fontFamily: fontDMSansRegular,
                fontSize: dimensions.width * 0.043,
                fontWeight: 500,
                textAlign: 'left',
                alignSelf: 'flex-start',
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
                      alignSelf: 'center',
                      borderRadius: dimensions.width * 0.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: dimensions.width * 0.3,
                      height: dimensions.height * 0.048,
                      backgroundColor: rainbExecutionFrequencies === status ? '#B71F1D' : 'white',
                      marginTop: dimensions.height * 0.01,
                    }}>
                    <Text style={{
                      alignSelf: 'center',
                      fontWeight: 400,
                      fontSize: dimensions.width * 0.037,
                      fontFamily: fontDMSansRegular,
                      color: rainbExecutionFrequencies === status ? 'white' : '#151515',
                      textAlign: 'left',
                    }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{
                fontSize: dimensions.width * 0.043,
                fontFamily: fontDMSansRegular,
                alignSelf: 'flex-start',
                fontWeight: 500,
                marginTop: dimensions.height * 0.03,
                textAlign: 'left',
                color: 'white',
              }}
              >
                Skip by (optional)
              </Text>

              <View style={{
                marginTop: dimensions.height * 0.01,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                alignItems: 'center',
                alignSelf: 'center',
                width: dimensions.width * 0.93,
              }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((skipBy, index) => (
                  <TouchableOpacity
                    onPress={() => setRainbSkipBy(skipBy)}
                    key={index}
                    style={{
                      borderRadius: dimensions.width * 0.5,
                      alignSelf: 'center',
                      alignItems: 'center',
                      paddingHorizontal: dimensions.width * 0.04,
                      height: dimensions.height * 0.048,
                      marginTop: dimensions.height * 0.01,
                      marginRight: dimensions.width * 0.01,
                      justifyContent: 'center',
                      backgroundColor: rainbSkipBy === skipBy ? '#B71F1D' : 'white',
                    }}>
                    <Text style={{
                      alignSelf: 'center',
                      color: rainbSkipBy === skipBy ? 'white' : '#151515',
                      fontWeight: 400,
                      fontFamily: fontDMSansRegular,
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'left',
                    }}
                    >
                      {skipBy}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{
                marginTop: dimensions.height * 0.03,
                width: dimensions.width * 0.93,
                alignItems: 'center',
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-between',
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
                    color: 'white',
                    fontFamily: fontDMSansRegular,
                    fontSize: dimensions.width * 0.041,
                    textAlign: 'left',
                    fontWeight: 400,
                    marginLeft: dimensions.width * 0.03,
                    alignSelf: 'center',
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
                  handleRainbowTimeChange(event, selectedTime);
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
                backgroundColor: rainbHabitTitle === '' || rainbExecutionFrequencies === '' || coverImage === '' || !coverImage ? '#ffffff80' : '#B71F1D',
                height: dimensions.height * 0.064,
                borderRadius: dimensions.width * 0.037,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: rainbHabitTitle === '' || rainbExecutionFrequencies === '' || coverImage === '' || !coverImage ? 0.5 : 1,
                width: dimensions.width * 0.93,
                marginTop: dimensions.height * 0.025,
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.037,
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
