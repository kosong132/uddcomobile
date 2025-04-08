// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('App'); // switch to App screen
    }, 3000); // 3 seconds

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // make sure your logo is inside assets folder
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>UDD.Co</Text>
      <Text style={styles.subtitle}>Customized Your Cloth with Us</Text>
      <Text style={styles.version}>ver 1.0</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4dbd1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
  },
  version: {
    position: 'absolute',
    bottom: 20,
    color: '#777',
    fontSize: 12,
  },
});
