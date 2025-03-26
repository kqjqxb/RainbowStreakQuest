import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';

const Stack = createNativeStackNavigator();

const RainbowStreakQuestStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, setUser } = useContext(UserContext);

  const [initializingRainbowStreakApp, setInitializingRainbowStreakApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadRainbowStreakUser = async () => {
      try {
        const rainbowStreakDeviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${rainbowStreakDeviceId}`;
        const storedRainbowStreakUser = await AsyncStorage.getItem(storageKey);

        if (storedRainbowStreakUser) {
          setUser(JSON.parse(storedRainbowStreakUser));
        } 
      } catch (error) {
        console.error('Error loading of rainbowStreakUser user', error);
      } finally {
        setInitializingRainbowStreakApp(false);
      }
    };
    loadRainbowStreakUser();
  }, [setUser]);

  if (initializingRainbowStreakApp) {
    return (
      <View style={{
        justifyContent: 'center',
        backgroundColor: '#268A42',
        flex: 1,
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#FDB938" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RainbowStreakQuestStack;
