// src/screens/Auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'; 
import AuthLayout from '../../layouts/AuthLayout';
import { requestResetPassword } from '../../services/authService';
import styles from './styles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const handleForgot = async () => {
    try {
      await requestResetPassword(email);
      Alert.alert('Success', 'Check your email for the reset link');
    } catch (error) {
      Alert.alert('Error', error.response?.data || 'Something went wrong');
    }
  };
  
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to reset">
       <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleForgot}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;

