import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, SafeAreaView, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Non-expo image picker
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Material icons
const API_URL = 'http://10.0.2.2:8080/orders';
import axios from 'axios'; // Ensure Axios is installed
import AsyncStorage from '@react-native-async-storage/async-storage';


const CustomizeScreen = ({ route, navigation }) => {
    const { product, selectedColor, selectedSize, selectedCustomization } = route.params;
    const productName = product?.name || 'Not available';
    const productDescription = product?.description || 'No description provided';
    const parsedPrice = parseFloat(product?.price);
    const pricePerUnit = !isNaN(parsedPrice) ? parsedPrice.toFixed(2) : 'N/A';
    

    const totalPrice = pricePerUnit * quantity;
    const [customImage, setCustomImage] = useState(null);
    const [logoPosition, setLogoPosition] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isPositionModalVisible, setIsPositionModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const fetchUserId = async () => {
          try {
            const userDataString = await AsyncStorage.getItem('userData'); // or 'user'
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
      



    const logoPositions = [
        { id: 'left_breast', name: 'Left Breast', image: require('../../assets/left-breast.png') },
        { id: 'right_breast', name: 'Right Breast', image: require('../../assets/right-breast.png') },
        { id: 'back', name: 'Back/Shoulder Blades', image: require('../../assets/position-back.png') },
        { id: 'left_sleeve', name: 'Left Arm Sleeve', image: require('../../assets/position-left-sleeve.png') },
        { id: 'right_sleeve', name: 'Right Arm Sleeve', image: require('../../assets/position-right-sleeve.png') },
        { id: 'nape', name: 'Nape of Neck', image: require('../../assets/position-nape.png') },
    ];

    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
                includeBase64: false,
            },
            response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                    Alert.alert('Error', 'Failed to pick image. Please try again.');
                } else {
                    setCustomImage(response.assets[0].uri);
                }
            }
        );
    };
    const uploadImageToServer = async () => {
        if (!customImage) return;

        const fileName = customImage.split('/').pop();
        const fileType = fileName.split('.').pop(); // e.g., 'jpg' or 'png'

        const data = new FormData();
        data.append('file', {
            uri: customImage,
            type: `image/${fileType}`,
            name: fileName,
        });

        try {
            const res = await axios.post(`${API_URL}/upload-image`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data.url; // or res.data.url depending on backend // return res.data?.url;

        } catch (error) {
            console.error('Upload failed:', error.response?.data || error.message);
            Alert.alert('Upload Error', 'Failed to upload image. Check server logs.');
            return null;
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedCustomization || !customImage || !logoPosition) {
            Alert.alert('Required', 'Please complete all required fields');
            return;
        }

        const uploadedImageUrl = await uploadImageToServer();
        if (!uploadedImageUrl) return;

        const order = {
            productId: product.id,
            productName,
            selectedColor,
            selectedSize,
            selectedCustomization,
            pricePerUnit: pricePerUnit,
            totalPrice: totalPrice,
            quantity,
            logoPosition,
            imageUrl: uploadedImageUrl,
            userId: userId,
        };
        console.log('Placing order with data:', order);

        try {
            await axios.post(`${API_URL}/place-order`, order);
            Alert.alert('Success', 'Order placed successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to place order');
        }
    };

    const handleAddToWishlist = () => {
        // TODO: Connect to backend or local storage
        Alert.alert('Wishlist', 'Added to your favorites!');
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const calculateTotalPrice = () => {
        const qty = parseInt(quantity) || 0;
        const unitPrice = parseFloat(product?.price) || 0;
        return (unitPrice * qty).toFixed(2);
    };

    const renderPositionModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPositionModalVisible}
                onRequestClose={() => setIsPositionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Logo Position</Text>
                        <ScrollView contentContainerStyle={styles.positionsGridContainer}>
                            {logoPositions.map((position) => (
                                <TouchableOpacity
                                    key={position.id}
                                    style={styles.positionGridItem}
                                    onPress={() => {
                                        setLogoPosition(position.name);
                                        setIsPositionModalVisible(false);
                                    }}
                                >
                                    <Image source={position.image} style={styles.positionImage} />
                                    <Text style={styles.positionName}>{position.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setIsPositionModalVisible(false)}
                        >
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customize Your Clothing</Text>
                <View style={styles.placeholderView} />
            </View>

            <ScrollView>
                <View style={styles.previewContainer}>
                    <Text style={styles.previewText}>Your Selected Customized Clothing</Text>

                    {/* Product Preview */}
                    <View style={styles.productPreview}>
                        <Image
                            source={{ uri: product?.imageUrl }}
                            style={styles.productPreviewImage}
                            resizeMode="contain" // optional: keeps image aspect ratio
                        />

                        <TouchableOpacity style={styles.arButton}>
                            <MaterialIcons name="camera-alt" size={24} color="#fff" />
                            <Text style={styles.arButtonText}>AR Sizing</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={styles.productDetailsPreview}>
                        <Text style={styles.productNamePreview}>
                            Product Name: {productName}
                        </Text>

                        <Text style={styles.fabricPreview}>
                            Description: {productDescription}
                        </Text>

                        <Text style={styles.pricePreview}>
                            Price per piece: RM {pricePerUnit}
                        </Text>

                        <Text style={styles.colorPreview}>
                            Color: {selectedColor || 'Not selected'} | Size: {selectedSize || 'Not selected'}
                        </Text>

                        <Text style={styles.printPreview}>
                            Printing Method: {selectedCustomization || 'Not selected'}
                        </Text>
                    </View>


                </View>

                <View style={styles.customizationContainer}>


                    {/* Upload Image Section */}
                    <Text style={styles.sectionTitle}>Upload Customized Icon/Picture:</Text>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={pickImage}
                    >
                        {customImage ? (
                            <Image source={{ uri: customImage }} style={styles.uploadedImage} />
                        ) : (
                            <>
                                <MaterialIcons name="cloud-upload" size={32} color="#666" />
                                <Text style={styles.uploadButtonText}>Upload Image</Text>
                                <Text style={styles.uploadSubtext}>or drop a file, paste image or URL</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Logo Position Section */}
                    <Text style={styles.sectionTitle}>Select Logo Position:</Text>
                    <TouchableOpacity
                        style={styles.positionSelector}
                        onPress={() => setIsPositionModalVisible(true)}
                    >
                        <Text style={styles.positionSelectorText}>
                            {logoPosition || 'Select Position'}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Quantity Section */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.sectionTitle}>Quantity:</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={decrementQuantity}
                            >
                                <MaterialIcons name="remove" size={24} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.quantityValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={incrementQuantity}
                            >
                                <MaterialIcons name="add" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Order Buttons */}
                    <View style={styles.orderButtonsContainer}>
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>
                            Total Price: RM {calculateTotalPrice()}
                        </Text>



                        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                            <Text style={styles.placeOrderText}>Place Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToWishlist}>
                            <MaterialIcons name="favorite-border" size={24} color="#FF6B00" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {renderPositionModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholderView: {
        width: 28,
    },
    previewContainer: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: '#f0f0f0',
    },
    previewText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    productPreview: {
        alignItems: 'center',
        position: 'relative',
    },
    productPreviewImage: {
        width: '80%',
        height: 250,
        resizeMode: 'contain',
    },
    arButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    arButtonText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
    },
    productDetailsPreview: {
        marginTop: 16,
    },
    productNamePreview: {
        fontSize: 14,
        marginBottom: 4,
    },
    fabricPreview: {
        fontSize: 14,
        marginBottom: 4,
    },
    pricePreview: {
        fontSize: 14,
        marginBottom: 4,
    },
    colorPreview: {
        fontSize: 14,
    },
    customizationContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 16,
    },
    customizationOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 12,
    },
    selectedCustomizationOption: {
        borderColor: '#FF6B00',
        backgroundColor: 'rgba(255, 107, 0, 0.05)',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        color: '#666',
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'contain',
    },
    uploadButtonText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 8,
        color: '#555',
    },
    uploadSubtext: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    positionSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    positionSelectorText: {
        fontSize: 14,
    },
    quantityContainer: {
        marginTop: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    quantityButton: {
        padding: 8,
    },
    quantityValue: {
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    orderButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 24,
    },
    totalPriceText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },

    placeOrderButton: {
        flex: 1,
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    placeOrderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    favoriteButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#FF6B00',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    positionsGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    positionGridItem: {
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    positionImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    positionName: {
        fontSize: 14,
        textAlign: 'center',
    },
    closeModalButton: {
        backgroundColor: '#FF6B00',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeModalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CustomizeScreen;
