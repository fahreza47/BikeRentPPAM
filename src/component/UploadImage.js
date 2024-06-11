import { View, Text, StyleSheet, TouchableOpacity, TextInput, } from 'react-native';
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Button from './Button';
import { LinearGradient } from 'expo-linear-gradient';

const UploadImage = ({ fullname, onImageUpload,imageUri }) => {

    /** 
     * State yang akan kita gunakan ketika fungsi
     * UploadImageHandler dijalankan untuk menyimpan hasil dari
     * fungsi tersebut seperti yang terlihat di bawah ini
     */
    const [uploadImage, setUploadImage] = useState(null)

    // console.log(fullname);

    /**
     * ini adalah fungsi standar dari expo image picker
     * disini kita menggunakan Image.launchImageLibraryAsync
     * untuk mengambil gambar dari smartphone
     * 
     * untuk lebih detail silahkan kunjungi link berikut
     * dokumentasi expo image picker 
     * https://docs.expo.dev/versions/latest/sdk/imagepicker/
     */
    async function UploadImageHandler() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        setUploadImage(result.assets[0].uri)
        onImageUpload(result.assets[0].uri)
    }

    /**
     * imagePreview akan menampilkan gambar yang baik yang akan di upload
     * atau file gambar dari document pada collection (imageUri)
     * Jika user belum mengupload gambar apapun gunakan link dari ui-avatars
     * untuk tampilan gambarnya.
     */
    let imagePreview = <Image style={styles.userImg} 
    source={{ uri: imageUri ? imageUri : `https://ui-avatars.com/api/?name=${fullname}` }} />

    if (uploadImage) {
        imagePreview = <Image style={styles.userImg} source={{ uri: uploadImage }} />
    }

    return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', marginHorizontal: 'auto', marginTop: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    {imagePreview}
                </View>
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    height: 40, width: 129,
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginTop: 12,
                    backgroundColor: '#FFAC33',
                    borderRadius: 50,
                }}onPress={UploadImageHandler}>
                    <LinearGradient colors={['#EB7802', '#DA421C']} style={{ flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        width: 129,
                        height: 40,
                        top: 0,
                        borderRadius:25 }}/>
                    <Text style={{fontSize: 15, color:'white', fontWeight: 'bold' }}>Upload Image</Text>
                </TouchableOpacity>
            </View>
    )
}

export default UploadImage

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        borderRadius: 4
    },
    userImg: {
        width: 100,
        height: 100,
        marginHorizontal: 25,
        marginVertical: 25,
        borderRadius: 75
    },
})