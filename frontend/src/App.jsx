// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import HomePage from './pages/HomePage'
import StudentsPage from './pages/StudentsPage'
import TeachersPage from './pages/TeachersPage'
import ContributorsPage from './pages/ContributorsPage'
import FinancePage from './pages/FinancePage'
import RafflesPage from './pages/RafflesPage'
import UsersPage from './pages/UsersPage'
import AuditPage from './pages/AuditPage'

function Guard({ children, role }) {
  const { isAuth, isAdmin, isSA } = useAuthStore()
  if (!isAuth) return <Navigate to="/" replace/>
  if (role === 'admin' && !isAdmin()) return <Navigate to="/" replace/>
  if (role === 'superadmin' && !isSA()) return <Navigate to="/" replace/>
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/alunos" element={<StudentsPage/>}/>
        <Route path="/professores" element={<TeachersPage/>}/>
        <Route path="/financeiro" element={<FinancePage/>}/>
        <Route path="/rifas" element={<RafflesPage/>}/>
        <Route path="/contribuidores" element={<ContributorsPage/>}/>

        <Route path="/admin/users" element={<Guard role="superadmin"><UsersPage/></Guard>}/>
        <Route path="/admin/audit" element={<Guard role="superadmin"><AuditPage/></Guard>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}
