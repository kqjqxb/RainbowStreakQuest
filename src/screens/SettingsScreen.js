import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Linking,
    Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronRightIcon } from 'react-native-heroicons/solid';

const fontSfProTextRegular = 'SFProText-Regular';

const privacyBerlinAndTermsBtns = [
    {
        id: 2,
        title: 'Privacy Policy',
        link: '',
        image: require('../assets/images/settingsImages/privacyImage.png'),
    },
    {
        id: 1,
        title: 'Terms of Use',
        link: '',
        image: require('../assets/images/settingsImages/termsOfUseImage.png'),
    },
]

const SettingsScreen = ({ selectedRainbowScreen, isRainbowNotificationEnabled, setRainbowNotificationEnabled, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));


    const toggleNotificationSwitch = () => {
        const newValue = !isRainbowNotificationEnabled;
        setRainbowNotificationEnabled(newValue);
        saveSettings('isRainbowNotificationEnabled', newValue);
    };
    const saveSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    return (
        <View style={{
            justifyContent: 'flex-start',
            flex: 1,
            zIndex: 1,
            width: '100%',
            alignItems: 'center',
            position: 'relative',
            width: dimensions.width,
        }}>
            <SafeAreaView style={{
                width: dimensions.width,
                alignSelf: 'center',
                marginBottom: dimensions.height * 0.01,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1AAC4B',
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: fontSfProTextRegular,
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.061,
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    paddingLeft: dimensions.width * 0.05,
                    color: 'white',
                    paddingBottom: dimensions.height * 0.014,
                }}
                >
                    Settings
                </Text>
            </SafeAreaView>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: dimensions.height * 0.019,
                marginBottom: dimensions.height * 0.008,
                borderBottomColor: 'rgba(153, 153, 153, 0.7)',
                borderBottomWidth: dimensions.height * 0.001,
                width: dimensions.width * 0.9,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image
                        source={require('../assets/images/settingsImages/notificationsImage.png')}
                        style={{
                            height: dimensions.height * 0.03,
                            width: dimensions.height * 0.03,
                        }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{
                            fontWeight: 400,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: dimensions.width * 0.043,
                            fontFamily: fontSfProTextRegular,
                            marginLeft: dimensions.width * 0.03,
                        }}>
                        Notifications
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: '#948ea0', true: '#FDB938' }}
                    thumbColor={'white'}
                    ios_backgroundColor="#3E3E3E"
                    onValueChange={toggleNotificationSwitch}
                    value={isRainbowNotificationEnabled}
                />
            </View>

            {privacyBerlinAndTermsBtns.map((button) => (
                <TouchableOpacity
                    key={button.id}
                    onPress={() => {
                        Linking.openURL(button.link);
                    }}
                    style={{
                        alignItems: 'center',
                        borderRadius: dimensions.width * 0.034,
                        flexDirection: 'row',
                        paddingVertical: dimensions.height * 0.019,
                        alignSelf: 'center',
                        width: dimensions.width * 0.93,
                        paddingHorizontal: dimensions.width * 0.015,
                        justifyContent: 'space-between',
                        marginBottom: dimensions.height * 0.008,
                        borderBottomColor: 'rgba(153, 153, 153, 0.7)',
                        borderBottomWidth: dimensions.height * 0.001
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image
                            source={button.image}
                            style={{
                                height: dimensions.height * 0.03,
                                width: dimensions.height * 0.03,
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                fontWeight: 400,
                                textAlign: 'center',
                                color: 'white',
                                fontSize: dimensions.width * 0.043,
                                fontFamily: fontSfProTextRegular,
                                marginLeft: dimensions.width * 0.03,
                            }}>
                            {button.title}
                        </Text>
                    </View>
                    <ChevronRightIcon size={dimensions.height * 0.03} color='white' />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SettingsScreen;
