import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

const Topbar_2 = ({tittle}) => {
    var judul = tittle;
    const navigation = useNavigation();
    return (    
        <View style={{flexDirection:'row', height:100}}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.top}/>
                <View style={{position:'absolute', top:25, left:25}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{ width: 55, height: 55, borderRadius: 30 }} />
                    </TouchableOpacity>
                </View>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>{judul}</Text>
                </View>
        </View>
    )
}

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
        right:25,
    },
    center: {
        position: 'absolute',
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
});

export default Topbar_2;