import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.text}>UDD.Co</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#a8d8e8', // Approximated color from image
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopBar;
