import { Alert, FlatList, Pressable, StyleSheet, Text, Modal, TouchableOpacity, View, } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { firestore } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';

import Button from '../component/Button';
import Topbar_2 from '../component/topbar_2';



const Payment = ({navigation, route}) => {
    const { userId, time, timeEnd } = route.params;
    
    const CardItem = ({ title, account, image, onPress, isActive=false }) => (
        <TouchableOpacity style={[styles.cardItem, isActive && styles.activeCardItem]} onPress={onPress}>
            <Image source={image} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle]}>{title}</Text>
                <Text style={[styles.cardAccount]}>{account}</Text>
            </View>
        </TouchableOpacity>
    );

    const cards = [
        {
        id: '1',
        title: 'BCA',
        account: '2345 6789 0123 4567',
        image: require('../../assets/bca.png'),
        },
        {
        id: '2',
        title: 'BRI',
        account: '1224 5678 9012 3456',
        image: require('../../assets/bri.png'),
        },
        {
        id: '3',
        title: 'Mandiri',
        account: '3456 7890 1234 5678',
        image: require('../../assets/mandiri.png'),
        },
    ];

    const [activeCardId, setActiveCardId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleClose = async () => {
        try {
            // Fungsi untuk menambahkan data ke koleksi 'history'
            async function addHistoryData(location, price, date, duration, userId) {
            try {
                // Tambahkan data ke Firestore
                const historyRef = await addDoc(collection(firestore, 'history'), {
                loc: location,
                price: price,
                date: date,
                duration: duration,
                id_user: userId
                });
    
                console.log('Data berhasil ditambahkan ke koleksi "history" dengan ID:', historyRef.id);
            } catch (error) {
                console.error('Gagal menambahkan data:', error);
                throw error; // Melempar error untuk ditangkap di blok catch luar
            }
            }
    
            const date = timeEnd;
    
            const location = 'GKU 1'
            const durasi = time
    
            const price = 10*time;
            await addHistoryData(location, price, date, durasi, userId);
    
            console.log('Data history ditambahkan dan modal ditutup');
            
            // Tambahkan log atau tindakan lain setelah menutup modal
            } catch (error) {
                console.error('Gagal menutup modal:', error);
                // Tambahan: Mungkin tambahkan penanganan kesalahan sesuai kebutuhan
            }
                // Set modal visible ke false
                setModalVisible(false);
        };

    const handleCardPress = (id) => {
        setActiveCardId(id);
        let desc = cards.find((card) => card.id === id).account;
        Alert.alert('Card Berhasil Digunakan', desc);
    };

    

    const handleBayar = () => {
        if (!activeCardId) {
            Alert.alert('Pilih Kartu Pembayaran', 'Silahkan pilih kartu pembayaran terlebih dahulu');
            return;
        }

        setModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row', height:100}}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.top}/>
                <View style={{position:'absolute', top:25, left:25}}>
                    <Link href='/'>
                        <View>
                            <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{width:55, height:55, borderRadius:30}}/>
                        </View>
                    </Link>
                </View>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>Pembayaran</Text>
                </View>
            </View>
            <Text style={{color:'#DC481A', fontWeight:'semibold', fontSize:20, marginVertical:10, marginLeft:15}}>Pilih Kartu Pembayaran</Text>
            <FlatList
                data={cards}
                renderItem={({ item }) => (
                    <CardItem
                        title={item.title}
                        account={item.account}
                        image={item.image}
                        isActive={item.id === activeCardId}
                        onPress={() => handleCardPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cardList}
            />
            <View style={styles.bottom}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:14, left:5}}>Total Jam :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:14, position:'absolute', right:5}}>{Math.floor(time/60)} menit {Math.floor(time%60)} detik</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:16, left:5}}>Summary :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:16, position:'absolute', right:5}}>Rp{time * 10}</Text>
                </View>
                <Button children={'Bayar'} onPress={handleBayar}/>
            </View>
            <Modal
                transparent={true}
                animationType='slide'
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto'}}>
                <View style={{backgroundColor: 'white', borderRadius: 20, marginTop: 'auto', marginBottom: 'auto'}}>
                <View style={{padding: 20, justifyContent:'center', alignItems:'center'}}>
                    <View style={{alignItems: 'center', justifyContent:'center'}}>
                        <LinearGradient colors={['#EB7802', '#DA421C']} style={{width:100, height:100, borderRadius:50, justifyContent:'center', alignItems:'center'}}>
                            <Ionicons name='checkmark' size={90} color='#FFFFFF' />
                        </LinearGradient>
                    </View>
                    <Text style={{color: 'rgba(11, 26, 63, 1)', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, fontWeight: 'bold', fontSize: 16}}>Pembayaran Berhasil</Text>
                    <Text style={{color: 'rgba(11, 26, 63, 1)', marginLeft: 'auto', marginRight: 'auto', marginTop: 10, fontWeight: 'bold', fontSize: 14}}>Terima kasih sudah menggunakan BikeRent</Text>
                    <LinearGradient colors={['#EB7802', '#DA421C']} style={{marginTop:25, width:'95%', height:50, borderRadius:50, justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => {handleClose(); navigation.navigate('Home', {userId: userId})}} style={{width:300, height:50,  backgroundColor: 'transparent', padding: 5, justifyContent:'center', alignItems:'center', borderRadius: 50}}>
                            <Text style={{textAlign: 'center', color: '#FFFFFF', fontSize:21, fontWeight: 'bold'}}>OK</Text>
                        </Pressable>    
                    </LinearGradient>
                </View>
                </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: 100,
        top: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    bottom: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'absolute',
        width: '100%',
        height: 150,
        bottom: 0,
        marginBottom: 5,
        padding: 10,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 100,
        elevation: 5,
    },
    cardList: {
        paddingHorizontal: 15,
    },
    cardItem: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        elevation: 1,
    },
    activeCardItem: {
        backgroundColor: '#FFD4A8',
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 25,
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardAccount: {
        fontSize: 14,
        color: '#666',
    },
});

export default Payment;