import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, Button, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../component/navbar';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import { firestore } from '../config/firebase'

const RentalHistoryItem = ({ location, price, date, duration, id, isSelected, onSelect, users }) => (
  <TouchableOpacity onPress={() => onSelect(id)} style={[styles.historyItem, isSelected && styles.selectedItem]}>
    <View style={styles.historyLeft}>
      <View style={styles.historyLocation}>
        <Image source={require('../../assets/nav/loc.svg')} style={styles.icon} />
        <Text style={styles.locText}>{location}</Text>
      </View>
      <View style={styles.historyPrice}>
        <Image source={require('../../assets/nav/bill.svg')} style={{width: 18, height: 18, marginRight: 5, contentFit: 'fill'}} />
        <Text style={styles.historyText}>Rp.{price}</Text>
      </View>
    </View>
    <View style={styles.historyRight}>
      <View style={styles.historyLocation}>
        <Image source={require('../../assets/clock.svg')} style={{width: 18, height: 18, marginRight: 5, contentFit: 'fill'}} />
        <Text style={styles.historyDuration}>{Math.floor(duration/60)} menit {Math.floor(duration%60)} detik</Text>
      </View>
      <Text style={styles.historyDate}>{date}</Text>
    </View>
  </TouchableOpacity>
);

const Riwayat = ({route}) => {
  const {userId} = route.params;
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
      const fetchUserHistory = async () => {
          try {
            // Buat referensi ke koleksi 'history'
            const historyRef = collection(firestore, "history");
            // Buat query untuk mengambil dokumen dengan id_user yang sesuai
            const q = query(historyRef, where('id_user', '==', userId), orderBy('date', 'desc'));
            // Eksekusi query
            const querySnapshot = await getDocs(q);
            // Ambil data dari setiap dokumen
            const historyData = querySnapshot.docs.map(doc => ({
                location: doc.data().loc, 
                price: doc.data().price,
                idRent: doc.data().id, 
                date: doc.data().date, 
                duration: doc.data().duration, 
                user: doc.data().id_user,
                }));
            setHistory(historyData);
    
          } catch (error) {
              console.error("Error fetching user history:", error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchUserHistory();
  }, [userId]);

  const toggleSelectionMode = () => {
    if (isSelecting && selectedItems.length > 0) {
      setDeleting(true);
      setShowModal(true);
    } else if (isSelecting && selectedItems.length === 0) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  };
  
  const handleShowmodal = () => {
    setShowModal(true);
  }

  const handleSelectItem = (id) => {
    
    if (isSelecting) {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.includes(id)) {
          return prevSelectedItems.filter(item => item !== id);
        } else {
          return [...prevSelectedItems, id];     
        }
      });
      console.log(selectedItems);
    }  
  };

  const selectAllItems = () => {
    if (isSelecting) {
      if (selectedItems.length === history.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(history.map(item => item.idRent));
      }
    }
  };  

  const handleDelete = async () => {
    try {     
        const historyRef = collection(firestore, "history");    
        for (const item of selectedItems) {
            const q = query(historyRef, where('id', '==', item));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                console.log(`Deleting document with ID: ${doc.id}`); // Debugging: Log dokumen yang dihapus
                await deleteDoc(doc.ref);
            });
            } else {
            console.log(`No document found for idRent: ${item}`); // Debugging: Log jika tidak ada dokumen ditemukan
            }
        }
        // Perbarui daftar history di aplikasi dengan menghapus item yang dipilih
        setHistory((prevHistory) => prevHistory.filter(item => !selectedItems.includes(item.idRent)));
        // Reset selectedItems
        setSelectedItems([]);
        setShowModal(false);
        setIsSelecting(false);
        setDeleting(false);
      } catch (error) {
        console.error("Error deleting history:", error);
      } finally {
        // Setelah selesai menghapus, atur state lain jika diperlukan
    }
};

  return (
    <View style={{ flex: 1 }}>
      <View style={{flexDirection:'row', height:100}}>
        <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.top}/>
        <View style={{position:'absolute', top:25, left:25}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/nav/back.svg')} contentFit='fill' style={{ width: 55, height: 55, borderRadius: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#FFFFFF', fontWeight:'bold', fontSize:21, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,}}>RIWAYAT</Text>
        </View>

      </View>
      <View style={styles.container}>
        {isSelecting && (
          <TouchableOpacity onPress={selectAllItems}>
            <Text style={styles.selectAll}>{selectedItems.length === history.length ? 'Batalkan Semua (X)' : `Pilih Semua (all)`}</Text>
          </TouchableOpacity>
        )}
        <FlatList
          data={history}
          renderItem={({ item }) => (
            <RentalHistoryItem
              location={item.location}
              price={item.price}
              date={new Date(item.date.seconds * 1000).toLocaleString()}
              duration={item.duration}
              isSelected={selectedItems.includes(item.idRent)}
              onSelect={handleSelectItem}
            />
          )}
          keyExtractor={(item) => item.idRent}
          contentContainerStyle={styles.historyList}
        />
      </View>
      <Navbar userId={userId}/>
{/* 
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => { setShowModal(false); setDeleting(false); }}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Konfirmasi penghapusan {selectedItems.length} item riwayat?</Text>
            <View style={styles.modalButtons}>
                <Button title="Ya" onPress={handleDelete} />
                <Button title="Tidak" onPress={() => { setShowModal(false); setDeleting(false); }} />
            </View>
            </View>
        </View>
        </Modal> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  historyList: {
    paddingHorizontal: 0,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#ffe4b2',
  },
  historyLeft: {
    flexDirection: 'column',
  },
  historyRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  historyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    width: 12,
    height: 16,
    marginRight: 5,
    contentFit: 'fill',
  },
  historyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DD4B18',
  },
  locText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1A3',
  },
  historyId: {
    fontSize: 14,
    color: '#666',
  },
  historyDuration: {
    fontSize: 14,
    color: '#666',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 34,
  },
  selectAll: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    textAlign: 'Left',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  
});

export default Riwayat;
