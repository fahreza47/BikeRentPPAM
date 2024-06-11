import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { firestore, firebaseAuth } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const BarcodeScanner = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const {userId} = route.params;
  const currentUser = route.params.userId

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    setCameraActive(false);

    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setScanned(false);
      setCameraActive(true);
      return;
    }

    const bikeID = data;
    const userID = currentUser;
    const currentTimestamp = Timestamp.now();

    try {
      // Query for the rental document where bikeID matches and rentalEnd is null
      const rentalQuery = query(
        collection(firestore, 'Rental'),
        where('bikeID', '==', bikeID),
        where('rentalEnd', '==', null)
      );

      const querySnapshot = await getDocs(rentalQuery);

      if (!querySnapshot.empty) {
        let documentUpdated = false;
        const updateDocuments = querySnapshot.docs.map(async (doc) => {
          if (doc.data().userID === userID) {
            await updateDoc(doc.ref, { rentalEnd: currentTimestamp });
            const bikeRef = collection(firestore, "bike")
            const bikeQuery = query(bikeRef, where("bikeID", "==", bikeID))
            const bikeSnapshot = await getDocs(bikeQuery);
            await updateDoc(bikeSnapshot.docs[0].ref, { rented: false })
            // const bikeSnapshot1 = await get(bikeRef);
            // const bikeData1 = bikeSnapshot.val();
            //   // Convert bike locations to an array
            // const bikeArray = Object.keys(bikeData).map(key => ({
            //   bikeID: key,
            //   ...bikeData[key]
            // }));

            

            documentUpdated = true;

            const notificationRef = await addDoc(collection(firestore, 'notifikasi'), {
              message: "You have ended rental on bike " + bikeID,
              timeStamp: currentTimestamp,
              userId: userID
            })

            Alert.alert('Rental ended!', `Bike ID: ${bikeID}\nRental ID: ${doc.id}\nRental ended successfully.`);
            
            let timeStart = doc.data().rentalStart;
            let timeEnd = currentTimestamp;
            let time = Math.abs(timeEnd - timeStart);

            time = Math.floor(time);
            navigation.navigate('Payment', {userId: userID, time: time, timeEnd: timeEnd});
          }
        });

        await Promise.all(updateDocuments);

        if (!documentUpdated) {
          Alert.alert('Error', 'You can only end your own rental.');
        }
      } else {
        // If no matching document is found, create a new rental document
        const rentalDocRef = await addDoc(collection(firestore, 'Rental'), {
          bikeID,
          userID,
          rentalStart: currentTimestamp,
          rentalEnd: null,
        });

        const bikeRef = collection(firestore, "bike")
        const bikeQuery = query(bikeRef, where("bikeID", "==", bikeID))
        const bikeSnapshot = await getDocs(bikeQuery);
        await updateDoc(bikeSnapshot.docs[0].ref, { rented: true })

        const notificationRef = await addDoc(collection(firestore, 'notifikasi'), {
          message: "You have started rental on bike " + bikeID,
          timeStamp: currentTimestamp,
          userId: userID
        })



        Alert.alert('Rental started!', `Bike ID: ${bikeID}\nRental ID: ${rentalDocRef.id}`);
        navigation.navigate('Home', {userId: currentUser});
      }
    } catch (error) {
      console.error("Error handling barcode scan: ", error);
      Alert.alert('Error', 'There was an error processing your request.');
    }

  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.middleContainer}>
              <View style={styles.sideOverlay} />
              <View style={styles.box} />
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay} />
          </View>
        </View>
      )}
    </View>
  );
};

const overlayColor = 'rgba(0, 0, 0, 0.5)'; // Color of the overlay with opacity
const windowWidth = Dimensions.get('window').width; // Width of the camera view
const windowHeight = Dimensions.get('window').height; // Height of the camera view
const boxWidth = 250; // Width of the clear box
const boxHeight = 250; // Height of the clear box

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: windowWidth,
    backgroundColor: overlayColor,
  },
  middleContainer: {
    flexDirection: 'row',
  },
  sideOverlay: {
    width: (windowWidth - boxWidth) / 2,
    height: boxHeight,
    backgroundColor: overlayColor,
  },
  box: {
    width: boxWidth,
    height: boxHeight,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 1,
    width: windowWidth,
    backgroundColor: overlayColor,
  },
  scannedData: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});

export default BarcodeScanner;
