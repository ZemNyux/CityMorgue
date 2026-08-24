import {categories, products, tracks} from '../data'
import {DigitalProduct, MerchProduct} from '../models'

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))
const asProducts = (list) => list.map((item) => new (item.category === 'records' ? DigitalProduct : MerchProduct)(item))

export async function apiFetch(endpoint, options = {}) {
    const method = options.method || 'GET'
    try {
        const response = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {'Content-Type': 'application/json', ...(options.headers || {})},
        })
        if (!response.ok) throw new Error(`REST ${response.status}`)
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) return response.json()
        throw new Error('REST endpoint returned a non-JSON response')
    } catch (error) {
        await wait()
        if (method === 'GET' && endpoint === '/products') return asProducts(products)
        if (method === 'GET' && endpoint === '/categories') return categories
        if (method === 'GET' && endpoint === '/tracks') return tracks
        if (method === 'POST' && endpoint === '/orders') {
            const payload = JSON.parse(options.body || '{}')
            const order = {...payload, id: `CM-${Date.now().toString(36).toUpperCase()}`, status: 'received'}
            const existing = JSON.parse(localStorage.getItem('cm-orders') || '[]')
            localStorage.setItem('cm-orders', JSON.stringify([order, ...existing]))
            return order
        }
        if (method === 'POST' && endpoint === '/products') return JSON.parse(options.body || '{}')
        throw error
    }
}
