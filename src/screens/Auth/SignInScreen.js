// src/screens/Auth/SignInScreen.js
import React, { useState } from 'react';
import { View,TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { signIn } from '../../services/authService';
import styles from './styles';

const SignInScreen = ({ navigation }) => {
  // const [email, setEmail] = useState('');
  const [username, setUsername]= useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
        // Log what is being sent
        console.log("✅ [FRONTEND] Username", username);
        console.log("✅ [FRONTEND] Password:", password);
    try {
      const response = await signIn(username, password);
      Alert.alert('Success', 'Signed in successfully! ' + response.data.username);
      // Store user info or token here using AsyncStorage (if needed)
      navigation.navigate('Home'); // Navigate to Home screen after successful login
    } catch (error) {
      console.log("❌ [FRONTEND] Error:", error.response?.data || error.message);
      Alert.alert('Login failed', error.response?.data || 'Invalid credentials');
    }
  };
  
  
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

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
