// import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
// import React, { useLayoutEffect, useState } from 'react'
// import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
// import { firestore, storage } from '../config/firebase'
// import { Toast } from 'react-native-toast-notifications'
// import getBlobFromUri from '../utils/getBlobFromUri'
// import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
// import UploadImage from '../component/UploadImage'
// import { Ionicons } from '@expo/vector-icons';
// import Input from '../component/Input';
// import Button from '../component/Button';
// import { Snackbar } from 'react-native-paper';
// import Topbar_2 from '../component/topbar_2'
// // import {Picker} from '@react-native-picker/picker';

// const UpdateProfile = ({ route, navigation }) => {

//   const userId = route.params.userId

//   const [selectedImage, setSelectedImage] = useState('')

//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');

//   const [inputs, setInputs] = useState({
//     fullname: {
//       value: '', isValid: true
//     },
//     nomorTelp: {
//       value: '', isValid: true
//     },
//     umur: {
//       value: '', isValid: true
//     }
//   });

//   const [isLoading, setIsLoading] = useState(false)

//   const inputChangeHandler = (inputIdentifier, enteredValue) => {
//     setInputs((currentInputs) => {
//       return {
//         ...currentInputs,
//         [inputIdentifier]: { value: enteredValue, isValid: true }
//       }
//     })
//   }

//   function uploadImageHandler(imageUri) {
//     setSelectedImage(imageUri)
//   }

//   useLayoutEffect(() => {
//       navigation.setOptions({
//       headerTitle: `Update Profile : ${route.params.fullname}`,
//       headerTintColor: 'white',
//       headerStyle: {
//           backgroundColor: '#164da4'
//       },
//       });
//   }, [route.params])

//   const handleUpdateData = async () => {
//     if (!selectedImage) {
//       const colRef = doc(firestore, "users", userId);
//       const dataUpdate = {
//         fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
//         nomorTelp: inputs.nomorTelp.value ? inputs.nomorTelp.value : route.params.nomorTelp,
//         umur: inputs.umur.value ? inputs.umur.value : route.params.umur,
//       };

//       setIsLoading(true)
//       try {
//         await updateDoc(colRef, dataUpdate);
//         setSnackbarMessage("Profile Updated");
//         setSnackbarVisible(true);
//         navigation.replace("Profile", { userId: userId });
//       } catch (error) {
//         setSnackbarMessage(error);
//         setSnackbarVisible(true);
//       } finally {
//         setIsLoading(false);
//       }

//     } else {
//       const blobFile = await getBlobFromUri(selectedImage)

//       if (selectedImage) {
//         try {
//           const colref = doc(firestore, "users", userId);
//           const docSnapshot = await getDoc(colref);

//           if (docSnapshot.exists()) {
//             const userData = docSnapshot.data();

//             if (userData && userData.imageUri) {
//               const imageUri = userData.imageUri;
//               const imgRef = ref(storage, imageUri);
//               await deleteObject(imgRef);
//               setSnackbarMessage("Delete old image");
//               setSnackbarVisible(true);
//             }
//           }

//           setIsLoading(true)
//           const storagePath = "imgUsers/" + new Date().getTime();
//           const storageRef = ref(storage, storagePath);
//           const uploadTask = uploadBytesResumable(storageRef, blobFile);

//           uploadTask.on("state_changed", (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             switch (snapshot.state) {
//               case 'paused':
//                 setSnackbarMessage("Progress upload" + progress.toFixed(0) + '%');
//                 setSnackbarVisible(true);
//                 break;
//               case 'running':
//                 setSnackbarMessage("Progress upload" + progress.toFixed(0) + '%');
//                 setSnackbarVisible(true);
//                 break;
//               case 'success':
//                 setSnackbarMessage("Progress upload" + progress.toFixed(0) + '%');
//                 setSnackbarVisible(true);
//                 break;
//             }
//           }, (err) => {
//             setSnackbarMessage("Progress upload" + err);
//             setSnackbarVisible(true);
//           }, async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             const colRef = doc(firestore, "users", userId);

//             const dataUpdateWithImage = {
//               fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
//               imageUri: downloadURL,
//               nomorTelp: inputs.nomorTelp.value ? inputs.nomorTelp.value : route.params.nomorTelp,
//               umur: inputs.umur.value ? inputs.umur.value : route.params.umur,
//             };

//             await updateDoc(colRef, dataUpdateWithImage);
//             setSnackbarMessage("Profile updated");
//             setSnackbarVisible(true);
//             navigation.replace("Profile", { userId: userId });
//           });
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }
//   }

//   return (
//     <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: 'white', maxWidth: 480 }}>
//       <Topbar_2 tittle={'UPDATE PROFILE'}/>
//       <UploadImage
//         fullname={route.params.fullname}
//         imageUri={route.params.imageUri}
//         onImageUpload={uploadImageHandler}
//       />
//       <ScrollView>
//         <View style={{ justifyContent: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
//           <Input
//             label="Fullname"
//             invalid={!inputs.fullname.isValid}
//             textInputConfig={{
//               defaultValue: route.params.fullname,
//               onChangeText: inputChangeHandler.bind(this, 'fullname')
//             }}
//           />
//         </View>
//         <View style={{ justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
//           <Input
//             label="No. Telp"
//             invalid={!inputs.nomorTelp.isValid}
//             textInputConfig={{
//               defaultValue: route.params.nomorTelp,
//               onChangeText: inputChangeHandler.bind(this, 'nomorTelp')
//             }}
//           />
//         </View>
//         <View style={{ justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
//           <Input
//             label="Usia"
//             invalid={!inputs.umur.isValid}
//             textInputConfig={{
//               defaultValue: route.params.umur,
//               onChangeText: inputChangeHandler.bind(this, 'umur')
//             }}
//           />
//         </View>
//       </ScrollView>
//       <View style={{ flex: 1, alignItems: 'center', marginTop: 0, width: '100%' }}>
//         <Button onPress={handleUpdateData}>
//           {isLoading ? (
//             <ActivityIndicator color="white" size="large" />
//           ) : (<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Update profile</Text>)}
//         </Button>
//       </View>
//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={2000}
//         style={{backgroundColor: '#ff0e0e', justifyContent: 'center', borderRadius: 29, marginBottom: 10 }}
//       >
//         <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
//           {snackbarMessage}
//         </Text>
//       </Snackbar>
//     </View>
//   )
// }

// export default UpdateProfile

// const styles = StyleSheet.create({})

import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { firestore, storage } from '../config/firebase'
import { Toast } from 'react-native-toast-notifications'
import getBlobFromUri from '../utils/getBlobFromUri'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import UploadImage from '../component/UploadImage'
import { Ionicons } from '@expo/vector-icons';
import Input from '../component/Input';
import Button from '../component/Button';
import { Snackbar } from 'react-native-paper';
import Topbar_2 from '../component/topbar_2'
// import {Picker} from '@react-native-picker/picker';

const UpdateProfile = ({ route, navigation }) => {

  const userId = route.params.userId

  const [selectedImage, setSelectedImage] = useState('')

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [inputs, setInputs] = useState({
    fullname: {
      value: route.params.fullname, isValid: true
    },
    nomorTelp: {
      value: route.params.nomorTelp, isValid: true
    },
    umur: {
      value: route.params.umur, isValid: true
    }
  });

  const [isLoading, setIsLoading] = useState(false)

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: enteredValue.trim().length > 0 }
      }
    })
  }

  const validateInputs = () => {
    const updatedInputs = {
      fullname: {
        value: inputs.fullname.value,
        isValid: inputs.fullname.value.trim().length > 0
      },
      nomorTelp: {
        value: inputs.nomorTelp.value,
        isValid: inputs.nomorTelp.value.trim().length > 0
      },
      umur: {
        value: inputs.umur.value,
        isValid: inputs.umur.value.trim().length > 0
      }
    };

    setInputs(updatedInputs);

    return updatedInputs.fullname.isValid && updatedInputs.nomorTelp.isValid && updatedInputs.umur.isValid;
  }

  function uploadImageHandler(imageUri) {
    setSelectedImage(imageUri)
  }

  useLayoutEffect(() => {
      navigation.setOptions({
      headerTitle: `Update Profile : ${route.params.fullname}`,
      headerTintColor: 'white',
      headerStyle: {
          backgroundColor: '#164da4'
      },
      });
  }, [route.params])

  const handleUpdateData = async () => {
    if (!validateInputs()) {
      setSnackbarMessage("Lengkapi semua data diri \n terlebih dahulu");
      setSnackbarVisible(true);
      return;
    }

    if (!selectedImage) {
      const colRef = doc(firestore, "users", userId);
      const dataUpdate = {
        fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
        nomorTelp: inputs.nomorTelp.value ? inputs.nomorTelp.value : route.params.nomorTelp,
        umur: inputs.umur.value ? inputs.umur.value : route.params.umur,
      };

      setIsLoading(true)
      try {
        await updateDoc(colRef, dataUpdate);
        setSnackbarMessage("Profile Updated");
        setSnackbarVisible(true);
        navigation.replace("Profile", { userId: userId });
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarVisible(true);
      } finally {
        setIsLoading(false);
      }

    } else {
      const blobFile = await getBlobFromUri(selectedImage)

      if (selectedImage) {
        try {
          const colref = doc(firestore, "users", userId);
          const docSnapshot = await getDoc(colref);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            if (userData && userData.imageUri) {
              const imageUri = userData.imageUri;
              const imgRef = ref(storage, imageUri);
              await deleteObject(imgRef);
              setSnackbarMessage("Deleted old image");
              setSnackbarVisible(true);
            }
          }

          setIsLoading(true)
          const storagePath = "imgUsers/" + new Date().getTime();
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, blobFile);

          uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                setSnackbarMessage("Progress upload " + progress.toFixed(0) + '%');
                setSnackbarVisible(true);
                break;
              case 'running':
                setSnackbarMessage("Progress upload " + progress.toFixed(0) + '%');
                setSnackbarVisible(true);
                break;
              case 'success':
                setSnackbarMessage("Progress upload " + progress.toFixed(0) + '%');
                setSnackbarVisible(true);
                break;
            }
          }, (err) => {
            setSnackbarMessage("Progress upload error: " + err.message);
            setSnackbarVisible(true);
          }, async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const colRef = doc(firestore, "users", userId);

            const dataUpdateWithImage = {
              fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
              imageUri: downloadURL,
              nomorTelp: inputs.nomorTelp.value ? inputs.nomorTelp.value : route.params.nomorTelp,
              umur: inputs.umur.value ? inputs.umur.value : route.params.umur,
            };

            await updateDoc(colRef, dataUpdateWithImage);
            setSnackbarMessage("Profile updated");
            setSnackbarVisible(true);
            navigation.replace("Profile", { userId: userId });
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: 'white', maxWidth: 480 }}>
      <Topbar_2 tittle={'UPDATE PROFILE'}/>
      <UploadImage
        fullname={route.params.fullname}
        imageUri={route.params.imageUri}
        onImageUpload={uploadImageHandler}
      />
      <ScrollView>
        <View style={{ justifyContent: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <Input
            label="Fullname"
            invalid={!inputs.fullname.isValid}
            textInputConfig={{
              defaultValue: route.params.fullname,
              onChangeText: inputChangeHandler.bind(this, 'fullname')
            }}
          />
          {!inputs.fullname.isValid && <Text style={styles.errorText}>Data tidak boleh kosong</Text>}
        </View>
        <View style={{ justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
          <Input
            label="No. Telp"
            invalid={!inputs.nomorTelp.isValid}
            textInputConfig={{
              defaultValue: route.params.nomorTelp,
              onChangeText: inputChangeHandler.bind(this, 'nomorTelp')
            }}
          />
          {!inputs.nomorTelp.isValid && <Text style={styles.errorText}>Data tidak boleh kosong</Text>}
        </View>
        <View style={{ justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
          <Input
            label="Usia"
            invalid={!inputs.umur.isValid}
            textInputConfig={{
              defaultValue: route.params.umur,
              onChangeText: inputChangeHandler.bind(this, 'umur')
            }}
          />
          {!inputs.umur.isValid && <Text style={styles.errorText}>Data tidak boleh kosong</Text>}
        </View>
        
      </ScrollView>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 0, width: '100%', position: 'absolute', bottom: 10 }}>
        <Button onPress={handleUpdateData}>
          {isLoading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Update profile</Text>)}
        </Button>
        </View>


      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{backgroundColor: '#ff0e0e', justifyContent: 'center', borderRadius: 29, marginBottom: 10 }}
      >
        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12
  }
})
