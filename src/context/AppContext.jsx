import {createContext, useContext, useEffect, useMemo, useReducer, useState} from 'react'
import {Cart} from '../models'

const CartContext = createContext(null)
const CategoryContext = createContext(null)

function cartReducer(state, action) {
    switch (action.type) {
        case 'add': {
            const found = state.items.find((item) => item.id === action.product.id)
            const items = found
                ? state.items.map((item) => item.id === action.product.id ? {
                    ...item,
                    quantity: item.quantity + 1
                } : item)
                : [...state.items, {...action.product, quantity: 1}]
            return {items}
        }
        case 'remove':
            return {items: state.items.filter((item) => item.id !== action.id)}
        case 'change':
            return {
                items: state.items.map((item) => item.id === action.id ? {
                    ...item,
                    quantity: Math.max(1, action.quantity)
                } : item)
            }
        case 'clear':
            return {items: []}
        default:
            return state
    }
}

function getInitialCart() {
    try {
        return {items: JSON.parse(localStorage.getItem('cm-cart') || '[]')}
    } catch {
        return {items: []}
    }
}

export function CartProvider({children}) {
    const [state, dispatch] = useReducer(cartReducer, undefined, getInitialCart)
    useEffect(() => localStorage.setItem('cm-cart', JSON.stringify(state.items)), [state.items])
    const cart = useMemo(() => new Cart(state.items), [state.items])
    const value = useMemo(() => ({
        items: state.items,
        total: cart.total,
        count: cart.count,
        dispatch
    }), [cart, state.items])
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const value = useContext(CartContext)
    if (!value) throw new Error('useCart must be used inside CartProvider')
    return value
}

export function CategoryProvider({children}) {
    const [category, setCategory] = useState('all')
    return <CategoryContext.Provider value={{category, setCategory}}>{children}</CategoryContext.Provider>
}

export function useCategory() {
    const value = useContext(CategoryContext)
    if (!value) throw new Error('useCategory must be used inside CategoryProvider')
    return value
}
