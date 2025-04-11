import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons or any other icon set
// import { Feather, FontAwesome } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isFocused = (screen) => route.name === screen;

  
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Home')}
        >
          <Feather 
            name="home" 
            size={24} 
            color={isFocused('Home') ? '#FF6B00' : '#000'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Feather 
            name="heart" 
            size={24} 
            color={isFocused('Wishlist') ? '#FF6B00' : '#000'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Order')}
        >
          <Feather 
            name="list" 
            size={24} 
            color={isFocused('Order') ? '#FF6B00' : '#000'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Feather 
            name="user" 
            size={24} 
            color={isFocused('Profile') ? '#FF6B00' : '#000'} 
          />
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });
  
  export default BottomNavBar;

  
//   return (
//     <View style={styles.container}>
//       <NavButton icon={<Icon name="ios-home" size={30} color={isFocused('Home') ? '#f97316' : '#999'} />} screen="Home" />
//       <NavButton icon={<Icon name="ios-heart" size={30} color={isFocused('Wishlist') ? '#f97316' : '#999'} />} screen="Wishlist" />
//       <NavButton icon={<Icon name="ios-list" size={30} color={isFocused('Orders') ? '#f97316' : '#999'} />} screen="Orders" />
//       <NavButton icon={<Icon name="ios-person" size={30} color={isFocused('Profile') ? '#f97316' : '#999'} />} screen="Profile" />
//     </View>
//   );
// };

// const NavButton = ({ icon, screen }) => {
//   const navigation = useNavigation();
//   return (
//     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(screen)}>
//       {icon}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     height: 60,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#fff',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   button: {
//     alignItems: 'center',
//   },
// });

// export default BottomNavBar;
