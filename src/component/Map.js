import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Linking, Modal, TouchableOpacity, TouchableOpacityComponent } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import * as Location from 'expo-location';
import { findNearest, isPointWithinRadius, latitudeKeys } from 'geolib';
import { Image } from 'expo-image';
import { collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore, realtime } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, update, get, child, equalTo, orderByChild, set  } from "firebase/database";
  // import { getDatabase, ref, query, get, update, child, equalTo, orderByChild } from "firebase/database";


const Map = ({userId, idpos}) => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [pos, setSelectPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bikeLocation, setBikeLocation] = useState([]);
  const navigation = useNavigation();
  const id = idpos;

const posRef = ref(realtime, 'Pos');

  useEffect(() => {
    const fetchPos = () => {
      onValue(posRef, (snapshot) => {
        const data = snapshot.val();
        const posData = Object.keys(data).map(key => ({
          idpos: key,
          latitude: data[key].latitude,
          longitude: data[key].longitude,
          nBike: data[key].nBike,
          name: data[key].name,
        }));
        setPos(posData);
        console.log('Pos data:', posData);
      }, (error) => {
        console.error("Error fetching pos data:", error);
      });
    };
    fetchPos();
  
    // Cleanup listener on unmount
    return () => {
      // Your cleanup code here, if any
    };
  }, [userId]);
  
  useEffect(() => {
    if ((id != 0) && posSepeda.length > 0) {
      const selectedPos = posSepeda.find(pos => pos.idpos === id);
      if (selectedPos) {
        setSelectPos({
          idpos: selectedPos.idpos,
          latitude: selectedPos.latitude,
          longitude: selectedPos.longitude,
          nBike: selectedPos.nBike,
          name: selectedPos.name,
        });
        handleMarkerPress(selectedPos);
      }
    }
  }, [id, posSepeda]);
  

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setUserLocation({ latitude, longitude });

      if (userId == '4BscOBgMJBWOTWsAZbAtdf767Im1') {
        const bikeLocation = { latitude: latitude, longitude: longitude }

        const posRef = ref(realtime, `Bike/1`);
        await update(posRef, { latitude: bikeLocation.latitude, longitude: bikeLocation.longitude });
      }
    };

    
    const intervalId = setInterval(() => {
      getLocation();
      // console.log(userId, 'lokasi:', userLocation)
    }, 3000);

    return () => clearInterval(intervalId);
  }, [userLocation]);


  const handleMarkerPress = (pos) => {
    setSelectedPos(pos);
    setShowModal(true);
  };


  const findNearestBikeStation = () => {
    if (!userLocation) return;
  
    const bikeStations = []
    posSepeda.forEach((pos) => {
      bikeStations.push({
        latitude: pos.latitude,
        longitude: pos.longitude
      })
    })
    const nearestStation = findNearest(userLocation, bikeStations);
    console.log('Nearest bike station:', nearestStation);
  
    const { latitude, longitude } = nearestStation;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${latitude},${longitude}`;
  
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    console.log('Google Maps URL:', googleMapsURL);
  
    // Open the Google Maps URL in a web browser
    Linking.openURL(googleMapsURL);
  };

const bikeRef = ref(realtime, 'Bike');

const getBikeLocation = () => {
    onValue(bikeRef, (snapshot) => {
        const data = snapshot.val();
        const newBikeLocation = [];

        Object.keys(data).forEach(key => {
            const bike = data[key];
            newBikeLocation.push({
                bikeID: key,
                latitude: bike.latitude,
                longitude: bike.longitude,
                rented: bike.rented
            });
        });

        setBikeLocation(newBikeLocation);
        console.log('nwebike',newBikeLocation);
    }, (error) => {
        console.error("Error fetching bike data:", error);
    });
};

useEffect(() => {
    getBikeLocation();

    // Cleanup listener on unmount
}, []);

const updateNumberOfBikeInPos = async () => {
  // const db = getDatabase();

  // Fetch all positions
  // const posRef = ref(db, 'Pos');
  const posSnapshot = await get(posRef);
  const posData = posSnapshot.val();

  if (!posData) {
    return;
  }

  // Convert positions to an array
  const posArray = Object.keys(posData).map(key => ({
    idpos: key,
    ...posData[key]
  }));

  // Fetch all bike locations
  // const bikeRef = ref(db, 'Bike');
  const bikeSnapshot = await get(bikeRef);
  const bikeData = bikeSnapshot.val();

  if (!bikeData) {
    return;
  }

  // Convert bike locations to an array
  const bikeArray = Object.keys(bikeData).map(key => ({
    bikeID: key,
    ...bikeData[key]
  }));

  for (const pos of posArray) {
    const posLocation = { latitude: pos.latitude, longitude: pos.longitude };
    const radius = 10; // 2 meter radius
    let nBike = 0;

    for (const bike of bikeArray) {
      const bikePosition = { latitude: bike.latitude, longitude: bike.longitude };
      if (isPointWithinRadius(bikePosition, posLocation, radius)) {
        nBike++;
      }
    }

    const posRef = ref(realtime, `Pos/${pos.idpos}`);
    await update(posRef, { nBike });
  }
};

  useEffect(() => {
      updateNumberOfBikeInPos();
  }, [bikeLocation]);
  
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* {initialRegion && (
          <Marker
            coordinate={{latitude: -6.929763, longitude: 107.769115}}
            title="Your Location"
            description="You are here!"
            pinColor="blue"
          />
        )} */}
        {userLocation && (
          <Marker
            coordinate={{latitude: userLocation.latitude, longitude: userLocation.longitude}}
            title="User Location"
            description="User is here!"
            pinColor="blue"
          />
        )}
        {bikeLocation && (
          bikeLocation.map((bike, index) => (
            <Marker
              key={index}
              coordinate={{latitude: bike.latitude, longitude: bike.longitude}}
              title={"BikeID: "+bike.bikeID}
              pinColor="red"
            />
          ))
        )}
        {posSepeda.map((pos, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            title={pos.name}
            description={`Bikes Available: ${pos.nBike}`}
            onPress={() => handleMarkerPress(pos)}
          >
            <Image source={require('../../assets/nav/pos.svg')} style={{ width: 40, height: 55, contentFit: "fill" }} />
          </Marker>
        ))}
      </MapView>
      
      <View style={styles.findNearestButtonContainer}>
        <LinearGradient colors={['#D93F1E', '#EC7A01']} style={{padding: 10, borderRadius: 20, width: '80%'}}>
          <TouchableOpacity   onPress={findNearestBikeStation}>
            <Text style={styles.findNearestButtonText}>Tampilkan Pos Terdekat</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>  
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPos && (
              <>
                <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => { setShowModal(false)}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}> X </Text>
                </TouchableOpacity>
                <Text style={styles.modalText}>Pos sepeda: {selectedPos.name}</Text>
                <Text style={styles.modalText}>Jumlah Sepeda: {selectedPos.nBike}</Text>
                
                <View style={[styles.buttonContainer]}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner', {userId}, setShowModal(false))}>
                      <Text style={styles.buttonText}>Scan QR Sepeda</Text>
                    </TouchableOpacity>
                </LinearGradient>      
                          
              </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  findNearestButtonContainer: {
    // Adjusted to fit the text
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 110,
    zIndex: 99999
  },
  findNearestButtonText: {
    fontSize: 14, // Adjusted font size
    color: 'white',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'left',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 5,
    left: 20,
    color: '#0B1A3F',
    fontWeight: 'bold'
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
    borderWidth: 0.5,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: "100%",
  },
});

export default Map;
