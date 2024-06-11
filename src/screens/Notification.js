import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { firestore } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Topbar_2 from '../component/topbar_2';
import Navbar from '../component/navbar';
import { LinearGradient } from 'expo-linear-gradient';

const Notification = ({ navigation, route }) => {
  const { userId } = route.params;
  console.log('userIddi notif', userId);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotificationData = async () => {
    const notificationRef = collection(firestore, "notifikasi");
    const notificationQuery = query(notificationRef, where("userId", "==", userId));
    const notificationSnapshot = await getDocs(notificationQuery);

    const notificationData = [];

    notificationSnapshot.forEach((notif) => {
      const notifData = notif.data();
      notificationData.push(notifData);
    });

    notificationData.sort((a, b) => b.timeStamp - a.timeStamp);

    setNotification(notificationData);
  };

  useEffect(() => {
    setLoading(true);
    fetchNotificationData().then(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>
        {new Date(item.timeStamp.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Topbar_2 tittle="NOTIFIKASI" />
      <View style={styles.container}>
        <FlatList
          data={notification}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      <Navbar userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFD4A8',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    // backgroundColor: '#f9f9f9',
  },
  notificationMessage: {
    color: '#0B1A3F',
    fontSize: 15,
    fontWeight: '500',
  },
  notificationTimestamp: {
    fontSize: 10,
    fontWeight: '400',
    color: '#707B81',
    marginTop: 25,
    textAlign: 'right',
  },
});

export default Notification;
