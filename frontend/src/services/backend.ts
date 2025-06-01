import axios from 'axios';

// URL do backend obtida do .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Criação de uma instância do Axios
const backend = axios.create({
  baseURL: backendUrl, // Define a URL base para todas as requisições
  timeout: 5000,       // Define um timeout padrão (opcional)
});

export default backend;