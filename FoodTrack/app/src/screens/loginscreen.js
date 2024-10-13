import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const logoImage = require('../../images/FoodTrack_logo.png');


const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleGoogleLogin = () => {
    // Implement Google login logic
    console.log('Google login pressed');
  };

  const handlePhoneLogin = () => {
    // Implement phone number login logic
    console.log('Phone login pressed with number:', phoneNumber);
  };
  return (
    <View style={styles.container}>
      <Image
        source={logoImage} 
        style={styles.logo}
      />
      <Text style={styles.title}>Log In</Text>
      
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Log in with Google</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.phoneButton} onPress={handlePhoneLogin}>
        <Text style={styles.phoneButtonText}>Log in with Phone Number</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'white', // Explicitly setting background color
    color: 'black',           // Set text color to make it visible
  },
  phoneButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  phoneButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;