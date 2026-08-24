import {useMutation} from '@tanstack/react-query'
import {ArrowLeft, ArrowRight, CheckCircle2} from 'lucide-react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {apiFetch} from '../api/mockApi'
import {Order} from '../models'
import {useCart} from '../context/AppContext'

const initialForm = {name: '', email: '', phone: '', country: '', city: '', address: '', consent: false}
const phonePattern = /^[+\d\s()\-]{7,20}$/

export default function CheckoutPage() {
    const {items, total, dispatch} = useCart()
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [completed, setCompleted] = useState(null)
    const navigate = useNavigate()
    const orderMutation = useMutation({
        mutationFn: (order) => apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify(order)
        })
    })
    const update = (event) => {
        const {name, value, type, checked} = event.target;
        setForm((current) => ({...current, [name]: type === 'checkbox' ? checked : value}))
    }
    const submit = async (event) => {
        event.preventDefault()
        const nextErrors = {}
        if (!form.name.trim()) nextErrors.name = 'Укажи имя'
        if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Проверь email'
        if (!phonePattern.test(form.phone)) nextErrors.phone = 'Проверь телефон'
        if (!form.country.trim()) nextErrors.country = 'Укажи страну'
        if (!form.address.trim()) nextErrors.address = 'Укажи адрес'
        if (!form.consent) nextErrors.consent = 'Нужно согласие'
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length || !items.length) return
        try {
            const order = new Order(form, items, total)
            const saved = await orderMutation.mutateAsync(order)
            dispatch({type: 'clear'})
            setCompleted(saved)
        } catch (error) {
            setErrors({submit: 'Сервер временно недоступен. Попробуй ещё раз.'})
        } finally {
            // finally is intentionally kept here for the async checkout lifecycle.
        }
    }
    if (completed) return <main className="page-top confirmation page-grid"><CheckCircle2 size={52}/><span
        className="eyebrow">ORDER RECEIVED / {completed.id}</span><h1>Спасибо за<br/><em>шум.</em></h1><p>Подтверждение
        отправлено на {form.email}. Мы сохранили заказ локально в демо-режиме.</p><Link className="button button-red"
                                                                                        to="/shop">Back to
        store <ArrowRight size={16}/></Link></main>
    return <main className="page-top page-grid checkout-page">
        <div className="checkout-heading"><Link className="back-link" to="/cart"><ArrowLeft size={15}/> back to
            bag</Link><span className="eyebrow">CHECKOUT / SECURE FORM</span><h1>Оформление<br/><em>заказа.</em></h1>
        </div>
        <div className="checkout-layout">
            <form className="checkout-form" onSubmit={submit} noValidate>
                <div className="form-section"><h2>01 / Contact</h2>
                    <div className="form-grid"><Field label="Name" name="name" value={form.name} onChange={update}
                                                      error={errors.name}/><Field label="Email" name="email"
                                                                                  type="email" value={form.email}
                                                                                  onChange={update}
                                                                                  error={errors.email}/><Field
                        label="Phone" name="phone" value={form.phone} onChange={update} error={errors.phone}/><Field
                        label="Country" name="country" value={form.country} onChange={update} error={errors.country}/>
                    </div>
                </div>
                <div className="form-section"><h2>02 / Delivery</h2>
                    <div className="form-grid"><Field label="City" name="city" value={form.city}
                                                      onChange={update}/><Field label="Address" name="address"
                                                                                value={form.address} onChange={update}
                                                                                error={errors.address} wide/></div>
                </div>
                <label className="checkbox-line"><input type="checkbox" name="consent" checked={form.consent}
                                                        onChange={update}/><span>I accept the archive terms and privacy policy.</span></label>{errors.consent &&
                <small className="form-error">{errors.consent}</small>}{errors.submit &&
                <p className="form-error">{errors.submit}</p>}
                <button className="button button-red"
                        disabled={orderMutation.isPending}>{orderMutation.isPending ? 'SENDING...' : <>Place
                    order <ArrowRight size={16}/></>}</button>
            </form>
            <aside className="checkout-summary"><span className="eyebrow">YOUR ORDER</span>{items.map((item) => <div
                className="checkout-item" key={item.id}>
                <span>{item.name} × {item.quantity}</span><strong>${item.price * item.quantity}</strong></div>)}
                <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            </aside>
        </div>
    </main>
}

function Field({label, name, type = 'text', value, onChange, error, wide}) {
    return <label className={`field ${wide ? 'wide' : ''}`}><span>{label}</span><input name={name} type={type}
                                                                                       value={value} onChange={onChange}
                                                                                       aria-invalid={Boolean(error)}/>{error &&
        <small className="form-error">{error}</small>}</label>
}
