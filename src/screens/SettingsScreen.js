import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    SafeAreaView,
    Linking,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  ChevronRightIcon } from 'react-native-heroicons/solid';

const fontDMSansRegular = 'DMSans-Regular';

const privacyBerlinAndTermsBtns = [
    {
        id: 2,
        title: 'Privacy Policy',
        link: '',
    },
    {
        id: 1,
        title: 'Terms of Use',
        link: '',
    },
]

const SettingsScreen = ({ selectedBerlinScreen, favorites, setFavorites }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [firstCurrencyAmount, setFirstCurrencyAmount] = useState('');
    const [secondCurrencyAmount, setSecondCurrencyAmount] = useState('');

    const [firstCurrencyIs, setFirstCurrencyIs] = useState('Dollars ($)');
    const [secondCurrencyIs, setSecondCurrencyIs] = useState('Pound (£)');

    const [firstConvertedResult, setFirstConvertedResult] = useState('');
    const [secondConvertedResult, setSecondConvertedResult] = useState('');

    const [visited, setVisited] = useState([]);

    useEffect(() => {
        const fetchVisitedPlaces = async () => {
            try {
                const saved = await AsyncStorage.getItem('visited');
                setVisited(saved ? JSON.parse(saved) : []);
            } catch (error) {
                console.error('error  visited:', error);
            }
        };

        fetchVisitedPlaces();
    }, [selectedBerlinScreen,]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{
                justifyContent: 'flex-start',
                flex: 1,
                zIndex: 1,
                width: '100%',
                alignItems: 'center',
                position: 'relative',
                width: dimensions.width,
            }}>
                <View style={{
                    marginBottom: dimensions.height * 0.01,
                    borderBottomWidth: dimensions.height * 0.00055,
                    alignSelf: 'center',
                    width: dimensions.width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: '#FFFFFF80',
                }}>
                    <Text style={{
                        fontFamily: fontDMSansRegular,
                        fontWeight: 700,
                        paddingBottom: dimensions.height * 0.014,
                        alignItems: 'center',
                        fontSize: dimensions.width * 0.05,
                        alignSelf: 'center',
                        color: 'white',
                        textAlign: 'center',
                    }}
                    >
                        Settings
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: '100%',
                    }}
                    contentContainerStyle={{
                        paddingBottom: dimensions.height * 0.25,
                    }}
                >
                    <View style={{
                        paddingHorizontal: dimensions.width * 0.04,
                        alignSelf: 'center',
                        backgroundColor: '#404040',
                        borderRadius: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.01,
                        paddingVertical: dimensions.height * 0.016,
                        width: dimensions.width * 0.93,
                    }}>
                        <Image
                            source={require('../assets/images/settingsImage.png')}
                            style={{
                                width: dimensions.width * 0.37,
                                height: dimensions.width * 0.37,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />

                        <Text style={{
                            paddingBottom: dimensions.height * 0.014,
                            alignSelf: 'flex-start',
                            fontFamily: fontDMSansRegular,
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.043,
                            marginTop: dimensions.height * 0.016,
                            color: 'white',
                            textAlign: 'left',
                        }}
                        >
                            Currency Converter
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            alignSelf: 'center',
                            width: '100%',
                        }}>
                            <TextInput
                                placeholder={`${firstCurrencyIs}`}
                                value={firstCurrencyAmount}
                                maxLength={7}
                                onChangeText={(text) => {
                                    setFirstCurrencyAmount(text);
                                    const numericValue = parseFloat(text);
                                    if (isNaN(numericValue)) {
                                        setFirstConvertedResult('');
                                    } else {
                                        if (firstCurrencyIs === 'Dollars ($)') {
                                            setFirstConvertedResult((numericValue * 0.93).toFixed(1));
                                        } else {
                                            setFirstConvertedResult((numericValue * 1.09).toFixed(1));
                                        }
                                    }
                                }}
                                placeholderTextColor="rgba(237, 237, 237, 0.85)"
                                placeholderTextSize={dimensions.width * 0.03}
                                keyboardType='numeric'
                                style={{
                                    maxWidth: dimensions.width * 0.8,
                                    height: dimensions.height * 0.059,
                                    fontFamily: fontDMSansRegular,
                                    fontSize: firstCurrencyAmount.length > 0 ? dimensions.width * 0.043 : dimensions.width * 0.037,
                                    color: 'white',
                                    padding: dimensions.width * 0.03,
                                    alignSelf: 'center',
                                    width: dimensions.width * 0.34,
                                    borderRadius: dimensions.width * 0.025,
                                    backgroundColor: '#5A5A5A',
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    const tempAmount = firstCurrencyAmount;
                                    const tempCurrency = firstCurrencyIs;
                                    setFirstCurrencyAmount(firstConvertedResult);
                                    setFirstConvertedResult(tempAmount);

                                    if (firstCurrencyIs === 'Dollars ($)') {
                                        setFirstCurrencyIs('Euros (€)');
                                    } else setFirstCurrencyIs('Dollars ($)');
                                }}
                                style={{
                                    flex: 1
                                }}>
                                <Image
                                    source={require('../assets/icons/changeIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.088,
                                        height: dimensions.width * 0.088,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode='contain'
                                />

                            </TouchableOpacity>

                            <View style={{
                                paddingHorizontal: dimensions.width * 0.03,
                                height: dimensions.height * 0.059,
                                borderRadius: dimensions.width * 0.025,
                                width: dimensions.width * 0.34,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#5A5A5A',
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: dimensions.width * 0.037,
                                    alignSelf: 'flex-start',
                                    fontFamily: fontDMSansRegular,
                                    fontWeight: 400,
                                    textAlign: 'left',
                                }}>
                                    {firstCurrencyAmount.replace(/\s/g, '').length === 0 && firstCurrencyIs === 'Dollars ($)' ? 'Euros (€)'
                                        : firstCurrencyAmount.replace(/\s/g, '').length === 0 && firstCurrencyIs !== 'Dollars ($)' ? 'Dollars ($)' : firstConvertedResult} {firstCurrencyAmount.replace(/\s/g, '').length !== 0 ? (firstCurrencyIs === 'Dollars ($)' ? '(€)' : '($)') : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            marginTop: dimensions.height * 0.021,
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <TextInput
                                placeholder={`${secondCurrencyIs}`}
                                value={secondCurrencyAmount}
                                maxLength={7}
                                onChangeText={(text) => {
                                    setSecondCurrencyAmount(text);
                                    const numericValue = parseFloat(text);
                                    if (isNaN(numericValue)) {
                                        setSecondConvertedResult('');
                                    } else {
                                        if (secondCurrencyIs === 'Pound (£)') {
                                            setSecondConvertedResult((numericValue * 1.2).toFixed(1));
                                        } else {
                                            setSecondConvertedResult((numericValue * 0.84).toFixed(1));
                                        }
                                    }
                                }}
                                placeholderTextColor="rgba(237, 237, 237, 0.85)"
                                placeholderTextSize={dimensions.width * 0.03}
                                keyboardType='numeric'
                                style={{
                                    backgroundColor: '#5A5A5A',
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontDMSansRegular,
                                    alignSelf: 'center',
                                    color: 'white',
                                    height: dimensions.height * 0.059,
                                    maxWidth: dimensions.width * 0.8,
                                    width: dimensions.width * 0.34,
                                    borderRadius: dimensions.width * 0.025,
                                    fontSize: secondCurrencyAmount.length > 0 ? dimensions.width * 0.043 : dimensions.width * 0.037,
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    const tempAmount = secondCurrencyAmount;
                                    setSecondCurrencyAmount(secondConvertedResult);
                                    setSecondConvertedResult(tempAmount);

                                    if (secondCurrencyIs === 'Pound (£)') {
                                        setSecondCurrencyIs('Euros (€)');
                                    } else setSecondCurrencyIs('Pound (£)');
                                }}
                                style={{
                                    flex: 1
                                }}>
                                <Image
                                    source={require('../assets/icons/changeIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.088,
                                        height: dimensions.width * 0.088,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode='contain'
                                />

                            </TouchableOpacity>

                            <View style={{
                                paddingHorizontal: dimensions.width * 0.03,
                                borderRadius: dimensions.width * 0.025,
                                width: dimensions.width * 0.34,
                                height: dimensions.height * 0.059,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#5A5A5A',
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontWeight: 400,
                                    alignSelf: 'flex-start',
                                    fontFamily: fontDMSansRegular,
                                    fontSize: dimensions.width * 0.037,
                                    textAlign: 'left',
                                }}>
                                    {secondCurrencyAmount.replace(/\s/g, '').length === 0 && secondCurrencyIs === 'Pound (£)' ? 'Euros (€)'
                                        : secondCurrencyAmount.replace(/\s/g, '').length === 0 && secondCurrencyIs !== 'Pound (£)' ? 'Pound (£)' : secondConvertedResult} {secondCurrencyAmount.replace(/\s/g, '').length !== 0 ? (secondCurrencyIs === 'Pound (£)' ? '(€)' : '(£)') : ''}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={{
                        marginTop: dimensions.height * 0.008,
                        width: '100%',
                    }}>
                        {privacyBerlinAndTermsBtns.map((button) => (
                            <TouchableOpacity
                                key={button.id}
                                onPress={() => {
                                    Linking.openURL(button.link);
                                }}
                                style={{
                                    paddingHorizontal: dimensions.width * 0.05,
                                    alignItems: 'center',
                                    borderRadius: dimensions.width * 0.034,
                                    flexDirection: 'row',
                                    paddingVertical: dimensions.height * 0.019,
                                    alignSelf: 'center',
                                    width: dimensions.width * 0.93,
                                    backgroundColor: '#404040',
                                    justifyContent: 'space-between',
                                    marginBottom: dimensions.height * 0.008,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: dimensions.width * 0.043,
                                        fontFamily: fontDMSansRegular,
                                    }}>
                                    {button.title}
                                </Text>
                                <ChevronRightIcon size={dimensions.height * 0.025} color='white' />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={{
                        marginTop: dimensions.height * 0.019,
                        color: 'white',
                        textAlign: 'left',
                        fontWeight: 400,
                        fontFamily: fontDMSansRegular,
                        fontSize: dimensions.width * 0.043,
                        paddingHorizontal: dimensions.width * 0.05,
                        alignSelf: 'flex-start',
                    }}
                    >
                        Visited Places
                    </Text>
                    {visited.length > 0 ? (
                        visited.map((item, index) => (
                            <View
                                key={index}
                                onPress={() => {
                                }}
                                style={{
                                    zIndex: 500,
                                    width: dimensions.width * 0.95,
                                    marginTop: dimensions.height * 0.01,
                                    marginBottom: dimensions.height * 0.021,
                                    alignSelf: 'center',
                                }}
                            >
                                <Image
                                    source={item.bthImage}
                                    style={{
                                        width: dimensions.width * 0.93,
                                        borderRadius: dimensions.width * 0.03,
                                        alignSelf: 'center',
                                        textAlign: 'center',
                                        height: dimensions.height * 0.25,
                                    }}
                                    resizeMode="stretch"
                                />
                                <View style={{
                                    width: dimensions.width * 0.97,
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Text
                                        style={{
                                            maxWidth: dimensions.width * 0.9,
                                            fontSize: dimensions.width * 0.046,
                                            color: 'white',
                                            fontWeight: 600,
                                            padding: dimensions.width * 0.021,
                                            fontFamily: fontDMSansRegular,
                                        }}
                                    >
                                        {item.bthTitle}
                                    </Text>
                                </View>
                            </View>
                        ))

                    ) : (
                        <View style={{
                            marginTop: dimensions.height * 0.01,
                            borderRadius: dimensions.width * 0.034,
                            backgroundColor: '#404040',
                            width: dimensions.width * 0.95,
                            paddingVertical: dimensions.height * 0.019,
                            paddingHorizontal: dimensions.width * 0.16,
                            alignSelf: 'center',
                        }}>
                            <Text style={{
                                fontFamily: fontDMSansRegular,
                                alignSelf: 'center',
                                fontSize: dimensions.width * 0.043,
                                textAlign: 'center',
                                color: 'white',
                                paddingHorizontal: dimensions.width * 0.05,
                                fontWeight: 400,
                            }}
                            >
                                You have no visited places yet
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default SettingsScreen;
