import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {CartProvider, CategoryProvider} from './context/AppContext'
import {store} from './store'
import {Footer, Header} from './components/UI'
import HomePage from './pages/HomePageNew.jsx'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'
import './styles.css'

const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: 60_000, retry: 1}}})

export default function App() {
    return <Provider store={store}><QueryClientProvider
        client={queryClient}><BrowserRouter><CartProvider><CategoryProvider><Header/><Routes><Route path="/" element={
        <HomePage/>}/><Route path="/shop" element={<ShopPage/>}/><Route path="/cart" element={<CartPage/>}/><Route
        path="/checkout" element={<CheckoutPage/>}/><Route path="/admin"
                                                           element={<AdminPage/>}/></Routes><Footer/></CategoryProvider></CartProvider></BrowserRouter></QueryClientProvider></Provider>
}
