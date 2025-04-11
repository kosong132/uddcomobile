import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppLayout from '../../layouts/AppLayout';

const Tab = createMaterialTopTabNavigator();

const OngoingTab = () => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.orderCard}>
        <Image 
          source={require('../../assets/urban-tee.png')}
          style={styles.productImage}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.productName}>Urban Artistry Tee</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Preparing</Text>
          </View>
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <Text style={styles.quantityValue}>20</Text>
          <Text style={styles.priceValue}>RM 499.80</Text>
        </View>
      </View>
    </View>
  );
};

const HistoryTab = () => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.emptyText}>No order history available</Text>
    </View>
  );
};

const Order = () => {
  return (
    <AppLayout>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { textTransform: 'none', fontWeight: '500' },
        }}
      >
        <Tab.Screen name="Ongoing" component={OngoingTab} />
        <Tab.Screen name="History" component={HistoryTab} />
      </Tab.Navigator>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  statusContainer: {
    backgroundColor: '#FFFF8D',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
  },
  orderInfo: {
    alignItems: 'flex-end',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default Order;
