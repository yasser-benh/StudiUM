import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Layouts/Sidebar';
import CreateUser from './Pages/Admin/users/Create_User';
import UserPage from './Pages/Admin/users/users';
import AdminUserPage from './Pages/Admin/users/User_details';
import ClubPage from './Pages/Admin/clubs/clubs';
import CreateClub from './Pages/Admin/clubs/Create_club';
import AnnouncePage from './Pages/Admin/announces/Annonces';
import CreateAnnouncePage from './Pages/Admin/announces/Create_annonces';
import AdminClubPage from './Pages/Admin/clubs/clubs_details';
import EventCalendarPage from './Pages/Admin/event/Event_Page';
import Login from './Pages/Login';
import ProtectedRoute from './utilis/ProtectedRoute';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const role = localStorage.getItem('role')as "admin" | "etudiant" | null;

  return (
    <div className="flex h-screen">
      {!isLoginPage && (
        <div className="w-64 fixed left-0 top-0 h-full bg-white shadow-md">
          <Sidebar role= {role || "etudiant"}/>
        </div>
      )}
      <div className={`flex-1 ${!isLoginPage ? 'ml-64' : ''} py-10 px-20`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
   
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />

          
          <Route path="/accueil" element={
            <ProtectedRoute><h1>Accueil</h1></ProtectedRoute>
          } />
          <Route path="/utilisateurs" element={
            <ProtectedRoute><UserPage /></ProtectedRoute>
          } />
          <Route path="/create_user" element={
            <ProtectedRoute><CreateUser /></ProtectedRoute>
          } />
          <Route path="/admin/user/:id" element={
            <ProtectedRoute><AdminUserPage /></ProtectedRoute>
          } />
          <Route path="/clubs" element={
            <ProtectedRoute><ClubPage /></ProtectedRoute>
          } />
          <Route path="/create_club" element={
            <ProtectedRoute><CreateClub /></ProtectedRoute>
          } />
          <Route path="/admin/club/:id" element={
            <ProtectedRoute><AdminClubPage /></ProtectedRoute>
          } />
          <Route path="/annonces" element={
            <ProtectedRoute><AnnouncePage /></ProtectedRoute>
          } />
          <Route path="/create_annonces" element={
            <ProtectedRoute><CreateAnnouncePage /></ProtectedRoute>
          } />
          <Route path="/event" element={
            <ProtectedRoute><EventCalendarPage /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    
  );
}

export default App;
