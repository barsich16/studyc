import axios from "axios";

const $authHost = axios.create({
    // baseURL: 'http://localhost:3000'
    baseURL: 'https://studyc.herokuapp.com'
});
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`;
    return config;
}
$authHost.interceptors.request.use(authInterceptor);

export {$authHost};
