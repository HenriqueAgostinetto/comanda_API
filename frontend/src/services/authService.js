import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

// extrair apenas endpoints utilizados no service
const { AUTH } = API_ENDPOINTS;

// servicos de autenticacao
export const authService = {
  
  // login de usuario na api - obter token de acesso
  login: async (cpf, senha) => {
    try {
      // executa a requisicao de login na api
      const response = await api.post(AUTH.LOGIN, {
        cpf: cpf.replace(/\D/g, ''), // remove caracteres nao numericos do cpf
        senha: senha,
      });

      // extrai os dados da resposta
      const { access_token, refresh_token, token_type, expires_in, refresh_expires_in } = response.data;

      // persistir dados na sessionstorage
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('token_type', token_type);
      sessionStorage.setItem('expires_in', expires_in);
      sessionStorage.setItem('refresh_expires_in', refresh_expires_in);
      sessionStorage.setItem('loginRealizado', 'true');

      // calcular tempo de expiracao
      const now = new Date().getTime();
      const expiresAt = now + (expires_in * 1000);
      const refreshExpiresAt = now + (refresh_expires_in * 1000);

      // cria variaveis de expiracao
      sessionStorage.setItem('expires_at', expiresAt);
      sessionStorage.setItem('refresh_expires_at', refreshExpiresAt);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'erro ao realizar login',
      };
    }
  },

  // obtem dados do usuario logado
  getUserData: async () => {
    try {
      // executa a requisicao de obter dados do usuario na api
      const response = await api.get(AUTH.ME);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // logout do usuario
  logout: () => {
    // limpar dados da sessao
    sessionStorage.clear();
    // redirecionar para a pagina de login
    window.location.href = '/login';
  },

  // verificar se usuario esta autenticado
  isAuthenticated: () => {
    const token = sessionStorage.getItem('access_token');
    const expiresAt = sessionStorage.getItem('expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    // verificar se token nao expirou
    const now = new Date().getTime();
    return now < parseInt(expiresAt);
  },

  // verificar se token esta proximo de expirar (5 minutos)
  isTokenExpiringSoon: () => {
    const expiresAt = sessionStorage.getItem('expires_at');
    if (!expiresAt) return true;

    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos em ms
    return now > (parseInt(expiresAt) - fiveMinutes);
  },
};