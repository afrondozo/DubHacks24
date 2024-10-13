import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screens/loginscreen';
import FoodShelfLifeTracker from '../src/screens/foodlist';
import AddFoodScreen from '../src/screens/addFood';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: "644029368680-et9jkj1ga45a1vuab9smj22gks47jhr7.apps.googleusercontent.com",
    webClientId: "644029368680-6eaoei958548vo0rpt8i1q2at6vcskib.apps.googleusercontent.com",
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Perform any operations you need to prepare your app
        await new Promise(resolve => setTimeout(resolve, 2000));
        // If you need to fetch user info or perform other async operations, do it here
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

  if (!appIsReady) {
    return null;
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
});