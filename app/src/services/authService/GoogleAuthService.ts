import axios from 'axios';
import {SignupForm} from '../../models/authModel';

const API_URL = 'http://10.0.2.2:8000/api'; // Update with your actual backend URL

// Define the types for the API response (user data)

// Signup function
const signup = async (signupData: SignupForm): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/register`, signupData);

    if (response.status === 200) {
      return response.data; // Ensure response contains phone_number and role_id
    } else {
      throw new Error('Failed to sign up');
    }
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      throw new Error(
        error.response.data.message || 'An error occurred during signup',
      );
    } else {
      throw new Error('Network error, please try again');
    }
  }
};

// Login function
const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      return response.data; // Ensure response contains phone_number and role_id
    } else {
      throw new Error('Failed to login');
    }
  } catch (error: any) {
    throw new Error('Login failed, please check your credentials');
  }
};

export default {
  login,
  signup,
};
