import axios from 'axios';

export const http = axios.create({

    // baseURL: `http://localhost:3333/`
    baseURL: `http://127.0.0.1:8000/`
})


