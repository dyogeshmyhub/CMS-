import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import CategoryPage from './pages/CategoryPage'
import ListingDetail from './pages/ListingDetail'
import PostAd from './pages/PostAd'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Favorites from './pages/Favorites'
import CmsPage from './pages/CmsPage'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'
import UserDashboard from './pages/UserDashboard'
import UserProfile from './pages/UserProfile'
import MyListings from './pages/MyListings'
import Dashboard from './pages/admin/Dashboard'
import ManageListings from './pages/admin/ManageListings'
import ManageCategories from './pages/admin/ManageCategories'
import ManagePages from './pages/admin/ManagePages'
import ManageUsers from './pages/admin/ManageUsers'
import ManageAdvertisements from './pages/admin/ManageAdvertisements'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import ManageAdmins from './pages/ManageAdmins'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/classified" element={<CategoryPage />} />
        <Route path="/renting" element={<CategoryPage />} />
        <Route path="/housing" element={<CategoryPage />} />
        <Route path="/events" element={<CategoryPage />} />
        <Route path="/gold" element={<CategoryPage />} />
        <Route path="/community" element={<CategoryPage />} />
        <Route path="/ethnicity" element={<CategoryPage />} />
        <Route path="/membership" element={<CategoryPage />} />
        <Route path="/funding" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/post-ad" element={<PostAd />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pages/:slug" element={<CmsPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/my-listings" element={<MyListings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="pages" element={<ManagePages />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="advertisements" element={<ManageAdvertisements />} />
          <Route path="reports" element={<Dashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="advertisements" element={<ManageAdvertisements />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="reports" element={<Dashboard />} />
          <Route path="settings" element={<SuperAdminDashboard />} />
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
