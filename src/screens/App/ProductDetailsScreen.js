import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const safeColor = (name) => {
const map = { aliceblue: 'aliceblue', antiquewhite: 'antiquewhite', aqua: 'aqua', aquamarine: 'aquamarine', azure: 'azure', beige: 'beige', bisque: 'bisque', black: 'black', blanchedalmond: 'blanchedalmond', blue: 'blue', blueviolet: 'blueviolet', brown: 'brown', burlywood: 'burlywood', cadetblue: 'cadetblue', chartreuse: 'chartreuse', chocolate: 'chocolate', coral: 'coral', cornflowerblue: 'cornflowerblue', cornsilk: 'cornsilk', crimson: 'crimson', cyan: 'cyan', darkblue: 'darkblue', darkcyan: 'darkcyan', darkgoldenrod: 'darkgoldenrod', darkgray: 'darkgray', darkgreen: 'darkgreen', darkkhaki: 'darkkhaki', darkmagenta: 'darkmagenta', darkolivegreen: 'darkolivegreen', darkorange: 'darkorange', darkorchid: 'darkorchid', darkred: 'darkred', darksalmon: 'darksalmon', darkseagreen: 'darkseagreen', darkslateblue: 'darkslateblue', darkslategray: 'darkslategray', darkturquoise: 'darkturquoise', darkviolet: 'darkviolet', deeppink: 'deeppink', deepskyblue: 'deepskyblue', dimgray: 'dimgray', dodgerblue: 'dodgerblue', firebrick: 'firebrick', floralwhite: 'floralwhite', forestgreen: 'forestgreen', fuchsia: 'fuchsia', gainsboro: 'gainsboro', ghostwhite: 'ghostwhite', gold: 'gold', goldenrod: 'goldenrod', gray: 'gray', green: 'green', greenyellow: 'greenyellow', honeydew: 'honeydew', hotpink: 'hotpink', indianred: 'indianred', indigo: 'indigo', ivory: 'ivory', khaki: 'khaki', lavender: 'lavender', lavenderblush: 'lavenderblush', lawngreen: 'lawngreen', lemonchiffon: 'lemonchiffon', lightblue: 'lightblue', lightcoral: 'lightcoral', lightcyan: 'lightcyan', lightgoldenrodyellow: 'lightgoldenrodyellow', lightgray: 'lightgray', lightgreen: 'lightgreen', lightpink: 'lightpink', lightsalmon: 'lightsalmon', lightseagreen: 'lightseagreen', lightskyblue: 'lightskyblue', lightslategray: 'lightslategray', lightsteelblue: 'lightsteelblue', lightyellow: 'lightyellow', lime: 'lime', limegreen: 'limegreen', linen: 'linen', magenta: 'magenta', maroon: 'maroon', mediumaquamarine: 'mediumaquamarine', mediumblue: 'mediumblue', mediumorchid: 'mediumorchid', mediumpurple: 'mediumpurple', mediumseagreen: 'mediumseagreen', mediumslateblue: 'mediumslateblue', mediumspringgreen: 'mediumspringgreen', mediumturquoise: 'mediumturquoise', mediumvioletred: 'mediumvioletred', midnightblue: 'midnightblue', mintcream: 'mintcream', mistyrose: 'mistyrose', moccasin: 'moccasin', navajowhite: 'navajowhite', navy: 'navy', oldlace: 'oldlace', olive: 'olive', olivedrab: 'olivedrab', orange: 'orange', orangered: 'orangered', orchid: 'orchid', palegoldenrod: 'palegoldenrod', palegreen: 'palegreen', paleturquoise: 'paleturquoise', palevioletred: 'palevioletred', papayawhip: 'papayawhip', peachpuff: 'peachpuff', peru: 'peru', pink: 'pink', plum: 'plum', powderblue: 'powderblue', purple: 'purple', red: 'red', rosybrown: 'rosybrown', royalblue: 'royalblue', saddlebrown: 'saddlebrown', salmon: 'salmon', sandybrown: 'sandybrown', seagreen: 'seagreen', seashell: 'seashell', sienna: 'sienna', silver: 'silver', skyblue: 'skyblue', slateblue: 'slateblue', slategray: 'slategray', snow: 'snow', springgreen: 'springgreen', steelblue: 'steelblue', tan: 'tan', teal: 'teal', thistle: 'thistle', tomato: 'tomato', turquoise: 'turquoise', violet: 'violet', wheat: 'wheat', white: 'white', whitesmoke: 'whitesmoke', yellow: 'yellow', yellowgreen: 'yellowgreen' };

  
  return map[name?.toLowerCase().trim()] || '#ccc';
};

const ProductDetails = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCustomization, setSelectedCustomization] = useState(null);
 const API_BASE = 'http://10.211.97.163:8080'; // or `10.0.2.2` for emulator
// 192.168.58.154  
// const API_BASE = 'http://192.168.58.154:8080';
useEffect(() => {
 axios.get(`${API_BASE}/products/${productId}`)
  //  axios.get(`http://10.0.2.2:8080/products/${productId}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching product details:', error);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleGoToCustomize = () => {
    if (!selectedColor || !selectedSize || !selectedCustomization) {
      alert('Please select color, size, and customization option.');
      return;
    }

    navigation.navigate('Customize', {
      product: product, // Ensure this contains name, description, price, etc.
      selectedColor,
      selectedSize,
      selectedCustomization
    });
  };

  if (loading)
    return <ActivityIndicator size="large" color="#ff5722" style={{ marginTop: 100 }} />;

  if (!product)
    return <Text style={{ padding: 20 }}>Product not found</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#fefefe' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>RM {parseFloat(product.price).toFixed(2)}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        {/* Colors */}
        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.optionContainer}>
          {product.colors?.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: safeColor(color.name),
                  borderWidth: selectedColor === color.name ? 2 : 0,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedColor(color.name)}
            />
          ))}
        </View>
        {selectedColor && (
          <Text style={styles.selectedOptionText}>Selected Color: {selectedColor}</Text>
        )}

        {/* Sizes */}
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.optionContainer}>
          {product.availableSizes?.map((size, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedSize(size)}
              style={[
                styles.chip,
                selectedSize === size && styles.chipSelected,
              ]}
            >
              <Text style={selectedSize === size ? styles.chipTextSelected : styles.chipText}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedSize && (
          <Text style={styles.selectedOptionText}>Selected Size: {selectedSize}</Text>
        )}

        {/* Customization */}
        <Text style={styles.sectionTitle}>Customization</Text>
        <View style={styles.optionContainer}>
          {product.customizationOptions?.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCustomization(option)}
              style={[
                styles.chip,
                selectedCustomization === option && styles.chipSelected,
              ]}
            >
              <Text style={selectedCustomization === option ? styles.chipTextSelected : styles.chipText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedCustomization && (
          <Text style={styles.selectedOptionText}>Selected Customization: {selectedCustomization}</Text>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.customizeButton} onPress={handleGoToCustomize}>
          <Text style={styles.customizeButtonText}>Go to Customize</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#e91e63',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderColor: '#000',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  chipSelected: {
    backgroundColor: '#000',
  },
  chipText: {
    color: '#000',
  },
  chipTextSelected: {
    color: '#fff',
  },
  selectedOptionText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  bottomBar: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  customizeButton: {
    backgroundColor: '#e91e63',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  customizeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
