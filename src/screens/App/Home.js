import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AppLayout from '../../layouts/AppLayout';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://10.0.2.2:8080/products/all')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>All Products</Text>
            <Feather name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView style={styles.productList}>
            <View style={styles.productGrid}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                >
                  <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  <Text style={styles.productPrice}>RM {product.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonText: {
    marginRight: 5,
  },
  productList: {
    flex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Home;

// const products = [
//   {
//     id: '1',
//     name: 'Urban Artistry Tee',
//     description: '100% Premium Cotton',
//     price: 'RM 24.99',
//     image: require('../../assets/urban-tee.png'),
//   },
//   {
//     id: '2',
//     name: 'Collar T',
//     description: 'Cotton-Polyester Blend',
//     price: 'RM 39.00',
//     image: require('../../assets/collar-t.png'),
//   },
//   {
//     id: '3',
//     name: 'Pro Hoops Jersey',
//     description: 'Performance Polyester',
//     price: 'RM 69.00',
//     image: require('../../assets/hoops-jersey.png'),
//   },
//   {
//     id: '4',
//     name: 'Basketball Jersey Set',
//     description: 'Lightweight Mesh Polyester',
//     price: 'RM 79.00',
//     image: require('../../assets/basketball-set.png'),
//   },
// ];