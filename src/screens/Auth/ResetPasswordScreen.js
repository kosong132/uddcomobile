import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { resetPassword } from '../../services/authService';
import styles from './styles';

const ResetPasswordScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const email = route.params?.email || '';

  const handleReset = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter both OTP and new password');
      return;
    }
  
    const trimmedOtp = otp.trim();
  
    // Log what is being sent
    console.log("✅ [FRONTEND] Trimmed OTP:", trimmedOtp);
    console.log("✅ [FRONTEND] New password:", newPassword);
  
    try {
      await resetPassword(trimmedOtp, newPassword);
      Alert.alert('Success', 'Password reset successful!');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log("❌ [FRONTEND] Error:", error.response?.data || error.message);
      Alert.alert('Error', error.response?.data || 'Invalid or expired OTP');
    }
  };
  

  return (
    <AuthLayout title="Reset Password" subtitle={`Enter the 6-digit OTP sent to ${email}`}>
      <TextInput
        placeholder="6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
         placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
