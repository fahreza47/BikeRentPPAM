import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, Button, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Topbar_2 from '../component/topbar_2';

const PaymentMethodItem = ({ image, cardNumber, expiry, cvc, cardHolder, onRemove }) => (
  <View style={styles.paymentMethodItem}>
    <Image source={image} style={styles.paymentImage} contentFit="contain" />
    <View style={styles.paymentTextContainer}>
      <Text style={styles.cardNumber}>{cardNumber}</Text>
      <Text style={styles.cardDetails}>{expiry} | {cvc}</Text>
      <Text style={styles.cardHolder}>{cardHolder}</Text>
    </View>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const MyCard = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', cardNumber: '1224 5678 9012 3456', expiry: '12/25', cvc: '123', cardHolder: 'John Doe', image: require('../../assets/bri.png') },
    { id: '2', cardNumber: '2345 6789 0123 4567', expiry: '11/24', cvc: '456', cardHolder: 'Jane Smith', image: require('../../assets/bca.png') },
    { id: '3', cardNumber: '3456 7890 1234 5678', expiry: '10/23', cvc: '789', cardHolder: 'Alice Johnson', image: require('../../assets/mandiri.png') }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [mdlVisible, setModalVsb] = useState({vsb: false, cardNumber: '', cardHolder: ''});
  const [newCardNumber, setNewCardNumber] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvc, setNewCvc] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  
  const [errors, setErrors] = useState({});

  const handleAddPaymentMethod = () => {
    const newPaymentMethod = {
      id: (paymentMethods.length + 1).toString(),
      cardNumber: newCardNumber,
      expiry: newExpiry,
      cvc: newCvc,
      cardHolder: newCardHolder,
      image: require('../../assets/bri.png'),
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setModalVisible(false);
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvc('');
    setNewCardHolder('');
  };

  const handleClearInput = () => {
    setModalVisible(false);
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvc('');
    setNewCardHolder('');
    setErrors({});
  };

  const handleRemovePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    // Set to defult
    // const newPaymentMethod = [
    //   { id: '1', cardNumber: '1224 5678 9012 3456', expiry: '12/25', cvc: '123', cardHolder: 'John Doe', image: require('../../assets/bri.png') },
    //   { id: '2', cardNumber: '2345 6789 0123 4567', expiry: '11/24', cvc: '456', cardHolder: 'Jane Smith', image: require('../../assets/bca.png') },
    //   { id: '3', cardNumber: '3456 7890 1234 5678', expiry: '10/23', cvc: '789', cardHolder: 'Alice Johnson', image: require('../../assets/mandiri.png') }
    // ];
    // setPaymentMethods(newPaymentMethod);

  };

  const validateInputs = () => {
    let valid = true;
    let errors = {};

    if (newCardNumber.length !== 16 || isNaN(newCardNumber)) {
      errors.newCardNumber = "Card number must be 16 digits.";
      valid = false;
    }

    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryPattern.test(newExpiry)) {
      errors.newExpiry = "Expiry must be in MM/YY format.";
      valid = false;
    }

    if (newCvc.length < 3 || newCvc.length > 4 || isNaN(newCvc)) {
      errors.newCvc = "CVC must be 3 or 4 digits.";
      valid = false;
    }

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(newCardHolder)) {
      errors.newCardHolder = "Card holder name must be alphabetic.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSave = () => {
    if (validateInputs()) {
      handleAddPaymentMethod();
    }
  };

  const handleExpiryChange = (text) => {
    if (text.length === 2 && !text.includes('/')) {
      setNewExpiry(text + '/');
    } else {
      setNewExpiry(text);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Topbar_2 tittle={'MY CARD'} />
      <View style={styles.container}>
        <FlatList
          data={paymentMethods}
          renderItem={({ item }) => (
            <PaymentMethodItem
              cardNumber={item.cardNumber}
              expiry={item.expiry}
              cvc={item.cvc}
              cardHolder={item.cardHolder}
              image={item.image}
              onRemove={() => { setModalVsb({ vsb: true, cardNumber: item.cardNumber, cardHolder: item.cardHolder }); setSelectedId(item.id);}}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.paymentList}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Image source={require('../../assets/add_button.svg')} contentFit='fill' style={{ width: 80, height: 80, borderRadius: 30 }} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              {errors.newCardNumber && <Text style={styles.errorText}>{errors.newCardNumber}</Text>}
              <TextInput
                placeholder="Card Number"
                value={newCardNumber}
                onChangeText={setNewCardNumber}
                style={[styles.input, errors.newCardNumber && { borderColor: 'red' }]}
                keyboardType="numeric"
                maxLength={16}
              />
              {errors.newExpiry && <Text style={styles.errorText}>{errors.newExpiry}</Text>}
              <TextInput
                placeholder="MM/YY"
                value={newExpiry}
                onChangeText={handleExpiryChange}
                style={[styles.input, errors.newExpiry && { borderColor: 'red' }]}
                keyboardType="numeric"
                maxLength={5}
              />
              {errors.newCvc && <Text style={styles.errorText}>{errors.newCvc}</Text>}
              <TextInput
                placeholder="CVC"
                value={newCvc}
                onChangeText={setNewCvc}
                style={[styles.input, errors.newCvc && { borderColor: 'red' }]}
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.newCardHolder && <Text style={styles.errorText}>{errors.newCardHolder}</Text>}
              <TextInput
                placeholder="Card Holder Name"
                value={newCardHolder}
                onChangeText={setNewCardHolder}
                style={[styles.input, errors.newCardHolder && { borderColor: 'red' }]}
              />

              <View style={[styles.buttonContainer]}>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.button}>
                    <TouchableOpacity onPress={handleSave}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </LinearGradient>      
                <TouchableOpacity style={styles.button} onPress={handleClearInput}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                          
              </View>

            </View>
          </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          transparent={true}
          visible={mdlVisible.vsb}
          animationType="fade"
          onRequestClose={() => setModalVsb({ vsb: false, cardNumber: '', cardHolder: '' })}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVsb({ vsb: false, cardNumber: '', cardHolder: '' })}>
          <View style={styles.centeredView}>
            <View style={styles.modalContent}>
              <Text style={styles.confirmationText}>Hapus metode pembayaran:</Text>
              <Text style={styles.cardDetails}>{`${mdlVisible.cardHolder}`}</Text>
              <Text style={styles.cardDetails}>{`${mdlVisible.cardNumber}`}</Text>
              <Text style={styles.confirmationText}>dari list MyCard?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { handleRemovePaymentMethod(selectedId); setModalVsb({ vsb: false, cardNumber: '', cardHolder: '' }); }}>
                  <Text style={[styles.buttonText]}>Yes</Text>
                </TouchableOpacity>
                <LinearGradient colors={['#EB7802', '#DA421C']} style={styles.button}>
                    <TouchableOpacity onPress={() => setModalVsb({ vsb: false, cardNumber: '', cardHolder: '' })}>
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                </LinearGradient>                
              </View>
            </View>
          </View>
          </TouchableOpacity>
        </Modal>

        
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentList: {
    paddingBottom: 100,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  paymentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  paymentTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
  },
  cardHolder: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  removeButtonText: {
    color: '#f00',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 50,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  modalOverlay: {
    flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: "100%",
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  cardDetails: {
    marginBottom: 10,
    fontSize: 16
  },
  
  button: {
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    width: "35%",
    borderWidth: 0.5,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  

  buttonGradient: {
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
});

export default MyCard;
