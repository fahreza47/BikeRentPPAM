import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Image } from 'expo-image'
import React, { useState } from 'react'
import Button from '../component/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import { firebaseAuth, firestore } from '../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Snackbar } from 'react-native-paper'; // Import Snackbar

const Signup = () => {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
    });

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        fullname : {value: '', isValid: true},
        email: {value: '', isValid: true},
        password: { value: '', isValid: true },
    })

    const [snackbarVisible, setSnackbarVisible] = useState(false); // State untuk menampilkan Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Pesan yang akan ditampilkan di Snackbar
    const [snackVisible, setSnackVisible] = useState(false); // State untuk menampilkan Snackbar
    const [snackMessage, setSnackMessage] = useState(''); // Pesan yang akan ditampilkan di Snackbar

    const handlesignin = () => {
        navigation.replace('Signin');
    }
    const handleRegister = async () => {

    // Object dataRegister yang datanya didapatkan dari state inputs
        const dataRegister = {
            fullname: inputs.fullname.value,
            email: inputs.email.value,
            password: inputs.password.value,
        };

        const emailIsValid = inputs.email.value.trim() !== "";
        const fullnameIsValid = inputs.fullname.value.trim() !== "";
        const passwordIsValid = inputs.password.value.trim() !== "";

        if (!emailIsValid || !passwordIsValid || !fullnameIsValid ) {
        setInputs((currentInputs) => ({
            email: { value: currentInputs.email.value, isValid: emailIsValid },
            fullname: { value: currentInputs.fullname.value, isValid: fullnameIsValid },
            password: { value: currentInputs.password.value, isValid: passwordIsValid },
        }));

        console.log(inputs);
        console.log(fullnameIsValid);
        console.log(emailIsValid);
        console.log(passwordIsValid);

        setSnackbarMessage('Please, check your input'); // Set pesan untuk Snackbar
        setSnackbarVisible(true); // Tampilkan Snackbar
        return;
    }

    // Jika semua input valid ubah state isLoading menjadi true
    setIsLoading(true);
    try {
        const success = await createUserWithEmailAndPassword(firebaseAuth, dataRegister.email, dataRegister.password);
        const userId = success.user.uid;

        await sendEmailVerification(firebaseAuth.currentUser)
        setSnackMessage("Email Verifikasi Terkirim");
        setSnackVisible(true)

        const docRef = {
            userId: userId,
            email: dataRegister.email,
            fullname: dataRegister.fullname,
        };

        await setDoc(doc(firestore, "users", userId), docRef);


        console.log("Register Success");

        setSnackMessage("Register success please login");
        setSnackVisible(true)
        navigation.replace('Signin');
        } catch (error) {
        const errorMessage = error.message;
        setSnackbarMessage(errorMessage); // Set pesan untuk Snackbar
        setSnackbarVisible(true); // Tampilkan Snackbar
    }
    };

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true }
            }
        })
    }

    return (
        <View style={style.container}>
            <View style={style.banner}>
                <Image source={require('../../assets/BikeRentbanner.svg')} contentFit='fill' style={{width:287, height:107}}/>
            </View>
            <View style={style.form}>
                {/* Button Sign In or Sign Up */}
                <View style={style.buttonSwitch}>
                    <LinearGradient colors={['#EA7604', '#DC4919']} style={style.buttonLinear}/>
                    <View style={{ flex: 1, flexDirection:'row', paddingHorizontal:8 }}>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={handlesignin}>
                            <Text style={{ fontWeight:'bold', color: '#FFFFFF', fontSize: 16}}>Sign In</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: '#FFFFFF', height: 43, margin: 'auto', borderRadius: 6}}>
                            <Text style={{ fontWeight:'bold', color: '#000000', fontSize: 16}}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={{ paddingLeft: 20, marginTop: 26, fontWeight:'bold' }}>Let's Sign Up</Text>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 16 , paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Enter Fullname' label={"Fullname"} invalid={!inputs.fullname.isValid} onChangeText = {inputChangeHandler.bind(this, 'fullname')}></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, marginVertical: 10, borderColor: '#C2C2C2'}} placeholder='Enter Email' label={"Email"} invalid={!inputs.email.isValid} onChangeText= {inputChangeHandler.bind(this, 'email')}></TextInput>
                <TextInput style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', paddingHorizontal: 20, borderColor: '#C2C2C2'}} placeholder='Enter Password' label={"Password"} invalid={!inputs.password.isValid} onChangeText = {inputChangeHandler.bind(this, 'password')}></TextInput>
                <Button children={'Sign Up'} onPress={handleRegister}/>
                <Text style={style.text}>Already have an account ? <Text style={{ fontWeight:'bold' }}>Sign In</Text></Text>
            </View>
            {/* Snackbar untuk menampilkan pesan error */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
                style={{ marginBottom: "2%", backgroundColor: '#ff0e0e', justifyContent: 'center', borderRadius: 29, marginBottom: '3%'}}
            >
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
                    {snackbarMessage}
                </Text>
            </Snackbar>

            {/* Snackbar untuk menampilkan pesan berhasil */}
            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={2000}
                style={{ marginBottom: "2%", backgroundColor: 'green', justifyContent: 'center', borderRadius: 29, marginBottom: '3%'}}
            >
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
                    {snackMessage}
                </Text>
            </Snackbar>
        </View>
    );
};

export default Signup;

const style= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBE4',
        
    },
    banner :{
        marginTop: 'auto',
        marginHorizontal: 'auto',
        marginBottom: 53
    },
    form : {
        width: 335,
        height: 425,
        backgroundColor:'#FFFFFF',
        borderRadius: 28,
        marginBottom: 'auto',
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset:{
            height: -20
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text:{
        marginHorizontal:'auto',
    }, 
    buttonSwitch : {
        marginTop: 20,
        marginHorizontal: 'auto',
        width: 297,
        height: 56,
        backgroundColor: '#EA7504',
        borderRadius: 8,
    }, 
    buttonLinear : {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 297,
        height: 56,
        top: 0,
        borderRadius: 8,
    }

});