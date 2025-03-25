import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'react-native-image-picker';
import popularSouvenirsData from '../components/popularSouvenirsData';

const fontDMSansRegular = 'DMSans-Regular';


const BerlinWishlistsScreen = ({ setSelectedBerlinScreen, selectedBerlinScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
    const [selectedWishList, setSelectedWishList] = useState(null);
    const [berlinTitle, setBerlinTitle] = useState('');
    const [description, setDescription] = useState('');
    const [berlinWishlists, setBerlinWishlists] = useState([]);
    const [detailsType, setDetailsType] = useState('');
    const wishlistScrollViewRef = useRef(null);

    const [price, setPrice] = useState('');
    const [whereToBuy, setWhereToBuy] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [wishlistImage, setWishlistImage] = useState('');

    const deleteBerlinWishlist = async (checklistToRemove) => {
        try {
            const updatedBerlinWishlists = berlinWishlists.filter(bwList =>
                !(bwList.berlinTitle === checklistToRemove.berlinTitle && bwList.description === checklistToRemove.description && bwList.id === checklistToRemove.id)
            );
            await AsyncStorage.setItem('berlinWishlists', JSON.stringify(updatedBerlinWishlists));
            setBerlinWishlists(updatedBerlinWishlists);
            setModalDetailsVisible(false);
        } catch (error) {
            console.error('Error removing berlin wishlist:', error);
            Alert.alert('Error', 'Failed to remove berlin wishlist from berlinWishlists.');
        }
    };

    const saveBerlinWishlist = async () => {
        try {
            const existingBerlinWishlists = await AsyncStorage.getItem('berlinWishlists');
            const berlinWishlists = existingBerlinWishlists ? JSON.parse(existingBerlinWishlists) : [];

            const maxBerlinId = berlinWishlists.length > 0 ? Math.max(...berlinWishlists.map(bwList => bwList.id)) : 0;

            const newBerlinWishlist = {
                id: maxBerlinId + 1,
                title: berlinTitle,
                description,
                price,
                whereToBuy,
                selectedStatus,
                image: wishlistImage,
            };

            berlinWishlists.unshift(newBerlinWishlist);

            setBerlinWishlists(berlinWishlists);

            await AsyncStorage.setItem('berlinWishlists', JSON.stringify(berlinWishlists));

            setModalVisible(false);
            setBerlinTitle('');
            setDescription('');
            setPrice('');
            setWhereToBuy('');
            setSelectedStatus('');
            setWishlistImage('');

        } catch (error) {
            console.error('Error saving checklist', error);
        }
    };

    useEffect(() => {
        const loadBerlinWishlists = async () => {
            try {
                const existingBerlinWishlists = await AsyncStorage.getItem('berlinWishlists');
                if (existingBerlinWishlists) {
                    setBerlinWishlists(JSON.parse(existingBerlinWishlists));
                }
            } catch (error) {
                console.error('Error loading berlinWishlists', error);
            }
        };

        loadBerlinWishlists();
    }, [berlinWishlists, selectedBerlinScreen]);

    useEffect(() => {
        if (wishlistScrollViewRef.current) {
            wishlistScrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
    }, [modalVisible]);

    const handleBerlWlistImagePicker = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
                console.log('Berlin Travel Helper ImagePicker Error: ', response.error);
            } else {
                setWishlistImage(response.assets[0].uri);
            }
        });
    };

    const handleDeleteBerlWlistImage = () => {
        Alert.alert(
            "Delete image",
            "Are you sure you want to delete image of your wishlist item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        setWishlistImage('');
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{
            width: dimensions.width,
            flex: 1,
            zIndex: 1,
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            alignItems: 'center',
        }} >
            <View style={{
                marginBottom: dimensions.height * 0.01,
                width: dimensions.width,
                alignSelf: 'center',
                borderBottomColor: '#FFFFFF80',
                justifyContent: 'center',
                borderBottomWidth: dimensions.height * 0.00055,
                alignItems: 'center',
            }}>
                <Text style={{
                    alignItems: 'center',
                    fontFamily: fontDMSansRegular,
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.05,
                    textAlign: 'center',
                    color: 'white',
                    paddingBottom: dimensions.height * 0.014,
                    alignSelf: 'center',
                }}
                >
                    Wish-list
                </Text>
            </View>

            <Text style={{
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontDMSansRegular,
                color: 'white',
                fontWeight: 400,
                fontSize: dimensions.width * 0.043,
                marginTop: dimensions.height * 0.016,
                alignSelf: 'flex-start',
                textAlign: 'left',
            }}
            >
                Popular souvenirs
            </Text>

            <ScrollView
                ref={wishlistScrollViewRef}
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: dimensions.height * 0.01,
                    width: '100%',
                }}
                contentContainerStyle={{
                    paddingBottom: dimensions.height * 0.03,
                }}
            >
                {popularSouvenirsData.map((popularSouvenir, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setSelectedWishList(popularSouvenir);
                            setModalDetailsVisible(true);
                            setDetailsType('popularSouvenir');
                        }}
                        style={{
                            alignSelf: 'center',
                            width: dimensions.width * 0.95,
                            marginBottom: dimensions.height * 0.021,
                            zIndex: 500
                        }}
                    >
                        <Image
                            source={popularSouvenir.psdImage}
                            style={{
                                borderRadius: dimensions.width * 0.03,
                                height: dimensions.height * 0.25,
                                alignSelf: 'center',
                                width: dimensions.width * 0.93,
                                textAlign: 'center',
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
                                    color: 'white',
                                    fontFamily: fontDMSansRegular,
                                    maxWidth: dimensions.width * 0.9,
                                    padding: dimensions.width * 0.021,
                                    fontWeight: 600,
                                    fontSize: dimensions.width * 0.046,
                                }}
                            >
                                {popularSouvenir.psdTitle}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={{
                    paddingHorizontal: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.03,
                    fontFamily: fontDMSansRegular,
                    fontWeight: 400,
                    fontSize: dimensions.width * 0.043,
                    alignSelf: 'flex-start',
                    color: 'white',
                    textAlign: 'left',
                    textDecorationLine: 'underline',
                }}
                >
                    Your wish-list:
                </Text>

                {berlinWishlists.length !== 0 ? (
                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        flex: 1,
                        marginTop: dimensions.height * 0.02,
                        marginBottom: dimensions.height * 0.16,
                    }}>
                        {berlinWishlists.map((berlWishlist, index) => (
                            <TouchableOpacity
                                key={berlWishlist.id}
                                onPress={() => {
                                    setSelectedWishList(berlWishlist);
                                    setModalDetailsVisible(true);
                                }}
                                style={{
                                    alignSelf: 'center',
                                    width: dimensions.width * 0.95,
                                    marginBottom: dimensions.height * 0.021,
                                    zIndex: 500
                                }}
                            >
                                <View style={{
                                    position: 'relative',
                                    width: dimensions.width * 0.93,
                                    height: dimensions.height * 0.25,
                                    alignSelf: 'center',
                                }}>
                                    <Image
                                        source={{ uri: berlWishlist.image }}
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
                                        position: 'absolute',
                                        top: dimensions.height * 0.012,
                                        right: dimensions.width * 0.03,
                                        backgroundColor: '#FF0000',
                                        borderRadius: dimensions.width * 0.019,
                                    }}>
                                        <Text
                                            style={{
                                                fontWeight: 400,
                                                fontFamily: fontDMSansRegular,
                                                paddingVertical: dimensions.height * 0.014,
                                                color: 'white',
                                                paddingHorizontal: dimensions.width * 0.025,
                                                fontSize: dimensions.width * 0.037,
                                                maxWidth: dimensions.width * 0.9,
                                            }}
                                        >
                                            {berlWishlist.selectedStatus}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: dimensions.width * 0.97,
                                }}>
                                    <Text
                                        style={{
                                            maxWidth: dimensions.width * 0.9,
                                            fontSize: dimensions.width * 0.046,
                                            color: 'white',
                                            padding: dimensions.width * 0.021,
                                            fontFamily: fontDMSansRegular,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {berlWishlist.title}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => { setModalVisible(true) }}
                            style={{
                                marginTop: dimensions.height * 0.025,
                                alignItems: 'center',
                                height: dimensions.height * 0.07,
                                backgroundColor: '#FF0000',
                                borderRadius: dimensions.width * 0.037,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                width: dimensions.width * 0.88,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fontDMSansRegular,
                                    fontSize: dimensions.width * 0.044,
                                    color: 'white',
                                    fontWeight: 700,
                                }}
                            >
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{
                        width: dimensions.width * 0.95,
                        paddingHorizontal: dimensions.width * 0.05,
                        backgroundColor: '#404040',
                        borderRadius: dimensions.width * 0.034,
                        paddingVertical: dimensions.height * 0.025,
                        marginTop: dimensions.height * 0.02,
                        alignSelf: 'center',
                    }}>
                        <Text
                            style={{
                                fontSize: dimensions.width * 0.05,
                                fontFamily: fontDMSansRegular,
                                color: 'white',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontWeight: 700,
                                paddingHorizontal: dimensions.width * 0.14,
                            }}>
                            You have no wish lists added
                        </Text>

                        <TouchableOpacity
                            onPress={() => { setModalVisible(true) }}
                            style={{
                                alignSelf: 'center',
                                height: dimensions.height * 0.07,
                                backgroundColor: '#FF0000',
                                borderRadius: dimensions.width * 0.037,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: dimensions.height * 0.025,
                                width: dimensions.width * 0.88,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: fontDMSansRegular,
                                    fontSize: dimensions.width * 0.044,
                                    color: 'white',
                                    fontWeight: 700,

                                }}
                            >
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <SafeAreaView
                    style={{
                        zIndex: 1000,
                        alignSelf: 'center',
                        width: '100%',
                        paddingHorizontal: dimensions.width * 0.05,
                        width: dimensions.width,
                        backgroundColor: '#2E2E2E',
                        height: dimensions.height,
                        alignItems: 'center',
                    }}
                >
                    <View style={{
                        paddingBottom: dimensions.height * 0.01,
                        zIndex: 50,
                        borderBottomColor: '#FFFFFF80',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: dimensions.width,
                        paddingHorizontal: dimensions.width * 0.019,
                        borderBottomWidth: dimensions.height * 0.00055,
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                            }}
                            style={{
                                borderRadius: dimensions.width * 0.5,
                                zIndex: 100,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ChevronLeftIcon size={dimensions.height * 0.034} color='#FF0000' />
                            <Text style={{
                                textAlign: 'center',
                                color: '#FF0000',
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.043,
                                alignItems: 'center',
                                fontFamily: fontDMSansRegular,
                                alignSelf: 'center',
                            }}
                            >
                                Back
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        ref={wishlistScrollViewRef}
                        showsVerticalScrollIndicator={false}
                        style={{
                            marginTop: dimensions.height * 0.01,
                            width: '100%',
                        }}
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.1,
                        }}
                    >
                        <View style={{
                            width: dimensions.width * 0.93,
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}>
                            {wishlistImage === '' || !wishlistImage ? (
                                <TouchableOpacity
                                    onPress={() => handleBerlWlistImagePicker()}
                                    style={{
                                        marginTop: dimensions.height * 0.01,
                                        borderRadius: dimensions.width * 0.5,
                                        alignSelf: 'center',
                                        width: dimensions.width * 0.4,
                                        height: dimensions.width * 0.4,
                                        backgroundColor: '#404040',
                                    }}>
                                    <Image
                                        source={require('../assets/images/deleteWishlistImage.png')}
                                        style={{
                                            width: dimensions.width * 0.16,
                                            height: dimensions.width * 0.16,
                                            alignSelf: 'center',
                                            position: 'absolute',
                                            top: '30%',
                                        }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleDeleteBerlWlistImage();
                                    }}
                                    style={{
                                        alignSelf: 'center',
                                        marginTop: dimensions.height * 0.01,
                                    }}>
                                    <Image
                                        source={{ uri: wishlistImage }}
                                        style={{
                                            height: dimensions.width * 0.4,
                                            borderRadius: dimensions.width * 0.5,
                                            alignSelf: 'center',
                                            width: dimensions.width * 0.4,
                                        }}
                                        resizeMode='stretch'
                                    />
                                    <Image
                                        source={require('../assets/images/deleteWishlistImage.png')}
                                        style={{
                                            width: dimensions.width * 0.16,
                                            height: dimensions.width * 0.16,
                                            alignSelf: 'center',
                                            position: 'absolute',
                                            top: '30%',
                                        }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            )}
                            <TextInput
                                placeholder="Title"
                                value={berlinTitle}
                                onChangeText={setBerlinTitle}
                                placeholderTextColor="#FFFFFF80"
                                style={{
                                    marginTop: dimensions.height * 0.01,
                                    color: 'white',
                                    justifyContent: 'space-between',
                                    paddingVertical: dimensions.width * 0.035,
                                    paddingHorizontal: dimensions.width * 0.04,
                                    backgroundColor: '#404040',
                                    borderRadius: dimensions.width * 0.03,
                                    width: '100%',
                                    flexDirection: 'row',
                                    fontFamily: fontDMSansRegular,
                                    fontSize: dimensions.width * 0.041,
                                    fontWeight: 400,
                                    textAlign: 'left',
                                    alignItems: 'center',
                                }}
                            />

                            <TextInput
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor="#FFFFFF80"
                                style={{
                                    height: dimensions.height * 0.16,
                                    alignItems: 'center',
                                    paddingVertical: dimensions.width * 0.035,
                                    backgroundColor: '#404040',
                                    borderRadius: dimensions.width * 0.03,
                                    width: '100%',
                                    textAlign: 'left',
                                    marginTop: dimensions.height * 0.01,
                                    fontFamily: fontDMSansRegular,
                                    color: 'white',
                                    fontSize: dimensions.width * 0.041,
                                    paddingHorizontal: dimensions.width * 0.04,
                                    fontWeight: 400,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                                multiline={true}
                                textAlign='flex-start'
                            />

                            <TextInput
                                placeholder="Price"
                                keyboardType='numeric'
                                value={price}
                                onChangeText={setPrice}
                                placeholderTextColor="#FFFFFF80"
                                style={{
                                    fontWeight: 400,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: dimensions.width * 0.035,
                                    paddingHorizontal: dimensions.width * 0.04,
                                    borderRadius: dimensions.width * 0.03,
                                    fontSize: dimensions.width * 0.041,
                                    color: 'white',
                                    marginTop: dimensions.height * 0.01,
                                    backgroundColor: '#404040',
                                    fontFamily: fontDMSansRegular,
                                    textAlign: 'left',
                                    width: '100%',
                                }}
                            />

                            <TextInput
                                placeholder="Where to buy"
                                value={whereToBuy}
                                onChangeText={setWhereToBuy}
                                placeholderTextColor="#FFFFFF80"
                                style={{
                                    paddingVertical: dimensions.width * 0.035,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    textAlign: 'left',
                                    paddingHorizontal: dimensions.width * 0.04,
                                    alignItems: 'center',
                                    backgroundColor: '#404040',
                                    width: '100%',
                                    color: 'white',
                                    fontFamily: fontDMSansRegular,
                                    fontSize: dimensions.width * 0.041,
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 400,
                                    borderRadius: dimensions.width * 0.03,
                                }}
                            />

                            <Text style={{
                                color: 'white',
                                marginTop: dimensions.height * 0.03,
                                fontFamily: fontDMSansRegular,
                                alignSelf: 'flex-start',
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.043,
                                textAlign: 'left',
                            }}
                            >
                                Status
                            </Text>

                            {['Purchased', 'I want to buy'].map((status, index) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedStatus(status)}
                                    key={index}
                                    style={{
                                        borderWidth: selectedStatus === status ? dimensions.width * 0.01 : 0,
                                        backgroundColor: '#404040',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: dimensions.width * 0.93,
                                        borderRadius: dimensions.width * 0.034,
                                        marginTop: dimensions.height * 0.01,
                                        height: dimensions.height * 0.059,
                                        borderColor: '#FF0000',
                                        alignSelf: 'center',
                                    }}>
                                    <Text style={{
                                        alignSelf: 'center',
                                        fontFamily: fontDMSansRegular,
                                        fontWeight: 400,
                                        fontSize: dimensions.width * 0.043,
                                        textAlign: 'left',
                                        paddingHorizontal: dimensions.width * 0.05,
                                        color: 'white',
                                    }}
                                    >
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                        </View>

                        <TouchableOpacity
                            disabled={berlinTitle === '' || description === '' || price === '' || whereToBuy === '' || selectedStatus === '' || wishlistImage === '' || !wishlistImage}
                            onPress={saveBerlinWishlist}
                            style={{
                                alignSelf: 'center',
                                width: dimensions.width * 0.93,
                                height: dimensions.height * 0.064,
                                borderRadius: dimensions.width * 0.037,
                                marginTop: dimensions.height * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: berlinTitle === '' || description === '' ? 0.5 : 1,
                                backgroundColor: berlinTitle === '' || description === '' || price === '' || whereToBuy === '' || selectedStatus === '' || wishlistImage === '' || !wishlistImage ? '#939393' : '#FF0000',
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
                                Done
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDetailsVisible}
                onRequestClose={() => {
                    setModalDetailsVisible(!modalDetailsVisible);
                }}
            >
                <SafeAreaView style={{
                    flex: 1,
                    backgroundColor: '#2E2E2E',
                    width: dimensions.width,
                    height: dimensions.height,
                }}>
                    <View style={{
                        paddingBottom: dimensions.height * 0.014,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: dimensions.width * 0.9,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalDetailsVisible(false);
                                setDetailsType('');
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ChevronLeftIcon size={dimensions.height * 0.034} color='#FF0000' />
                            <Text
                                style={{
                                    fontFamily: fontDMSansRegular,
                                    color: '#FF0000',
                                    fontSize: dimensions.width * 0.05,
                                    textAlign: 'left',
                                    fontWeight: 400,
                                    paddingHorizontal: dimensions.width * 0.012,
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
                            source={detailsType === 'popularSouvenir'
                                ? selectedWishList?.psdImage
                                : { uri: selectedWishList?.image }}
                            style={{
                                borderTopRightRadius: 0,
                                borderTopLeftRadius: 0,
                                height: dimensions.height * 0.34,
                                borderRadius: dimensions.width * 0.055555,
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.02,
                                width: dimensions.width,
                            }}
                            resizeMode='stretch'
                        />

                        {detailsType !== 'popularSouvenir' && (
                            <View style={{
                                borderRadius: dimensions.width * 0.019,
                                marginTop: dimensions.height * 0.021,
                                alignSelf: 'flex-start',
                                marginLeft: dimensions.width * 0.05,
                                backgroundColor: '#FF0000',
                            }}>
                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.04,
                                        fontFamily: fontDMSansRegular,
                                        maxWidth: dimensions.width * 0.9,
                                        color: 'white',
                                        paddingHorizontal: dimensions.width * 0.03,
                                        paddingVertical: dimensions.height * 0.014,
                                        fontWeight: 400,
                                    }}
                                >
                                    {selectedWishList?.selectedStatus}
                                </Text>
                            </View>
                        )}

                        <Text
                            style={{
                                marginTop: dimensions.height * 0.012,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: dimensions.width * 0.075,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontFamily: fontDMSansRegular,
                                paddingHorizontal: dimensions.width * 0.05,
                            }}>
                            {detailsType === 'popularSouvenir' ? selectedWishList?.psdTitle : selectedWishList?.title}
                        </Text>

                        <Text
                            style={{
                                alignSelf: 'flex-start',
                                fontFamily: fontDMSansRegular,
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginTop: dimensions.height * 0.021,
                                paddingHorizontal: dimensions.width * 0.05,
                                textAlign: 'left',
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.037,
                            }}>
                            Description
                        </Text>

                        <Text
                            style={{
                                marginTop: dimensions.height * 0.01,
                                color: 'white',
                                fontSize: dimensions.width * 0.04,
                                fontFamily: fontDMSansRegular,
                                alignSelf: 'flex-start',
                                fontWeight: 400,
                                paddingHorizontal: dimensions.width * 0.05,
                                textAlign: 'left',
                            }}>
                            {detailsType === 'popularSouvenir' ? selectedWishList?.psdDescription : selectedWishList?.description}
                        </Text>

                        <Text
                            style={{
                                marginTop: dimensions.height * 0.021,
                                color: 'rgba(255, 255, 255, 0.5)',
                                textAlign: 'left',
                                fontSize: dimensions.width * 0.037,
                                alignSelf: 'flex-start',
                                fontWeight: 400,
                                paddingHorizontal: dimensions.width * 0.05,
                                fontFamily: fontDMSansRegular,
                            }}>
                            Price
                        </Text>

                        <Text
                            style={{
                                marginTop: dimensions.height * 0.01,
                                color: 'white',
                                fontSize: dimensions.width * 0.04,
                                paddingHorizontal: dimensions.width * 0.05,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontWeight: 400,
                                fontFamily: fontDMSansRegular,
                            }}>
                            {detailsType === 'popularSouvenir' ? selectedWishList?.psdPrice : selectedWishList?.price} €
                        </Text>

                        <Text
                            style={{
                                paddingHorizontal: dimensions.width * 0.05,
                                marginTop: dimensions.height * 0.021,
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: dimensions.width * 0.037,
                                fontWeight: 400,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontFamily: fontDMSansRegular,
                            }}>
                            Where to buy
                        </Text>

                        <Text
                            style={{
                                marginTop: dimensions.height * 0.01,
                                paddingHorizontal: dimensions.width * 0.05,
                                fontSize: dimensions.width * 0.04,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                color: 'white',
                                fontWeight: 400,
                                fontFamily: fontDMSansRegular,
                            }}>
                            {detailsType === 'popularSouvenir' ? selectedWishList?.psdWhereToBuy : selectedWishList?.whereToBuy}
                        </Text>

                        {detailsType !== 'popularSouvenir' && (
                            <TouchableOpacity
                                disabled={false}
                                onPress={() => {
                                    deleteBerlinWishlist(selectedWishList);
                                }}
                                style={{
                                    marginTop: dimensions.height * 0.025,
                                    height: dimensions.height * 0.064,
                                    backgroundColor: '#FF0000',
                                    alignSelf: 'center',
                                    borderRadius: dimensions.width * 0.037,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: dimensions.width * 0.93,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 700,
                                        fontFamily: fontDMSansRegular,
                                        fontSize: dimensions.width * 0.05,
                                        color: 'white',
                                    }}
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default BerlinWishlistsScreen;
