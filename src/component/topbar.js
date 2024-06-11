import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../config/firebase'
import { destroyKey, getKey } from '../config/localStorage'
import { useNavigation } from '@react-navigation/native';

const Topbar = ({userId}) => {
    const [dataUsers, setDataUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(false);
    const navigation = useNavigation();

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
    

    const handleNotificationClick = () => {
        // Logic to navigate to the notification page and mark notifications as read
        setHasNotifications(false);
        // Alert.alert('Navigating to notifications page...');
        // Implement actual navigation logic here
        console.log('handlenotifclikc', userId)
        navigation.navigate('Notification', {userId});
    };

    return (    
        <View style={styles.container}>
            <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.container}/>
            <View style={styles.left}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile', {userId})}>
                    <View>
                        <Image source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }} contentFit='fill' style={{width:55, height:55, borderRadius:30}}/>
                    </View>
                </TouchableOpacity>

                <View style={{paddingLeft:10}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21}}>Hello, {dataUsers.fullname}</Text>
                    <Text style={{color:'#FFFFFF', fontWeight:'semibold', fontSize:15}}>{dataUsers.umur} Tahun</Text>
                </View>
            </View>
            <View style={styles.right}>
                <TouchableOpacity onPress={handleNotificationClick}>
                    <View style={{flex:1, position:'absolute', alignItems:'center', justifyContent:'center'}}>
                        <Image 
                            source={hasNotifications 
                                ? require('../../assets/functional/notification.svg')
                                : require('../../assets/functional/notification.svg')} 
                            contentFit='fill' 
                            style={{width:39, height:39}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: 100,
        top: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flex: 1,
        
    },
    left: {
        position: 'absolute',
        flexDirection: 'row',
        top: 25,
        left: 25,
    },
    right: {
        position: 'absolute',
        top: 30,
        right: 60,
    },
});

export default Topbar;
