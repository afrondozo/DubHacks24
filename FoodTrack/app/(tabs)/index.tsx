import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screens/loginscreen';
import FoodShelfLifeTracker from '../src/screens/foodlist';
import AddFoodScreen from '../src/screens/addFood';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // expoClientId: "YOUR_EXPO_CLIENT_ID", // Use this for Expo apps
    iosClientId: "644029368680-et9jkj1ga45a1vuab9smj22gks47jhr7.apps.googleusercontent.com",
    // androidClientId: "YOUR_ANDROID_CLIENT_ID", // Add this if you have an Android client ID
    webClientId: "644029368680-6eaoei958548vo0rpt8i1q2at6vcskib.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken]);

  const fetchUserInfo = async () => {
    try {
      let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userInfo = await response.json();
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Fetch fonts, make API calls, etc.
        
        // Artificial delay -- remove this in production!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <Text style={styles.debugText}>App is not ready</Text>;
  }

  return (
    
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} promptGoogleLogin={promptAsync} user={user} />}
          </Stack.Screen>
          <Stack.Screen 
            name="FoodTracker" 
            component={FoodShelfLifeTracker} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddFood" 
            component={AddFoodScreen} 
            options={{ title: 'Add New Food' }}
          />
        </Stack.Navigator>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  debugText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },
});