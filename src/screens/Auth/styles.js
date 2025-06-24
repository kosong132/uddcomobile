// src/screens/Auth/styles.js
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#999',
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000', // Ensure text color is black
  },
  
  passwordInput: {
    fontFamily: 'System', // Use system font for better password display
    fontSize: 16,
    letterSpacing: 0, // Reset letter spacing for password
    color: '#000', // Ensure password dots are black
    backgroundColor: '#fff',
  },
  
  forgot: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#555',
  },
  
  button: {
    backgroundColor: '#D5671D',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  
  link: {
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
});