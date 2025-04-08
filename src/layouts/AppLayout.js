import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const AppLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.content}>{children}</View>
      {/* Add your bottom navigation here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  logo: {
    width: 120,
    height: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
