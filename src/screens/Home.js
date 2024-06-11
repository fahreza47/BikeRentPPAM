import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import Topbar from "../component/topbar";
import Navbar from "../component/navbar";
import Map from "../component/Map";
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../config/firebase'
import { destroyKey, getKey } from '../config/localStorage'

const Home = ({navigation, route}) => {
    const { userId, idpos } = route.params;
    console.log("Idpos in home:", idpos);
    const [dataUsers, setDataUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    console.log('user ID in home:', userId);
    return (
        <>
            <Map userId={userId} idpos={idpos}/>
            <Topbar userId={userId}/>
            <Navbar userId={userId}/>
            
        </>
    )
}

export default Home;