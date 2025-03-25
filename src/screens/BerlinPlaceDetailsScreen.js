import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontDMSansRegular = 'DMSans-Regular';

const BerlinPlaceDetailsScreen = ({ setSelectedBerlinScreen, selectedBerlinScreen, selectedPlace, selectedBerlinPlace }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
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

    const handleVisited = async (favourite) => {
        try {
            const visitedPlaces = await AsyncStorage.getItem('visited');
            const parsedPlaces = visitedPlaces ? JSON.parse(visitedPlaces) : [];

            const visitedPlaceIndex = parsedPlaces.findIndex((fav) => fav.id === favourite.id);

            if (visitedPlaceIndex === -1) {
                const updatedVisited = [favourite, ...parsedPlaces];
                await AsyncStorage.setItem('visited', JSON.stringify(updatedVisited));
                setVisited(updatedVisited);
            } else {
                const updatedVisited = parsedPlaces.filter((fav) => fav.id !== favourite.id);
                await AsyncStorage.setItem('visited', JSON.stringify(updatedVisited));
                setVisited(updatedVisited);
            }
        } catch (error) {
            console.error('Error mark like visited place:', error);
        }
    };

    const isVisited = (place) => {
        return visited.some((vis) => vis.id === place.id);
    };

    return (
        <SafeAreaView style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: dimensions.width,
            zIndex: 1,
            position: 'relative',
        }} >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'center',
                paddingBottom: dimensions.height * 0.01,
                width: dimensions.width * 0.9,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedBerlinScreen('Home');
                    }}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                    <ChevronLeftIcon size={dimensions.height * 0.034} color='#FF0000' />
                    <Text
                        style={{
                            paddingHorizontal: dimensions.width * 0.012,
                            fontWeight: 400,
                            fontFamily: fontDMSansRegular,
                            fontSize: dimensions.width * 0.05,
                            textAlign: 'left',
                            color: '#FF0000',
                        }}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{
                width: dimensions.width,
                alignSelf: 'center',
            }} showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: dimensions.height * 0.16,
                }}
            >
                <Image
                    source={selectedBerlinPlace?.bthImage}
                    style={{
                        borderTopRightRadius: 0,
                        height: dimensions.height * 0.23,
                        marginTop: dimensions.height * 0.02,
                        borderRadius: dimensions.width * 0.055555,
                        width: dimensions.width,
                        borderTopLeftRadius: 0,
                        alignSelf: 'center',
                    }}
                    resizeMode='stretch'
                />

                <Text
                    style={{
                        marginTop: dimensions.height * 0.012,
                        color: 'white',
                        fontWeight: 600,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        fontFamily: fontDMSansRegular,
                        paddingHorizontal: dimensions.width * 0.05,
                        fontSize: dimensions.width * 0.055,
                    }}>
                    {selectedBerlinPlace?.bthTitle}
                </Text>

                <Text
                    style={{
                        marginTop: dimensions.height * 0.016,
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontFamily: fontDMSansRegular,
                        fontSize: dimensions.width * 0.037,
                        alignSelf: 'flex-start',
                        fontWeight: 400,
                        paddingHorizontal: dimensions.width * 0.05,
                        textAlign: 'left',
                    }}>
                    History
                </Text>

                <Text
                    style={{
                        paddingHorizontal: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.01,
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        fontFamily: fontDMSansRegular,
                        fontWeight: 400,
                        color: 'white',
                    }}>
                    {selectedBerlinPlace?.bthHistory}
                </Text>

                <Text
                    style={{
                        marginTop: dimensions.height * 0.016,
                        color: 'rgba(255, 255, 255, 0.5)',
                        textAlign: 'left',
                        fontSize: dimensions.width * 0.037,
                        alignSelf: 'flex-start',
                        fontWeight: 400,
                        paddingHorizontal: dimensions.width * 0.05,
                        fontFamily: fontDMSansRegular,
                    }}>
                    Address
                </Text>

                <Text
                    style={{
                        marginTop: dimensions.height * 0.005,
                        color: 'white',
                        alignSelf: 'flex-start',
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'left',
                        fontFamily: fontDMSansRegular,
                        paddingHorizontal: dimensions.width * 0.05,
                    }}>
                    {selectedBerlinPlace?.bthAddress}
                </Text>

                <Text
                    style={{
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.037,
                        color: 'rgba(255, 255, 255, 0.5)',
                        marginTop: dimensions.height * 0.016,
                        fontFamily: fontDMSansRegular,
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                        paddingHorizontal: dimensions.width * 0.05,
                    }}>
                    Entrance
                </Text>

                <Text
                    style={{
                        fontWeight: 400,
                        fontFamily: fontDMSansRegular,
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.005,
                        color: 'white',
                    }}>
                    {selectedBerlinPlace?.bthEntrance}
                </Text>

                <Text
                    style={{
                        fontFamily: fontDMSansRegular,
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.016,
                        alignSelf: 'flex-start',
                        fontWeight: 400,
                        paddingHorizontal: dimensions.width * 0.05,
                        textAlign: 'left',
                    }}>
                    Tips
                </Text>

                <Text
                    style={{
                        fontWeight: 400,
                        fontFamily: fontDMSansRegular,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.05,
                        color: 'white',
                        marginTop: dimensions.height * 0.005,
                        fontSize: dimensions.width * 0.04,
                    }}>
                    {selectedBerlinPlace?.bthTips}
                </Text>

                <TouchableOpacity
                    onPress={() => handleVisited(selectedBerlinPlace)}
                    style={{
                        marginTop: dimensions.height * 0.021,
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.059,
                        borderRadius: dimensions.width * 0.034,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: isVisited(selectedBerlinPlace) ? '#848484' : '#FF0000',
                    }}>
                    <Text
                        style={{
                            paddingHorizontal: dimensions.width * 0.05,
                            color: 'white',
                            fontSize: dimensions.width * 0.05,
                            textAlign: 'center',
                            alignSelf: 'center',
                            fontWeight: 600,
                            fontFamily: fontDMSansRegular,
                        }}>
                        Mark as {!isVisited(selectedBerlinPlace) ? 'visited' : 'not visited'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BerlinPlaceDetailsScreen;
