import axios from 'axios';
import { BASE_URL, TIMEOUT, API_ENDPOINTS } from '../config/apiConfig';

// extrair apenas endpoints utilizados no service
const { AUTH } = API_ENDPOINTS;

// criar instancia do axios com configuracoes base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor de request para adicionar token nas requisicoes
// executado antes de cada requisicao
api.interceptors.request.use(
  (config) => {
    // capturar o token da sessao
    const token = sessionStorage.getItem('access_token');
    if (token) {
      // adicionar o token ao cabecalho da requisicao
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor de response para refresh automatico de token
// executado apos cada requisicao
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // capturar a requisicao original
    const originalRequest = error.config;
    
    // se o erro for 401 e nao for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // capturar o refresh token da sessao
        const refreshToken = sessionStorage.getItem('refresh_token');
        if (refreshToken) {
          // fazer requisicao na api para refresh token
          const response = await api.post(AUTH.REFRESH, {
            refresh_token: refreshToken,
          });
          
          // extrair os dados da resposta
          const { access_token, refresh_token, token_type, expires_in, refresh_expires_in } = response.data;
          
          // atualizar os dados do token na sessao
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);
          sessionStorage.setItem('token_type', token_type);
          sessionStorage.setItem('expires_in', expires_in);
          sessionStorage.setItem('refresh_expires_in', refresh_expires_in);
          sessionStorage.setItem('loginRealizado', 'true');
          
          // calcular novo tempo de expiracao
          const now = new Date().getTime();
          const expiresAt = now + (expires_in * 1000);
          const refreshExpiresAt = now + (refresh_expires_in * 1000);
          
          sessionStorage.setItem('expires_at', expiresAt);
          sessionStorage.setItem('refresh_expires_at', refreshExpiresAt);
          
          // refazer a requisicao original com novo token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // se o refresh falhar, limpar sessao e redirecionar para login
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else {
      // codigos de erro da api, diferente de 401: 400, 403, 404, 500
      // capturar mensagem de erro da api (detail)
      const errorMessage = error.response?.data?.detail || error.message || 'erro desconhecido';
      
      // adicionar a mensagem de erro ao objeto error para uso posterior
      error.apiMessage = errorMessage;
    }
    return Promise.reject(error);
  }
);

// servicos genericos da api
export const apiService = {
  // get request
  get: async (url, config = {}) => {
    return api.get(url, config);
  },
  // post request
  post: async (url, data, config = {}) => {
    return api.post(url, data, config);
  },
  // put request
  put: async (url, data, config = {}) => {
    return api.put(url, data, config);
  },
  // delete request
  delete: async (url, config = {}) => {
    return api.delete(url, config);
  },
};

// exporta a api por ultimo, ja com os interceptors atrelados a ela
export default api;