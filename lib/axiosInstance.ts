import axios from 'axios';
const createAxiosInstance = (accessToken: string) => {
    const instance = axios.create({
        baseURL: 'http://localhost:8000', // Replace with your API base URL
    });

    // Set the Authorization header for all requests
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return instance;
};

export default createAxiosInstance;
