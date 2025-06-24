import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLayout from '../../layouts/AppLayout';
import axios from 'axios';

const BASE_URL = 'https://uddco.onrender.com';

const MyProfileScreen = () => {
    const [userData, setUserData] = useState({
        userId: '',
        username: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const parsedData = JSON.parse(data);
                setUserData({
                    userId: parsedData.userId,
                    username: parsedData.username,
                    email: parsedData.email || '',
                    phoneNumber: String(parsedData.phoneNumber || ''),
                    address: parsedData.address || '',
                });
            }
        };
        loadUserData();
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/update-profile`, null, {
                params: {
                    userId: userData.userId,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    address: userData.address,
                },
            });

            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            Alert.alert('Success', response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data || 'Failed to update profile.');
        }
    };

    const handleSubmitPasswordChange = async () => {
        if (!currentPassword || !newPassword) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${BASE_URL}/auth/change-password`, null, {
                params: {
                    userId: userData.userId,
                    currentPassword: currentPassword.trim(),
                    newPassword: newPassword.trim(),
                },
            });
            Alert.alert('Success', response.data);
            setModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.response?.data || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>My Profile</Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#eee' }]}
                    value={userData.username}
                    editable={false}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={userData.email}
                    keyboardType="email-address"
                    onChangeText={(val) => setUserData({ ...userData, email: val })}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={userData.phoneNumber}
                    keyboardType="phone-pad"
                    onChangeText={(val) => setUserData({ ...userData, phoneNumber: val })}
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={userData.address}
                    onChangeText={(val) => setUserData({ ...userData, address: val })}
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#6F00FF' }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Change Password Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        <TextInput
                            placeholder="Current Password"
                            secureTextEntry={true}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            style={[styles.input, styles.passwordInput]}
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />

                        <TextInput
                            placeholder="New Password"
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={[styles.input, styles.passwordInput]}
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                        />

                        {loading ? (
                            <ActivityIndicator color="#6F00FF" size="small" />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: '#6F00FF' }]}
                                    onPress={handleSubmitPasswordChange}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: '#aaa', marginTop: 10 }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginTop: 15 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 5,
        backgroundColor: '#f9f9f9',
        color: '#000', 
    },
    button: {
        marginTop: 25,
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    passwordInput: {
    fontFamily: 'System', // Use system font for better password display
    fontSize: 16,
    letterSpacing: 0, // Reset letter spacing for password
    color: '#000', // Ensure password text is black
    backgroundColor: '#fff',
  },
  
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
});

export default MyProfileScreen;
