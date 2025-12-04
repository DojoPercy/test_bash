import axios from 'axios';

const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
}

export const api = axios.create(API_CONFIG);

 

