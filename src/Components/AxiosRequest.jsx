import axios from 'axios';

const AxiosRequest = axios.create({
    baseURL : 'http://localhost:61525'
});

export default AxiosRequest;