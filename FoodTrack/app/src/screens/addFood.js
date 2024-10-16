import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddFoodScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddFood = () => {
    const newFood = {
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      expiresIn: Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24)), // Calculate days until expiration
    };
    route.params.onAddFood(newFood);
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpirationDate(currentDate);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Food Item</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Food Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter food name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Expiration Date:</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={formatDate(expirationDate)}
            onChange={(e) => setExpirationDate(new Date(e.target.value))}
            style={styles.webDateInput}
          />
        ) : (
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text>{expirationDate.toDateString()}</Text>
          </TouchableOpacity>
        )}
      </View>
      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={expirationDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  webDateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddFoodScreen;