import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../screens/Signup';
import Signin from '../screens/Signin';
import React from 'react';
import Home from '../screens/Home';
import BarcodeScanner from '../screens/BarcodeScanner';
import MyVoucher from '../screens/MyVoucher';
import MyCard from '../screens/MyCard';
import Profile from '../screens/Profile';
import UpdateProfile from '../screens/UpdateProfile';
import Riwayat from '../screens/Riwayat';
import Notification from '../screens/Notification';
import Payment from '../screens/Payment';
import Pos from '../screens/Pos';

const Stack = createStackNavigator()


const Routes = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name= 'Signin' component ={Signin} options={{ headerShown: false }}/> 
          <Stack.Screen name= 'Signup' component ={Signup} options={{ headerShown: false }}/>
          <Stack.Screen name= 'Home' component ={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{ headerShown: false }}/>
          <Stack.Screen name= 'MyVoucher' component ={MyVoucher} options={{ headerShown: false }}/>
          <Stack.Screen name= 'MyCard' component ={MyCard} options={{ headerShown: false }}/>
          <Stack.Screen name= 'Payment' component ={Payment} options={{ headerShown: false }}/>
          <Stack.Screen name= 'Pos' component ={Pos} options={{ headerShown: false }}/>
          <Stack.Screen name= 'History' component ={Riwayat} options={{ headerShown: false }}/>
          <Stack.Screen name= 'Profile' component ={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name= 'UpdateProfile' component ={UpdateProfile} options={{ headerShown: false }}/>
          <Stack.Screen name= 'Notification' component ={Notification} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: StatusBar.currentHeight,
  },
});

export default Routes;
