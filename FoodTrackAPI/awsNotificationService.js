

import { SNSClient, CreatePlatformEndpointCommand, PublishCommand } from "@aws-sdk/client-sns";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const REGION = "us-west-2";  
const snsClient = new SNSClient({ region: REGION });

// Replace these with your actual ARNs
const IOS_PLATFORM_APPLICATION_ARN = "arn:aws:sns:us-west-2:YOUR_ACCOUNT_ID:app/APNS/YOUR_IOS_APP";
const ANDROID_PLATFORM_APPLICATION_ARN = "arn:aws:sns:us-west-2:YOUR_ACCOUNT_ID:app/GCM/YOUR_ANDROID_APP";

export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function createSNSEndpoint(token) {
  const platformApplicationArn = Platform.OS === 'ios' ? IOS_PLATFORM_APPLICATION_ARN : ANDROID_PLATFORM_APPLICATION_ARN;
  
  const params = {
    PlatformApplicationArn: platformApplicationArn,
    Token: token,
  };

  try {
    const command = new CreatePlatformEndpointCommand(params);
    const data = await snsClient.send(command);
    console.log("Success", data.EndpointArn);
    return data.EndpointArn;
  } catch (err) {
    console.log("Error", err);
  }
}

export async function sendNotification(endpointArn, message) {
  const params = {
    Message: JSON.stringify({
      default: message,
      APNS: JSON.stringify({
        aps: {
          alert: message,
          sound: 'default',
          badge: 1
        }
      }),
      GCM: JSON.stringify({
        notification: {
          body: message,
          title: 'Food Expiry Alert'
        }
      })
    }),
    MessageStructure: 'json',
    TargetArn: endpointArn
  };

  try {
    const command = new PublishCommand(params);
    const data = await snsClient.send(command);
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

export function scheduleLocalNotification(food) {
  const trigger = new Date(food.expirationDate);
  trigger.setDate(trigger.getDate() - 1); // Notify one day before expiration

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Food Expiring Soon!",
      body: `${food.name} will expire tomorrow. Remember to use it!`,
    },
    trigger,
  });
}

export async function checkAndScheduleNotifications(foods, endpointArn) {
  for (let food of foods) {
    const daysUntilExpiry = Math.ceil((new Date(food.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 1) {
      // Send immediate push notification via SNS
      await sendNotification(endpointArn, `${food.name} is expiring soon!`);
    } else if (daysUntilExpiry <= 3) {
      // Schedule local notification
      scheduleLocalNotification(food);
    }
  }
}