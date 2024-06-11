import Topbar_2 from "../component/topbar_2";
import Navbar from "../component/navbar";
import { Pressable, StyleSheet, Text, View, TextInput,TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image'
import { signOut, updatePhoneNumber } from 'firebase/auth';
import { Link } from 'expo-router';
import Button from '../component/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../config/firebase'
import { destroyKey, getKey } from '../config/localStorage'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

const Profile = ({route}) => {
    const {userId} = route.params;
    const [dataUsers, setDataUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            destroyKey();
            navigation.replace('Signin');
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(firestore, "users", userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDataUsers(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    return (
        <View style={{ flex : 1 }}>
            <Topbar_2 tittle={'PROFILE'}/>
            {/* Bagian Profile */}
                <View style={{flexDirection: 'column', alignItems: 'center', marginTop:'10%'}}>
                    <Image contentFit='fill' 
                        source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                        style={styles.profpic}
                    />
                    <View style={{ flexDirection: 'column', marginTop: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#DB461A' }}>{dataUsers.fullname}</Text>
                    </View>
                    <TouchableOpacity style={styles.touch} 
                                        onPress={() => navigation.navigate('UpdateProfile', {
                                        userId: userId,
                                        fullname: dataUsers.fullname,
                                        imageUri: dataUsers.imageUri,
                                        nomorTelp: dataUsers.nomorTelp,
                                        umur: dataUsers.umur,
                    })}
                    >
                        <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.linear}/>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#ffffff' }}>Edit Profil</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{ marginHorizontal: 'auto', marginVertical: 20 }}>
                    <View style={styles.tags}>
                            <Image source={require('../../assets/Profile.svg')}
                                // source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                                style={{ width: 39, height: 39, borderRadius: 50 }}
                            />
                            <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268', }}>{dataUsers.fullname}</Text>
                    </View>
                    <View style={styles.tags}>
                            <Image source={require('../../assets/Email.svg')}
                                // source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                                style={{ width: 39, height: 39, borderRadius: 50 }}
                            />
                            <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>{dataUsers.email}</Text>
                    </View>
                    <View style={styles.tags}>
                            <Image source={require('../../assets/Phone.svg')}
                                // source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                                style={{ width: 39, height: 39, borderRadius: 50 }}
                            />
                            <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>{dataUsers.nomorTelp}</Text>
                    </View>

                    <TouchableOpacity style={styles.tags} onPress={() => navigation.navigate('MyCard', {userId})}>
                            <Image source={require('../../assets/Card.svg')}
                                // source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                                style={{ width: 39, height: 39, borderRadius: 50 }}
                            />
                            <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>My Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tags} onPress={handleLogout}>
                            <Image source={require('../../assets/Logout.svg')}
                                // source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                                style={{ width: 39, height: 39, borderRadius: 50 }}
                            />
                            <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>Log Out</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
                <Navbar userId={userId}/>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    profpic : {
        position: 'relative', 
        marginTop: 4, 
        width: 90, 
        height: 90, 
        borderRadius: 50
    }, 
    linear : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 109,
        height: 40,
        top: 0,
        borderRadius:25
    }, 
    touch : {
        justifyContent: 'center',
        height: 40, width: 109,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 12,
        backgroundColor: '#FFAC33',
        borderRadius: 50,
    }, 
    tags : {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 59, 
        width: 332, 
        paddingHorizontal: 15, 
        paddingVertical: 4, 
        marginTop: 15, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        shadowColor: "#000",
        shadowOffset:{
            height: -20
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
    }
})