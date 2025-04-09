// src/screens/Auth/ForgotPasswordScreen.js
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';

import styles from './styles';

const ForgotPasswordScreen = ({ navigation }) => {
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to reset">
      <TextInput placeholder="Email" style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;

