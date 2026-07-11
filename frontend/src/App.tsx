import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'
import DashboardPage from './pages/Dashboard'
import ClientesPage from './pages/Clientes'
import ClientePerfilPage from './pages/ClientePerfil'
import PedidosPage from './pages/Pedidos'
import ProdutosPage from './pages/Produtos'
import AlertasPage from './pages/Alertas'
import OportunidadesPage from './pages/Oportunidades'
import ProtectedRoute from './pages/ProtectedRoute'
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/:id" element={<ClientePerfilPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/alertas" element={<AlertasPage />} />
          <Route path="/oportunidades" element={<OportunidadesPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
