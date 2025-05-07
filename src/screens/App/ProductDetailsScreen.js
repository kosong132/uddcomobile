import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;  // Get productId from route params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCustomization, setSelectedCustomization] = useState(null);

  // Fetch product data based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:8080/products/${productId}`);
        const productData = response.data;
        setProduct(productData);

        // Set default values if available
        if (productData.colors?.length > 0) {
          setSelectedColor(productData.colors[0].name);  // Set default color
        }

        if (productData.availableSizes?.length > 0) {
          setSelectedSize(productData.availableSizes[0]);  // Set default size
        }

        if (productData.customizationOptions?.length > 0) {
          setSelectedCustomization(productData.customizationOptions[0]);  // Set default customization option
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  const handleGoToCustomize = () => {
    // Navigate to CustomizeScreen and pass selected options as params
    navigation.navigate('Customize', {
      productId,
      selectedColor,
      selectedSize,
      selectedCustomization,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.productImage}
      />

      {/* Product Details */}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      {/* Colors Section */}
      <Text style={styles.sectionTitle}>Colors</Text>
      <View style={styles.optionContainer}>
        {product.colors?.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: color.name.toLowerCase(), borderWidth: selectedColor === color.name ? 3 : 1 }
            ]}
            onPress={() => setSelectedColor(color.name)}
          >
            {selectedColor === color.name && <View style={styles.checkMark} />}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedOptionText}>Selected Color: {selectedColor}</Text>

      {/* Sizes Section */}
      <Text style={styles.sectionTitle}>Sizes</Text>
      <View style={styles.optionContainer}>
        {product.availableSizes?.map((size, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sizeButton,
              { borderColor: selectedSize === size ? 'blue' : '#ddd', backgroundColor: selectedSize === size ? '#e0f7fa' : '#fff' }
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={styles.sizeButtonText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedOptionText}>Selected Size: {selectedSize}</Text>

      {/* Customization Options Section */}
      <Text style={styles.sectionTitle}>Customization Options</Text>
      <View style={styles.optionContainer}>
        {product.customizationOptions?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.customizationButton,
              { backgroundColor: selectedCustomization === option ? '#aaaaaa' : '#ddd' }
            ]}
            onPress={() => setSelectedCustomization(option)}
          >
            <Text style={styles.customizationButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedOptionText}>Selected Customization: {selectedCustomization}</Text>

      {/* Button to go to CustomizeScreen */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={handleGoToCustomize}
      >
        <Text style={styles.customizeButtonText}>Go to Customize</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    color: '#388e3c',
    marginTop: 8,
  },
  productDescription: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'green',
  },
  sizeButton: {
    width: 80,
    height: 40,
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customizationButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  customizationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedOptionText: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
  },
  customizeButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  customizeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
