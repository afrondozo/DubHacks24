import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screens/loginscreen';
import FoodShelfLifeTracker from '../src/screens/foodlist';
import AddFoodScreen from '../src/screens/addFood';


const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Fetch fonts, make API calls, etc.
        
        // Any other initialization logic here
        
        // Artificial delay -- remove this in production!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      
        <Stack.Navigator initialRouteName="Login">
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
      
    </View>
  );
}