import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/auth'; // 10.0.2.2 = localhost on Android emulator

export const signIn = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export const register = (username, email, phoneNumber, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    phoneNumber,
    password,
  });
};

export const requestResetPassword = (email) => {
  return axios.post(`${API_URL}/request-reset-password`, null, {
    params: { email },
  });
};

