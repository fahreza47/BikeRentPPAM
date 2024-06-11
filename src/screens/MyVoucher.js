import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '../component/Button';
import Topbar_2 from '../component/topbar_2';


const VoucherItem = ({ title, description, image, onPress, isActive=false }) => (
    <TouchableOpacity style={[styles.voucherItem, isActive && styles.activeVoucherItem]} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.voucherImage} />
        <View style={styles.voucherTextContainer}>
            <Text style={[styles.voucherTitle]}>{title}</Text>
            <Text style={[styles.voucherDescription]}>{description}</Text>
        </View>
    </TouchableOpacity>
);

const MyVoucher = () => {
    const vouchers = [
        {
        id: '1',
        title: 'Discount 20%',
        description: 'Get 20% off on all items',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '2',
        title: 'Free Shipping',
        description: 'Free shipping on orders over $50',
        image: 'https://via.placeholder.com/150',
        },
        {
        id: '3',
        title: 'Buy 1 Get 1 Free',
        description: 'Buy one get one free on selected items',
        image: 'https://via.placeholder.com/150',
        },
    ];

    const [activeVoucherId, setActiveVoucherId] = useState(null);
    const handleVoucherPress = (id) => {
        setActiveVoucherId(id);
        let desc = vouchers.find((voucher) => voucher.id === id).description;
        Alert.alert('Voucher Berhasil Digunakan', desc);
    };

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
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>My Voucher</Text>
                </View>
            </View>
            <Text style={{color:'#DC481A', fontWeight:'semibold', fontSize:20, marginVertical:10, marginLeft:15}}>Pilih Voucher</Text>
            <FlatList
                data={vouchers}
                renderItem={({ item }) => (
                    <VoucherItem
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        isActive={item.id === activeVoucherId}
                        onPress={() => handleVoucherPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.voucherList}
            />
            <View style={styles.bottom}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:14, left:5}}>Diskon :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:14, position:'absolute', right:5}}>15%</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:14, left:5}}>Total Jam :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:14, position:'absolute', right:5}}>5 Jam</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#5E5F60', fontWeight:'semibold', fontSize:16, left:5}}>Summary :</Text>
                    <Text style={{color:'#5E5F60', fontWeight:'bold', fontSize:16, position:'absolute', right:5}}>Rp85000</Text>
                </View>
                <Button children={'Konfirmasi'}/>
            </View>
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
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 100,
        elevation: 5,
    },
    voucherList: {
        paddingHorizontal: 15,
    },
    voucherItem: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        elevation: 1,
    },
    activeVoucherItem: {
        backgroundColor: '#FFD4A8',
    },
    voucherImage: {
        width: 70,
        height: 70,
        borderRadius: 25,
        marginRight: 15,
    },
    voucherTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    voucherTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    voucherDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default MyVoucher;