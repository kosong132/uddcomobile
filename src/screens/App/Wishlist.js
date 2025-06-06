import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Button,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import AppLayout from '../../layouts/AppLayout';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://10.211.97.163:8080';

const logoPositions = [
  { id: 'left_breast', name: 'Left Breast', image: require('../../assets/left-breast.png') },
  { id: 'right_breast', name: 'Right Breast', image: require('../../assets/right-breast.png') },
  { id: 'back', name: 'Back/Shoulder Blades', image: require('../../assets/position-back.png') },
  { id: 'left_sleeve', name: 'Left Arm Sleeve', image: require('../../assets/position-left-sleeve.png') },
  { id: 'right_sleeve', name: 'Right Arm Sleeve', image: require('../../assets/position-right-sleeve.png') },
  { id: 'nape', name: 'Nape of Neck', image: require('../../assets/position-nape.png') },
];

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);


  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Product details cache: productId => productData (for colors, sizes, customizations)
  const [productDetailsMap, setProductDetailsMap] = useState({});

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserId(parsed.userId);
          const res = await axios.get(`${API_URL}/wishlist/user/${parsed.userId}`);
          setWishlistItems(res.data);

          // Fetch product details for all unique productIds in wishlist
          const productIds = [...new Set(res.data.map(item => item.productId))];
          const productDetailsResponses = await Promise.all(
            productIds.map(pid => axios.get(`${API_URL}/products/${pid}`))
          );
          const productMap = {};
          productDetailsResponses.forEach(r => {
            productMap[r.data.id] = r.data;
          });
          setProductDetailsMap(productMap);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        Alert.alert('Error', 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Update wishlist item in backend and UI
  const updateWishlistItem = async (updatedItem) => {
    try {
      // Update backend using wishlistId
      await axios.put(`${API_URL}/wishlist/update/${updatedItem.wishlistId}`, updatedItem);

      // Update UI state
      setWishlistItems(prev =>
        prev.map(item => (item.wishlistId === updatedItem.wishlistId ? updatedItem : item))
      );
      setSelectedItem(updatedItem); // update modal state
    } catch (err) {
      console.error('Update wishlist item failed:', err);
      Alert.alert('Error', 'Failed to update wishlist item');
    }
  };


  const onChangeQuantity = (value) => {
    if (value < 1) return;
    const updated = { ...selectedItem, quantity: value };
    updated.totalPrice = (parseFloat(updated.pricePerUnit) * value).toFixed(2);
    updateWishlistItem(updated);
  };

  const onChangeSelection = (field, value) => {
    const updated = { ...selectedItem, [field]: value };
    updateWishlistItem(updated);
  };

  const onChangeImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel || response.errorCode) return;

      const uri = response.assets[0].uri;
      const fileName = uri.split('/').pop();
      const fileType = fileName.split('.').pop();

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: `image/${fileType}`,
        name: fileName,
      });

      try {
        const uploadRes = await axios.post(`${API_URL}/orders/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updated = { ...selectedItem, imageUrl: uploadRes.data.url };
        updateWishlistItem(updated);
      } catch (err) {
        Alert.alert('Upload Failed', 'Image upload failed.');
      }
    });
  };

const handlePlaceOrder = async (item) => {
  try {
    const orderPayload = {
      productId: item.productId || item.id,
      productName: item.productName,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      selectedCustomization: item.selectedCustomization,
      pricePerUnit: parseFloat(item.pricePerUnit),
      totalPrice: parseFloat(item.totalPrice),
      quantity: item.quantity,
      logoPosition: item.logoPosition,
      imageUrl: item.imageUrl,
      userId: item.userId,
    };

    // Place the order
    await axios.post(`${API_URL}/orders/place-order`, orderPayload);

    // Delete from wishlist backend by wishlistId
    await axios.delete(`${API_URL}/wishlist/${item.wishlistId}`);

    // Remove from local state
    setWishlistItems((prevItems) =>
      prevItems.filter((w) => w.wishlistId !== item.wishlistId)
    );

    setEditModalVisible(false);
    Alert.alert('Success', 'Order placed and removed from wishlist.');
  } catch (err) {
    console.error('Order failed:', err.response?.data || err.message);
    Alert.alert('Error', 'Could not place order.');
  }
};

  // Minimal wishlist card like Shopee style
const renderItem = ({ item }) => {
  // Get the product image from product list using productId
 const product = productDetailsMap[item.productId];
  const productImageUrl = product?.imageUrl || null;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(item);
        setEditModalVisible(true);
      }}
      style={styles.card}
    >
      <Image source={{ uri: productImageUrl }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
        <Text numberOfLines={1} style={styles.title}>{item.productName}</Text>
        <Text>Color: {item.selectedColor}</Text>
        <Text>Size: {item.selectedSize}</Text>
        <View style={styles.quantityRow}>
          <Button
            title="−"
            onPress={() =>
              item.quantity > 1 &&
              updateWishlistItem({ ...item, quantity: item.quantity - 1 })
            }
          />
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Button
            title="+"
            onPress={() =>
              updateWishlistItem({ ...item, quantity: item.quantity + 1 })
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

  if (loading) return (
    <AppLayout>
      <ActivityIndicator size="large" style={{ marginTop: 100 }} />
    </AppLayout>
  );

  return (
    <AppLayout>
      <Text style={styles.header}>Wishlist</Text>
      {wishlistItems.length === 0 ? (
        <Text style={styles.empty}>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={item => item.wishlistId}
          renderItem={renderItem}
        />


      )}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 50 }}  >
            <Text style={styles.modalHeader}>Edit Wishlist Item</Text>

            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.imageUrl }} style={styles.editImage} />

                <Button title="Change Image" onPress={onChangeImage} />

                {/* Color Dropdown */}
                <Text style={styles.label}>Color:</Text>
                <Picker
                  selectedValue={selectedItem.selectedColor}
                  onValueChange={val => onChangeSelection('selectedColor', val)}
                >
                  {productDetailsMap[selectedItem.productId]?.colors?.map(c => (
                    <Picker.Item key={c.id || c.name} label={c.name || c} value={c.name || c} />
                  ))}
                </Picker>

                {/* Size Dropdown */}
                <Text style={styles.label}>Size:</Text>
                <Picker
                  selectedValue={selectedItem.selectedSize}
                  onValueChange={val => onChangeSelection('selectedSize', val)}
                >
                  {productDetailsMap[selectedItem.productId]?.availableSizes?.map(size => (
                    <Picker.Item key={size} label={size} value={size} />
                  ))}
                </Picker>

                {/* Customization Dropdown */}
                <Text style={styles.label}>Customization:</Text>
                <Picker
                  selectedValue={selectedItem.selectedCustomization}
                  onValueChange={val => onChangeSelection('selectedCustomization', val)}
                >
                  {productDetailsMap[selectedItem.productId]?.customizationOptions?.map(opt => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>

                {/* Logo Position Dropdown with images */}
                <Text style={styles.label}>Logo Position:</Text>
                <View style={styles.logoPositionContainer}>
                  {logoPositions.map(pos => (
                    <TouchableOpacity
                      key={pos.id}
                      style={[
                        styles.logoOption,
                        selectedItem.logoPosition === pos.id && styles.logoOptionSelected,
                      ]}
                      onPress={() => onChangeSelection('logoPosition', pos.id)}
                    >
                      <Image source={pos.image} style={styles.logoImage} />
                      <Text>{pos.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quantity */}
                <Text style={styles.label}>Quantity:</Text>
                <View style={styles.quantityRow}>
                  <Button title="−" onPress={() => onChangeQuantity(selectedItem.quantity - 1)} />
                  <Text style={styles.quantityText}>{selectedItem.quantity}</Text>
                  <Button title="+" onPress={() => onChangeQuantity(selectedItem.quantity + 1)} />
                </View>

                <Text style={styles.priceText}>
                  Price Per Unit: RM{selectedItem.pricePerUnit}
                </Text>
                <Text style={styles.priceText}>
                  Total Price: RM{selectedItem.totalPrice}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Button title="Place Order" onPress={() => handlePlaceOrder(selectedItem)} />
                  <Button title="Close" onPress={() => setEditModalVisible(false)} color="red" />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    alignSelf: 'center',
  },
  empty: {
    fontSize: 18,
    marginTop: 50,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
    minWidth: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  modalContent: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
  },
  editImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
  },
  logoPositionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  logoOption: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 5,
    marginBottom: 12,
    alignItems: 'center',
  },
  logoOptionSelected: {
    borderColor: '#0a84ff',
    backgroundColor: '#d6e4ff',
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  priceText: {
    marginTop: 12,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default WishlistScreen;
