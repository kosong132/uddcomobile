// src/screens/Auth/SignInScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { signIn } from '../../services/authService';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    console.log("✅ [FRONTEND] Username:", username);
    console.log("✅ [FRONTEND] Password:", password);

    try {
      const response = await signIn(username, password);
      const userData = response.data;
      console.log('Login userData:', userData);
      // Save user info in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      Alert.alert('Success', 'Signed in successfully! ' + userData.username);
      navigation.navigate('Home');
    } catch (error) {
      console.log("❌ [FRONTEND] Error:", error.response?.data || error.message);
      Alert.alert('Login failed', error.response?.data || 'Invalid credentials');
    }
  };


  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input}  placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}/>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register Account</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignInScreen;
