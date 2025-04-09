// src/screens/Auth/RegisterScreen.js
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';

import styles from './styles';

const RegisterScreen = ({ navigation }) => {
  return (
    <AuthLayout title="Register" subtitle="Join us now">
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Phone Number" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default RegisterScreen;

