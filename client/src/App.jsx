import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Favorites from './pages/Favorites'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import Account from './pages/Account'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className='flex min-h-dvh flex-col'>
        <Navbar />

        <main className='flex-1 pt-16'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/favorites' element={<Favorites />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/account' element={<Account />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/my-orders' element={<MyOrders />} />
              <Route path='/order-confirmation/:orderId' element={<OrderConfirmation />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route path='/admin' element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
