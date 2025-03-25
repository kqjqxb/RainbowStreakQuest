import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import casData from '../components/casData';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontDMSansRegular = 'DMSans-Regular';

const CasScreen = ({  }) => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const [selectedEventCategory, setSelectedEventCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCasi, setSelectedCasi] = useState(null);
  const scrollViewRef = useRef(null);

  const getCasDataByCategory = (category) => {
    switch (category) {
      case 'All':
        return casData;
      case 'Poker':
        return casData.filter(item => item.isPoker);
      case 'Roulette':
        return casData.filter(item => item.isRoulette);
      case 'Slot machines':
        return casData.filter(item => item.IsSlots);
      default:
        return [];
    }
  };

  const casosData = getCasDataByCategory(selectedEventCategory);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedEventCategory]);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#2E2E2E',
      width: dimensions.width
    }}>
      <View style={{
        justifyContent: 'center',
        width: dimensions.width,
        borderBottomWidth: dimensions.height * 0.00055,
        alignSelf: 'center',
        marginBottom: dimensions.height * 0.01,
        alignItems: 'center',
        borderBottomColor: '#FFFFFF80',
      }}>
        <Text style={{
          alignItems: 'center',
          fontFamily: fontDMSansRegular,
          fontWeight: 700,
          fontSize: dimensions.width * 0.05,
          paddingBottom: dimensions.height * 0.014,
          textAlign: 'center',
          alignSelf: 'center',
          color: 'white',
        }}
        >
          Casino
        </Text>
      </View>

      <View style={{
        marginVertical: dimensions.height * 0.01,
      }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <View style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
            {['All', 'Poker', 'Roulette', 'Slot machines'].map((category) => (
              <TouchableOpacity
                key={category}
                style={{
                  height: dimensions.height * 0.05,
                  backgroundColor: selectedEventCategory === category ? '#FF0000' : '#848484',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: dimensions.width * 0.03,
                  borderRadius: dimensions.width * 0.016,
                }}
                onPress={() => {
                  setSelectedEventCategory(`${category}`);
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: dimensions.width * 0.03,
                    fontSize: dimensions.width * 0.043,
                    color: 'white',
                    fontWeight: 400,
                    fontFamily: fontDMSansRegular,
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          alignSelf: 'center',
          marginTop: dimensions.height * 0.01,
        }}
        contentContainerStyle={{
          paddingBottom: dimensions.height * 0.25,
        }}
      >
        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>

          {casosData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedCasi(item);
                setModalVisible(true)
              }}
              style={{
                marginBottom: dimensions.height * 0.021,
                width: dimensions.width * 0.95,
                zIndex: 500,
                alignSelf: 'center',
              }}
            >
              <View style={{
                alignSelf: 'center',
                width: dimensions.width * 0.93,
                height: dimensions.height * 0.25,
                position: 'relative',
              }}>
                <Image
                  source={item.bthImage}
                  style={{
                    borderRadius: dimensions.width * 0.03,
                    alignSelf: 'center',
                    height: dimensions.height * 0.25,
                    textAlign: 'center',
                    width: dimensions.width * 0.93,
                  }}
                  resizeMode="stretch"
                />

                {item.isTop && (
                  <View style={{
                    borderRadius: dimensions.width * 0.019,
                    bottom: dimensions.height * 0.019,
                    backgroundColor: '#FF0000',
                    right: dimensions.width * 0.03,
                    position: 'absolute',
                  }}>
                    <Text
                      style={{
                        fontFamily: fontDMSansRegular,
                        fontSize: dimensions.width * 0.043,
                        color: 'white',
                        maxWidth: dimensions.width * 0.9,
                        padding: dimensions.width * 0.021,
                        fontWeight: 500,
                      }}
                    >
                      Top casino
                    </Text>
                  </View>
                )}
              </View>
              <View style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: dimensions.width * 0.97,
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#2E2E2E',
          width: dimensions.width,
          height: dimensions.height,
        }}>
          <View style={{
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: dimensions.width * 0.9,
          }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ChevronLeftIcon size={dimensions.height * 0.034} color='#FF0000' />
              <Text
                style={{
                  fontWeight: 400,
                  fontFamily: fontDMSansRegular,
                  textAlign: 'left',
                  fontSize: dimensions.width * 0.05,
                  paddingHorizontal: dimensions.width * 0.012,
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
              source={selectedCasi?.bthImage}
              style={{
                borderTopRightRadius: 0,
                height: dimensions.height * 0.23,
                borderRadius: dimensions.width * 0.055555,
                width: dimensions.width,
                marginTop: dimensions.height * 0.02,
                borderTopLeftRadius: 0,
                alignSelf: 'center',
              }}
              resizeMode='stretch'
            />

            {selectedCasi?.isTop && (
              <View style={{
                alignSelf: 'flex-start',
                backgroundColor: '#FF0000',
                marginLeft: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.016,
                borderRadius: dimensions.width * 0.019,
              }}>
                <Text
                  style={{
                    fontFamily: fontDMSansRegular,
                    fontSize: dimensions.width * 0.043,
                    color: 'white',
                    padding: dimensions.width * 0.021,
                    fontWeight: 500,
                  }}
                >
                  Top casino
                </Text>
              </View>
            )}

            <Text
              style={{
                marginTop: dimensions.height * 0.012,
                fontFamily: fontDMSansRegular,
                fontSize: dimensions.width * 0.055,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontWeight: 600,
                paddingHorizontal: dimensions.width * 0.05,
                color: 'white',
              }}>
              {selectedCasi?.bthTitle}
            </Text>

            <Text
              style={{
                fontFamily: fontDMSansRegular,
                paddingHorizontal: dimensions.width * 0.05,
                fontSize: dimensions.width * 0.037,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: dimensions.height * 0.021,
              }}>
              Description
            </Text>

            <Text
              style={{
                fontFamily: fontDMSansRegular,
                marginTop: dimensions.height * 0.01,
                color: 'white',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                alignSelf: 'flex-start',
                paddingHorizontal: dimensions.width * 0.05,
                fontWeight: 400,
              }}>
              {selectedCasi?.bthDescription}
            </Text>

            <Text
              style={{
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontDMSansRegular,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: dimensions.height * 0.021,
                fontSize: dimensions.width * 0.037,
              }}>
              Address
            </Text>

            <Text
              style={{
                fontWeight: 400,
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontFamily: fontDMSansRegular,
                marginTop: dimensions.height * 0.01,
                paddingHorizontal: dimensions.width * 0.05,
                color: 'white',
              }}>
              {selectedCasi?.bthAddress}
            </Text>

            <Text
              style={{
                marginTop: dimensions.height * 0.021,
                fontFamily: fontDMSansRegular,
                fontWeight: 400,
                fontSize: dimensions.width * 0.037,
                textAlign: 'left',
                alignSelf: 'flex-start',
                paddingHorizontal: dimensions.width * 0.05,
                color: 'rgba(255, 255, 255, 0.5)',
              }}>
              Features
            </Text>

            <Text
              style={{
                fontWeight: 400,
                color: 'white',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                alignSelf: 'flex-start',
                marginTop: dimensions.height * 0.01,
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontDMSansRegular,
              }}>
              {selectedCasi?.bthFeatures}
            </Text>

            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: dimensions.height * 0.025,
                fontSize: dimensions.width * 0.037,
                alignSelf: 'flex-start',
                fontWeight: 400,
                textAlign: 'left',
                paddingHorizontal: dimensions.width * 0.05,
                fontFamily: fontDMSansRegular,
              }}>
              Rules
            </Text>

            <Text
              style={{
                marginTop: dimensions.height * 0.01,
                fontFamily: fontDMSansRegular,
                paddingHorizontal: dimensions.width * 0.05,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontSize: dimensions.width * 0.04,
                color: 'white',
                fontWeight: 400,
              }}>
              {selectedCasi?.bthRules}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CasScreen;
