import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native'; 
import AuthLayout from '../../layouts/AuthLayout';
import { requestMobileResetOtp } from '../../services/authService'; // ✅ use correct import
import styles from './styles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgot = async () => {
    try {
      await requestMobileResetOtp(email); // API call
      Alert.alert('Success', 'A 6-digit OTP has been sent to your email.');
      navigation.navigate('ResetPassword', { email }); // go to next screen
    } catch (error) {
      console.error('Forgot password error:', error); // 🔍 Log full error
  
      Alert.alert(
        'Error',
        error.response?.data || error.message || 'Something went wrong'
      );
    }
  };
  
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to reset">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleForgot}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
