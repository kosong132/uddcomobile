// src/screens/Auth/SignInScreen.js
import React, { useState } from 'react';
import { View,TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { signIn } from '../../services/authService';
import styles from './styles';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await signIn(username, password);
      Alert.alert('Success', 'Signed in successfully! ' + response.data.username);
      // You can store token or user info here using async storage
      // Optionally store user info or navigate to home
    } catch (error) {
      Alert.alert('Login failed', error.response?.data || 'Invalid credentials');
    }
  };
  
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
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
