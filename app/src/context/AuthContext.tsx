import React, {createContext, useState, useContext, useEffect} from 'react';
import AuthService from '../services/authService/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiResponseModel} from '../model/apiResponseModel';
import {handleApiError} from '../utils/handleError';
import TOKEN_KEY from '../config/tokenConfig';
import {LoginForm, SignupForm} from '../model/authModel';

interface User {
  userId?: string;
  fullname?: string;
  email?: string;
  phone_number?: string;
  freeTrial?: boolean;
  role: string;
  token?: string;
}

interface AuthContextType {
  setUser: (user: any | null) => void;
  isProfileSetupDone: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  userRole: string | null;
  isLoading: boolean;
  isOnboardingDoneState: boolean | null;
  user: User | null;
  authToken: string | null;
  username: string | null;
  login: (loginData: LoginForm) => Promise<any>;
  signup: (signupData: SignupForm) => Promise<any>;
  logout: () => Promise<void>;
  SendOtp: (loginData: LoginForm) => Promise<ApiResponseModel>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isProfileSetupDone, setIsProfileSetupDone] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const [isOnboardingDoneState, setIsOnboardingDoneState] = useState<
    boolean | null
  >(null);

  const SendOtp = async (loginData: LoginForm): Promise<ApiResponseModel> => {
    try {
      const response: ApiResponseModel = await AuthService.doSendOtp(loginData);
      console.log('Login response', response);
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return {
        success: false,
        message: errorMessage,
        data: null,
        error: (error as any).message,
      };
    }
  };

  const login = async (
    VerifyloginData: LoginForm,
  ): Promise<ApiResponseModel> => {
    try {
      const response: ApiResponseModel = await AuthService.doLogin(
        VerifyloginData,
      );
      console.log('from backend', response);
      if (response.success && response.token) {
        const {token, _id, name, email, phone, freeTrial, role} = response;
        const userRole = role ?? 'customer';
        const userWithoutToken: User = {
          userId: _id ?? '',
          fullname: name ?? 'User',
          email: email ?? '',
          phone_number: phone ?? '',
          freeTrial: freeTrial ?? false,
          role: userRole,
          token,
        };
        setUser(userWithoutToken);
        setUserId(_id ?? null);
        setUserRole(userRole);
        setAuthToken(token);
        setUsername(name || 'User');
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutToken));
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem('userId', _id ?? '');
        await AsyncStorage.setItem('userRole', userRole);
        await AsyncStorage.setItem('username', name ?? '');
        setisLoggedIn(true);
        return {
          success: true,
          message: response.message,
          data: {...userWithoutToken, token},
          error: null,
        };
      }

      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return {
        success: false,
        message: errorMessage,
        data: null,
        error: (error as any).message,
      };
    }
  };

  const signup = async (signupData: SignupForm): Promise<ApiResponseModel> => {
    try {
      const response: ApiResponseModel = await AuthService.doSignup(signupData);
      console.log('Signup response ===>', response);

      if (response.success && response.token) {
        const {token, _id, name, email, phone, freeTrial, role} = response;
        const userRole = role ?? 'customer';
        const userWithoutToken: User = {
          userId: _id ?? '',
          fullname: name ?? 'User',
          email: email ?? '',
          phone_number: phone ?? '',
          freeTrial: freeTrial ?? true,
          role: userRole,
          token,
        };

        // Update states
        setUser(userWithoutToken);
        setUserId(_id ?? null);
        setUserRole(userRole);
        setAuthToken(token);
        setUsername(name || 'User');
        setisLoggedIn(true);

        // Persist to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutToken));
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem('userId', _id ?? '');
        await AsyncStorage.setItem('userRole', userRole);
        await AsyncStorage.setItem('username', name ?? '');

        return {
          success: true,
          message: response.message,
          data: {...userWithoutToken, token},
          error: null,
        };
      }

      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return {
        success: false,
        message: errorMessage,
        data: null,
        error: (error as any).message,
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');
      setUser(null);
      setUserId(null);
      setUserRole(null);
      setAuthToken(null);
      setisLoggedIn(false);
      setIsProfileSetupDone(false);
    } catch (error) {
      console.error('Logout error', error);
      throw error;
    }
  };

  const isTokenAvailable = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const user = await AsyncStorage.getItem('user');
      const userId = await AsyncStorage.getItem('userId');
      const userRole = await AsyncStorage.getItem('userRole');
      if (token && user) {
        setAuthToken(token);
        setUser(JSON.parse(user));
        setUserId(userId);
        setUserRole(userRole);
        setisLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking token availability', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isTokenAvailable();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        setUser,
        isOnboardingDoneState,
        isLoggedIn,
        isLoading,
        userId,
        userRole,
        user,
        authToken,
        username,
        login,
        signup,
        logout,
        SendOtp,
        isProfileSetupDone,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
