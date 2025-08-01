// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/Auth/SignInScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
// Add other app screens after login here...
import HomeScreen from '../screens/App/Home';
import ProfileScreen from '../screens/App/Profile';
import WishlistScreen from '../screens/App/Wishlist';
import OrderScreen from '../screens/App/Order';
import ProductDetailsScreen from '../screens/App/ProductDetailsScreen';
import CustomizeScreen from '../screens/App/CustomizeScreen';
import ARFittingScreen from '../screens/App/ARFittingScreen'; // Import ARFittingScreen
import ProfessionalClothingShowroom from '../screens/App/ProfessionalClothingShowroom'; // Import ProfessionalClothingShowroom
import MyProfileScreen from '../screens/App/MyProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (

    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ARFittingScreen" component={ARFittingScreen} />
      <Stack.Screen name="ProfessionalClothingShowroom" component={ProfessionalClothingShowroom} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      {/* Home and other screens after sign-in */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Customize" component={CustomizeScreen} />
    </Stack.Navigator>

  );
};

export default AppNavigator;
