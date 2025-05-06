import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AppLayout from '../../layouts/AppLayout';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('Anne Cho');

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setUserPhoto(response.assets[0].uri);
        }
      }
    );
  };

  const handleLogout = async () => {
    try {
      // Clear the authentication token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      
      // Optionally, clear other user-related data like profile, preferences, etc.
      // await AsyncStorage.removeItem('userProfile'); // Example for other data

      // Navigate the user to the SignIn screen after logout
      navigation.replace('SignIn'); // or use navigation.reset if you want to reset the entire navigation stack

      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      console.log('Error during logout:', error);
      Alert.alert('Error', 'An error occurred during logout.');
    }
  };

  const menuItems = [
    { icon: '🔔', title: 'Notification', onPress: () => console.log('Notifications') },
    { icon: '📋', title: 'My Order', onPress: () => navigation.navigate('Order') },
    { icon: '💳', title: 'Payment', onPress: () => console.log('Payment') },
    { icon: '🛒', title: 'Cart', onPress: () => console.log('Cart') },
    { icon: '❤️', title: 'Wish List', onPress: () => navigation.navigate('Wishlist') },
    { icon: '🔑', title: 'Password', onPress: () => console.log('Password') },
  ];

  return (
    <AppLayout>
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.profilePhoto} />
            ) : (
              <Image source={require('../../assets/logo.png')} style={styles.profilePhoto} />
            )}
            <View style={styles.editIconContainer}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{userName}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Account</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <MenuItem icon={item.icon} title={item.title} onPress={item.onPress} />
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

const MenuItem = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Text style={styles.menuArrow}>➔</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileHeader: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff' },
  photoContainer: { position: 'relative', marginBottom: 15 },
  profilePhoto: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e0e0e0' },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  editIcon: { fontSize: 16 },
  profileName: { fontSize: 20, fontWeight: 'bold' },
  sectionHeader: { paddingHorizontal: 15, paddingVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '500' },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { fontSize: 18, marginRight: 15 },
  menuTitle: { fontSize: 16 },
  menuArrow: { color: '#6F00FF', fontSize: 18 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginHorizontal: 15 },
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: 'red', fontWeight: '500' },
});

export default ProfileScreen;
