import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screens/loginscreen';
import FoodShelfLifeTracker from '../src/screens/foodlist';
import AddFoodScreen from '../src/screens/addFood';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Fetch fonts, make API calls, etc.
        
        // Any other initialization logic here
        
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    
      <Stack.Navigator initialRouteName= "FoodTracker">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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
    
  );
};

