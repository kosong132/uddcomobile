import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, Pressable, TouchableOpacity ,ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'http://10.0.2.2:8080/orders';
import AppLayout from '../../layouts/AppLayout';

const Tab = createMaterialTopTabNavigator();

const OrderCard = ({ order, onPress }) => (
  <Pressable style={styles.orderCard} onPress={() => onPress(order)}>
    <Image source={{ uri: order.productImageUrl }} style={styles.productImage} />
    <View style={styles.orderDetails}>
      <Text style={styles.productName}>{order.productName}</Text>
      <View style={[styles.statusContainer, {
        backgroundColor: order.orderStatus === 'Completed' ? '#C8E6C9' : '#FFFF8D',
      }]}>
        <Text style={styles.statusText}>{order.orderStatus}</Text>
      </View>
    </View>
    <View style={styles.orderInfo}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <Text style={styles.quantityValue}>{order.quantity}</Text>
      <Text style={styles.priceValue}>RM {order.totalPrice.toFixed(2)}</Text>
    </View>
  </Pressable>
);


const OrderModal = ({ visible, onClose, order }) => {
  const [designImageVisible, setDesignImageVisible] = useState(false);

  if (!order) return null;
  const formattedDate = new Date(order.createdAt).toLocaleString();

  return (
    <>
      {/* Main Order Modal */}
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Order Details</Text>

              {/* Small Product Image */}
              <Text style={styles.imageLabel}>Product Image:</Text>
              <Image source={{ uri: order.productImageUrl }} style={styles.productImage} />

              {/* Clickable Design Image */}
              <Text style={styles.imageLabel}>Uploaded Design:</Text>
              <TouchableOpacity onPress={() => setDesignImageVisible(true)}>
               
                <Text style={styles.tapToEnlarge}>Tap to view full design image</Text>
              </TouchableOpacity>

              {/* Order Info */}
              <Text style={styles.modalItem}><Text style={styles.label}>Product Name:</Text> {order.productName}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Product ID:</Text> {order.productId}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Color:</Text> {order.selectedColor}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Size:</Text> {order.selectedSize}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Customization:</Text> {order.selectedCustomization}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Logo Position:</Text> {order.logoPosition}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Quantity:</Text> {order.quantity}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Price/Unit:</Text> RM {order.pricePerUnit.toFixed(2)}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Total:</Text> RM {order.totalPrice.toFixed(2)}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Status:</Text> {order.orderStatus}</Text>
              <Text style={styles.modalItem}><Text style={styles.label}>Created At:</Text> {formattedDate}</Text>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full Screen Design Image Modal */}
      <Modal visible={designImageVisible} transparent={true} onRequestClose={() => setDesignImageVisible(false)}>
        <View style={styles.fullImageOverlay}>
          <Image source={{ uri: order.imageUrl }} style={styles.fullDesignImage} resizeMode="contain" />
          <Pressable style={styles.fullImageCloseButton} onPress={() => setDesignImageVisible(false)}>
            <Text style={styles.fullImageCloseText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};
const OngoingTab = ({ orders, onCardPress }) => {
  const preparingOrders = orders.filter(order => order.orderStatus === 'Preparing');

  if (preparingOrders.length === 0) {
    return <View style={styles.tabContent}><Text style={styles.emptyText}>No ongoing orders</Text></View>;
  }

  return (
    <ScrollView style={styles.tabContent}>
      {preparingOrders.map((order, index) => (
        <OrderCard key={index} order={order} onPress={onCardPress} />
      ))}
    </ScrollView>
  );
};

const HistoryTab = ({ orders, onCardPress }) => {
  const completedOrders = orders.filter(order => order.orderStatus === 'Completed');

  if (completedOrders.length === 0) {
    return <View style={styles.tabContent}><Text style={styles.emptyText}>No order history available</Text></View>;
  }

  return (
    <ScrollView style={styles.tabContent}>
      {completedOrders.map((order, index) => (
        <OrderCard key={index} order={order} onPress={onCardPress} />
      ))}
    </ScrollView>
  );
};

const Order = () => {
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserId(userData.userId);
        }
      } catch (error) {
        console.log('Error loading user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://10.0.2.2:8080/orders/user/${userId}`);
        const fetchedOrders = response.data;

        const ordersWithProductImage = await Promise.all(
          fetchedOrders.map(async (order) => {
            try {
              const productRes = await axios.get(`http://10.0.2.2:8080/products/${order.productId}`);
              return {
                ...order,
                productImageUrl: productRes.data.imageUrl || null,
              };
            } catch (error) {
              return {
                ...order,
                productImageUrl: null,
              };
            }
          })
        );

        setOrders(ordersWithProductImage);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCardPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { textTransform: 'none', fontWeight: '500' },
        }}
      >
        <Tab.Screen name="Ongoing">
          {() => <OngoingTab orders={orders} onCardPress={handleCardPress} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <HistoryTab orders={orders} onCardPress={handleCardPress} />}
        </Tab.Screen>
      </Tab.Navigator>
      <OrderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
      />
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  designImageThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  tapToEnlarge: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullDesignImage: {
    width: '100%',
    height: '80%',
  },
  fullImageCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff55',
    borderRadius: 8,
  },
  fullImageCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default Order;
