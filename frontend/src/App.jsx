import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Funcionarios from './pages/Funcionarios';                                  // hernique agostinetto piva
import CadastraFuncionario from './pages/CadastraFuncionario';
import Clientes from './pages/Clientes';
import CadastraCliente from './pages/CadastraCliente';
import Produtos from './pages/Produtos';
import CadastraProduto from './pages/CadastraProduto';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/funcionarios" element={<Funcionarios />} />
              <Route path="/cadastra-funcionario" element={<CadastraFuncionario />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/cadastra-cliente" element={<CadastraCliente />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/cadastra-produto" element={<CadastraProduto />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CustomThemeProvider>
    </AuthProvider>
  );
}