import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { register } from '../../services/authService';
import styles from './styles';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Validation: Check if any field is empty
    if (!username || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return; // Prevent form submission
    }
  
    try {
      // Attempt to register
      await register(username, email, phoneNumber, password);
      Alert.alert('Success', 'Registered successfully!');
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 1000); // Wait 1 second before navigating
    } catch (error) {
      // Handle duplicate username or email
      if (error.response) {
        const errorMessage = error.response?.data;
        if (errorMessage === 'Username already taken') {
          Alert.alert('Register failed', 'This username is already taken, please choose another.');
        } else if (errorMessage === 'Email already in use') {
          Alert.alert('Register failed', 'This email is already in use, please choose another.');
        } else {
          Alert.alert('Register failed', errorMessage || 'Something went wrong');
        }
      } else {
        // If there is no response (network error, etc.)
        Alert.alert('Register failed', 'Something went wrong, please try again later.');
      }
    }
  };
  
  

  return (
    <AuthLayout title="Register" subtitle="Join us now">
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default RegisterScreen;
