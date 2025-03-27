import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadRainbowUser = async () => {
      try {
        const storedRainbowUser = await AsyncStorage.getItem('currentUser');
        if (storedRainbowUser) {
          setUser(JSON.parse(storedRainbowUser));
        }
      } catch (error) {
        console.error('Error loading storedRainbowUser data:', error);
      }
    };
    loadRainbowUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
