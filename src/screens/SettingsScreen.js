import React, { useState } from 'react';
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

const TermsAndPrivacyRainbowBtns = [
    {
        id: 2,
        rainbBtnTitle: 'Privacy Policy',
        rainbBtnLink: 'https://www.termsfeed.com/live/edd432d7-2a16-49cb-9148-7fce17efab7a',
        rainbBtnImage: require('../assets/images/settingsImages/privacyImage.png'),
    },
    {
        id: 1,
        rainbBtnTitle: 'Terms of Use',
        rainbBtnLink: 'https://www.termsfeed.com/live/82d96387-bda9-4975-82d5-72240a86bdb0',
        rainbBtnImage: require('../assets/images/settingsImages/termsOfUseImage.png'),
    },
]

const SettingsScreen = ({ selectedRainbowScreen, isRainbowNotificationEnabled, setRainbowNotificationEnabled, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const toggleRainbNotificationSwitch = () => {
        handleRainbowNotificationSwitch();

        const newValue = !isRainbowNotificationEnabled;
        setRainbowNotificationEnabled(newValue);
        saveRainbowSettings('isRainbowNotificationEnabled', newValue);
    };
    const saveRainbowSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving rainbow settings:", error);
        }
    };

    return (
        <View style={{
            width: '100%',
            flex: 1,
            zIndex: 1,
            width: dimensions.width,
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'flex-start',
        }}>
            <SafeAreaView style={{
                backgroundColor: '#1AAC4B',
                marginBottom: dimensions.height * 0.01,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                width: dimensions.width,
            }}>
                <Text style={{
                    alignSelf: 'flex-start',
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.061,
                    alignItems: 'center',
                    color: 'white',
                    paddingBottom: dimensions.height * 0.014,
                    fontFamily: fontSfProTextRegular,
                    paddingLeft: dimensions.width * 0.05,
                    textAlign: 'center',
                }}
                >
                    Settings
                </Text>
            </SafeAreaView>

            <View style={{
                borderBottomColor: 'rgba(153, 153, 153, 0.7)',
                justifyContent: 'space-between',
                paddingVertical: dimensions.height * 0.019,
                marginBottom: dimensions.height * 0.008,
                borderBottomWidth: dimensions.height * 0.001,
                flexDirection: 'row',
                width: dimensions.width * 0.9,
                alignItems: 'center',
            }}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
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
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.043,
                            marginLeft: dimensions.width * 0.03,
                            textAlign: 'center',
                            fontFamily: fontSfProTextRegular,
                        }}>
                        Notifications
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: '#948ea0', true: '#FDB938' }}
                    thumbColor={'white'}
                    ios_backgroundColor="#3E3E3E"
                    onValueChange={toggleRainbNotificationSwitch}
                    value={isRainbowNotificationEnabled}
                />
            </View>

            {TermsAndPrivacyRainbowBtns.map((button) => (
                <TouchableOpacity
                    key={button.id}
                    onPress={() => {
                        Linking.openURL(button.rainbBtnLink);
                    }}
                    style={{
                        justifyContent: 'space-between',
                        borderRadius: dimensions.width * 0.034,
                        flexDirection: 'row',
                        borderBottomWidth: dimensions.height * 0.001,
                        width: dimensions.width * 0.93,
                        paddingHorizontal: dimensions.width * 0.015,
                        alignSelf: 'center',
                        paddingVertical: dimensions.height * 0.019,
                        marginBottom: dimensions.height * 0.008,
                        alignItems: 'center',
                        borderBottomColor: 'rgba(153, 153, 153, 0.7)',
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image
                            source={button.rainbBtnImage}
                            style={{
                                height: dimensions.height * 0.03,
                                width: dimensions.height * 0.03,
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                marginLeft: dimensions.width * 0.03,
                                textAlign: 'center',
                                color: 'white',
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.043,
                                fontWeight: 400,
                            }}>
                            {button.rainbBtnTitle}
                        </Text>
                    </View>
                    <ChevronRightIcon size={dimensions.height * 0.03} color='white' />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SettingsScreen;
