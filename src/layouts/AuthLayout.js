// src/screens/Auth/AuthLayout.js
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.brand}>UDD.Co</Text>
      <Text style={styles.description}>E-Commerced Customize Clothing System</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.formContainer}>{children}</View>
    </View>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: 100,
    alignSelf: 'center',
  },
  brand: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  formContainer: {
    marginTop: 10,
  },
});
