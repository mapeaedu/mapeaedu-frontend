import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

// Create a base API client with common configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle common errors (401, 403, 500, etc.)
        if (error.response) {
            const {status} = error.response;

            if (status === 401) {
                // Handle unauthorized (e.g., redirect to login)
                console.error('Unauthorized access');
                // You might want to redirect to login page or clear auth state
            } else if (status === 403) {
                // Handle forbidden
                console.error('Forbidden access');
            } else if (status === 500) {
                // Handle server error
                console.error('Server error');
            }
        } else if (error.request) {
            // Handle network errors


            console.error('Network error', error.request);
        } else {
            // Handle other errors
            console.error('Error', error.message);
        }

        return Promise.reject(error);
    }
);

// Helper functions for API calls
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
};

export const apiPost = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    console.log(data);
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
};

export const apiPut = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
};

export default apiClient;