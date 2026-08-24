import {ArrowRight, Minus, Plus, ShoppingBag, Trash2} from 'lucide-react'
import {Link} from 'react-router-dom'
import {useCart} from '../context/AppContext'

export default function CartPage() {
    const {items, total, dispatch} = useCart()
    if (!items.length) return <main className="page-top empty-cart page-grid"><ShoppingBag size={44}
                                                                                           strokeWidth={1}/><span
        className="eyebrow">YOUR BAG / 00</span><h1>Здесь пока<br/><em>пусто.</em></h1><p>Добавь немного шума из
        каталога, чтобы продолжить.</p><Link className="button button-red" to="/shop">Go to store <ArrowRight
        size={16}/></Link></main>
    return <main className="page-top page-grid cart-page">
        <div className="cart-heading"><span
            className="eyebrow">YOUR BAG / {String(items.length).padStart(2, '0')}</span>
            <h1>Корзина<br/><em>артефактов.</em></h1></div>
        <div className="cart-layout">
            <div className="cart-items">{items.map((item) => <article className="cart-row" key={item.id}>
                <div className={`product-art mini ${item.visual}`}><span className="product-monogram">CM</span></div>
                <div className="cart-product"><h3>{item.name}</h3><p>{item.description}</p>
                    <strong>${item.price}</strong></div>
                <div className="quantity">
                    <button onClick={() => dispatch({type: 'change', id: item.id, quantity: item.quantity - 1})}><Minus
                        size={13}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch({type: 'change', id: item.id, quantity: item.quantity + 1})}><Plus
                        size={13}/></button>
                </div>
                <button className="icon-button remove-button" onClick={() => dispatch({type: 'remove', id: item.id})}
                        aria-label="Удалить"><Trash2 size={16}/></button>
            </article>)}</div>
            <aside className="cart-summary"><span className="eyebrow">ORDER SUMMARY</span>
                <div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div>
                <div><span>Shipping</span><span>calculated at checkout</span></div>
                <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                <Link className="button button-red wide" to="/checkout">Checkout <ArrowRight size={16}/></Link>
                <button className="text-button" onClick={() => dispatch({type: 'clear'})}>Clear bag</button>
            </aside>
        </div>
    </main>
}
