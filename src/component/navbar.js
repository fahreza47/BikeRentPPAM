import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';


const Navbar = ({userId, idpos}) => {
    
    const navigation = useNavigation();

    console.log('user ID in Navbar:', userId);

    const handleHome = () => {
        navigation.navigate('Home', {userId: userId, idpos: 0});
    }

    const handlePos = () => {
        navigation.navigate('Pos', {userId: userId});
    }

    const handleScanner = () => {
        navigation.navigate('BarcodeScanner', {userId: userId});
    }

    const handleHistory = () => {
        navigation.navigate('History', {userId: userId});
    }

    const handleProfil = () => {
        navigation.navigate('Profile', {userId: userId});
    }

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <TouchableOpacity onPress={handleHome} style={styles.button}>
                    <Image source={require('../../assets/nav/home-inact.svg')} contentFit='fill' style={styles.icon}/>
                    <Text style={styles.text}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePos} style={styles.button}>
                    <Image source={require('../../assets/nav/post-inact.svg')} contentFit='fill' style={styles.icon}/>
                    <Text style={styles.text}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.center}>
                <TouchableOpacity onPress={handleScanner}>
                    <Image source={require('../../assets/nav/scanqr.svg')} contentFit='fill' style={styles.scannerIcon}/>
                </TouchableOpacity>
            </View>
            <View style={styles.right}>
                <TouchableOpacity onPress={handleHistory} style={styles.button}>
                    <Image source={require('../../assets/nav/history-inact.svg')} contentFit='fill' style={styles.icon}/>
                    <Text style={styles.text}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProfil} style={styles.button}>
                    <Image source={require('../../assets/nav/profile-inact.svg')} contentFit='fill' style={styles.icon}/>
                    <Text style={styles.text}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: 70,
        padding: 10,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        position: 'absolute',
        bottom: 0,
    },
    left: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '45%',
        paddingHorizontal: 25,
        bottom: 15,
        left: 5,
    },
    center: {
        position: 'relative',
        bottom: 21,
    },
    right: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '45%',
        paddingHorizontal: 25,
        bottom: 15,
        right: 5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginBottom: 5,
    },
    text: {
        color: '#5E5F60',
        fontWeight: 'semibold',
    },
    scannerIcon: {
        width: 75,
        height: 75,
    }
});

export default Navbar;
