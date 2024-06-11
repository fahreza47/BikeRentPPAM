import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import Button from '../component/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { firebaseAuth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Snackbar } from 'react-native-paper'; // Import Snackbar
import { getKey, storeKey } from '../config/localStorage';
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
    });

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: { value: '', isValid: true },
        password: { value: '', isValid: true },
    });

    const [snackbarVisible, setSnackbarVisible] = useState(false); // State untuk menampilkan Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Pesan yang akan ditampilkan di Snackbar

    useEffect(() => {
        getKey('LOGGED_IN').then(res => {
            const data = res;
            console.log("data user: ", data);
            if (data) {
                navigation.replace('Home', { userId: data });
            }
        });
    }, []);

    const handleLogin = async () => {
        const dataLogin = {
            email: inputs.email.value,
            password: inputs.password.value,
        };

        const emailIsValid = inputs.email.value.trim() !== '';
        const passwordIsValid = inputs.password.value.trim() !== '';

        if (!emailIsValid || !passwordIsValid) {
            setInputs((currentInputs) => ({
                email: { value: currentInputs.email.value, isValid: emailIsValid },
                password: { value: currentInputs.password.value, isValid: passwordIsValid },
            }));
            setSnackbarMessage('Please, check your input'); // Set pesan untuk Snackbar
            setSnackbarVisible(true); // Tampilkan Snackbar
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password);
            const userId = userCredential.user.uid;
            const emailVerified = userCredential.user.emailVerified;
            console.log(userId)

            if (!emailVerified) {
                setSnackbarMessage('Email belum terverifikasi'); // Set pesan untuk Snackbar
                setSnackbarVisible(true); // Tampilkan Snackbar
                return;
            } else {
                storeKey('LOGGED_IN', userId);
                navigation.replace('Home', { userId: userId, idpos: 0});
            }
        } catch (error) {
            const errorMessage = error.message;
            setSnackbarMessage(errorMessage); // Set pesan untuk Snackbar
            setSnackbarVisible(true); // Tampilkan Snackbar
        } finally {
            setIsLoading(false);
        }
    };

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true },
            };
        });
    };

    const [hidePassword, setHidePassword] = useState(true);
    const togglePasswordVisibility = () => {
        setHidePassword(!hidePassword);
    };

    return (
        <View style={style.container}>
            <View style={style.banner}>
                <Image source={require('../../assets/BikeRentbanner.svg')} contentFit='fill' style={{ width: 287, height: 107 }} />
            </View>
            <View style={style.form}>
                {/* Button Sign In or Sign Up */}
                <View style={style.buttonSwitch}>
                    <LinearGradient colors={['#EA7604', '#DC4919']} style={style.buttonLinear} />
                    <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 8 }}>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', height: 43, margin: 'auto', borderRadius: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 16 }}>Sign In</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Signup')}>
                            <Text style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: 16 }}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={{ paddingLeft: 20, marginTop: 26, fontWeight: 'bold' }}>Sign In With Email</Text>
                <View style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 20, paddingHorizontal: 15, borderColor: '#C2C2C2', flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="mail-outline" size={24} color="gray" />
                        <TextInput
                            style={{ flex: 1, paddingLeft:15 }}
                            placeholder='Enter Email'
                            label={"Email"}
                            invalid={!inputs.email.isValid}
                            onChangeText={inputChangeHandler.bind(this, 'email')}
                        />
                    </View>
                    <View style={{ width: 297, height: 51, borderWidth: 1, borderRadius: 8, marginHorizontal: 'auto', marginTop: 20, paddingHorizontal: 15, borderColor: '#C2C2C2', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline' } size={24} color="gray" />
                        </TouchableOpacity>
                        <TextInput
                            style={{ flex: 1, paddingLeft:15 }}
                            placeholder='Enter Password'
                            label={"Password"}
                            secureTextEntry={hidePassword}
                            invalid={!inputs.password.isValid}
                            onChangeText={inputChangeHandler.bind(this, 'password')}
                        />
                    </View>
                <Text style={style.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
                <Button children={'Sign In'} onPress={handleLogin} />
                <Text style={style.text}>Don't have an account? <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Signup')}>Create Account</Text></Text>
            </View>
        </View>
    );
};

export default SignIn;

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBE4',
    },
    banner: {
        marginTop: 'auto',
        marginHorizontal: 'auto',
        marginBottom: 53,
    },
    form: {
        width: 335,
        height: 425,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        marginBottom: 'auto',
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset: {
            height: -20,
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        marginHorizontal: 'auto',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        paddingRight: 20,
        marginBottom: 10,
        color: '#EA7604',
    },
    buttonSwitch: {
        marginTop: 20,
        marginHorizontal: 'auto',
        width: 297,
        height: 56,
        backgroundColor: '#EA7504',
        borderRadius: 8,
    },
    buttonLinear: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 297,
        height: 56,
        top: 0,
        borderRadius: 8,
    }
});
