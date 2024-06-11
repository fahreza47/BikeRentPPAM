import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, Button, TouchableOpacity, View } from 'react-native';
import Topbar_2 from '../component/topbar_2';
import Navbar from '../component/navbar';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Pos = ({ route }) => {
  const { userId } = route.params;
  const [pos, setPos] = useState([]);
  const navigation = useNavigation();
  const [selectedPos, setSelectedPos] = useState(null);

  useEffect(() => {
    const fetchPos = () => {
      const db = getDatabase();
      const posRef = ref(db, 'Pos');

      onValue(posRef, (snapshot) => {
        const data = snapshot.val();
        const posData = Object.keys(data).map(key => ({
          idpos: key,
          latitude: data[key].latitude,
          longitude: data[key].longitude,
          nBike: data[key].nBike,
          name: data[key].name,
        }));
        posData.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
        setPos(posData);
        console.log('ini Pos data:', posData);
      }, (error) => {
        console.error("Error fetching pos data:", error);
      });
    };

    fetchPos();
  }, []);

  const handleSelectPos = (id) => {
    if (selectedPos === id) {
      setSelectedPos(null); // Deselect if the same item is selected again
    } else {
      setSelectedPos(id); // Select the new item
    }
  };

  const handleViewPos = () => {
  // Navigasi ke halaman Home dengan parameter userId dan selectedPos
  navigation.navigate('Home', {
    userId: userId,
    idpos: selectedPos,
  });
};


  return (
    <View style={{ flex: 1 }}>
      <Topbar_2 tittle={'POS SEPEDA'} />
      <View style={styles.container}>
        <FlatList
            data={pos}
            keyExtractor={(item) => item.idpos}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={[styles.item, selectedPos === item.idpos && styles.selectedItem]}
                onPress={() => handleSelectPos(item.idpos)}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
            )}
            
        />
      </View>

      <Navbar userId={userId} idpos='0'/>
      {selectedPos && (
            <View style={styles.viewPosContainer}>
            <LinearGradient colors={['#D93F1E', '#EC7A01']} style={styles.viewPosButton}>
              <TouchableOpacity style={styles.touchable} onPress={handleViewPos}>
                <Text style={styles.viewPosText}>Tampilkan Pos</Text>
              </TouchableOpacity>
            </LinearGradient>
            </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
  selectedItem: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)', // Light orange color
  },
  buttonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20, 
  },
  viewPosContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: 50,
    bottom: 110,
    zIndex: 99999
  },
  viewPosButton: {
    paddingHorizontal: 20, // Mengurangi padding horizontal
    paddingVertical: 5, // Mengurangi padding vertikal
    borderRadius: 20,
    width: 'auto', // Mengatur lebar otomatis sesuai teks
  },
  viewPosText: {
    fontSize: 16, // Ukuran font
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  touchable: {
    paddingHorizontal: 10, // Mengurangi padding horizontal
    paddingVertical: 5, // Mengurangi padding vertikal
  }
});

export default Pos;
