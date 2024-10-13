import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const logoImage = require('../../images/FoodTrack_logo.png');

const LoginScreen = ({ user }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '644029368680-et9jkj1ga45a1vuab9smj22gks47jhr7.apps.googleusercontent.com',
    webClientId: '644029368680-6eaoei958548vo0rpt8i1q2at6vcskib.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Add this if you have an Android client ID
  });

  const handleGoogleLogin = async () => {
    console.log('Google login pressed');
    await promptAsync();
  };

  const handlePhoneLogin = () => {
    console.log('Phone login pressed with number:', phoneNumber);
    navigation.navigate('FoodTracker');
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google login successful');
      // Here you would typically send the authentication.accessToken to your backend
      // or use it to fetch the user's information from Google
      navigation.navigate('FoodTracker');
    }
  }, [response, navigation]);

  // If user is logged in, navigate to FoodTracker
  useEffect(() => {
    if (user) {
      navigation.navigate('FoodTracker');
    }
  }, [user, navigation]);

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

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

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
    width: 150,
    height: 150,
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
    marginBottom: 20,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
    color: 'black',
  },
  phoneButton: {
    backgroundColor: 'black', // Changed to a blue color for visibility
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