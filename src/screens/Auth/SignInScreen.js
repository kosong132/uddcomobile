// src/screens/Auth/SignInScreen.js
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import styles from './styles';
const SignInScreen = ({ navigation }) => {
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register Account</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignInScreen;
