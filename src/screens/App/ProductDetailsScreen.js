import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productData = getDummyProduct(productId);
    setProduct(productData);
    if (productData?.colors?.length > 0) {
      setSelectedColor(productData.colors[0]);
    }
    if (productData?.sizes?.length > 0) {
      setSelectedSize(productData.sizes[0]);
    }
    setLoading(false);
  }, [productId]);

  const getDummyProduct = (id) => {
    const dummyProducts = {
      '1': {
        id: '1',
        name: 'Urban Artistry Tee',
        material: '100% Premium Cotton',
        price: 24.99,
        description:
          'Embrace your creativity with our Urban Artistry Tee. Featuring a soft, breathable fit and vibrant custom prints, this t-shirt is perfect for casual outings or showcasing your unique style.',
        image: require('../../assets/urban-tee.png'),
        colors: ['Grey', 'White', 'Black', 'Navy Blue'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      '2': {
        id: '2',
        name: 'Collar T',
        material: 'Cotton-Polyester Blend',
        price: 39.0,
        description:
          'A stylish collar T-shirt for casual and semi-formal occasions. Soft and comfy fabric for all-day wear.',
        image: require('../../assets/collar-t.png'),
        colors: ['White', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
      },
      '3': {
        id: '3',
        name: 'Pro Hoops Jersey',
        material: 'Performance Polyester',
        price: 69.0,
        description:
          'Dominate the court with our Pro Hoops Jersey. Engineered for performance and style.',
        image: require('../../assets/hoops-jersey.png'),
        colors: ['Red', 'Blue', 'Black'],
        sizes: ['M', 'L', 'XL'],
      },
      '4': {
        id: '4',
        name: 'Basketball Jersey Set',
        material: 'Lightweight Mesh Polyester',
        price: 79.0,
        description:
          'Complete basketball set including top and shorts. Designed for breathability and movement.',
        image: require('../../assets/basketball-set.png'),
        colors: ['Yellow', 'Black'],
        sizes: ['S', 'M', 'L'],
      },
    };

    return dummyProducts[id];
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>UDD.Co</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content under header */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Product Image */}
        <Image source={product.image} style={styles.productImage} />

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>RM {product.price.toFixed(2)}</Text>
          <Text style={styles.materialText}>Fabric: {product.material}</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Color Selection */}
          <Text style={styles.sectionTitle}>Select Color:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorsContainer}
          >
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { borderColor: selectedColor === color ? '#FF6B00' : '#ddd' },
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={styles.colorText}>{color}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Size Selection */}
          <View style={styles.sizesContainer}>
            {product.sizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sizeOption,
                  { borderColor: selectedSize === size ? '#FF6B00' : '#ddd' },
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    { color: selectedSize === size ? '#FF6B00' : '#333' },
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Customize Button */}
          <TouchableOpacity
            style={styles.customizeButton}
            onPress={() =>
              navigation.navigate('Customize', {
                productId: product.id,
                productName: product.name,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                price: product.price,
              })
            }
          >
            <Text style={styles.customizeButtonText}>Customize</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window'); // Get screen width for responsiveness

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  logoText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 4,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },

  productImage: {
    width: width - 32, // Use dynamic width with some margin for responsiveness
    height: 350,
    resizeMode: 'cover',
    marginTop: 8,
  },

  detailsContainer: {
    paddingHorizontal: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B00',
    marginBottom: 12,
  },
  materialText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorOption: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorText: {
    fontSize: 14,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  sizeOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 14,
  },
  customizeButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  customizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;
