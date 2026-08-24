import {useQuery} from '@tanstack/react-query'
import {Eye, Pencil, Plus, Save, Shield, Trash2, UserPlus} from 'lucide-react'
import {useEffect, useReducer, useState} from 'react'
import {apiFetch} from '../api/mockApi'
import {categories} from '../data'
import {Product} from '../models'
import {Loader, Modal} from '../components/UI'

const emptyForm = {name: '', category: 'tees', price: '', tag: 'new', visual: 'product-bloody', description: ''}

function adminReducer(state, action) {
    switch (action.type) {
        case 'set':
            return {...state, products: action.products}
        case 'add':
            return {...state, products: [{...action.product, id: `local-${Date.now()}`}, ...state.products]}
        case 'update':
            return {
                ...state,
                products: state.products.map((item) => item.id === action.product.id ? action.product : item)
            }
        case 'remove':
            return {...state, products: state.products.filter((item) => item.id !== action.id)}
        default:
            return state
    }
}

export default function AdminPage() {
    const productsQuery = useQuery({queryKey: ['products'], queryFn: () => apiFetch('/products')})
    const [state, dispatch] = useReducer(adminReducer, {products: []})
    const [form, setForm] = useState(emptyForm)
    const [editing, setEditing] = useState(null)
    const [userEmail, setUserEmail] = useState('')
    const [registered, setRegistered] = useState([])
    const [preview, setPreview] = useState(null)
    useEffect(() => {
        if (productsQuery.data) dispatch({type: 'set', products: productsQuery.data})
    }, [productsQuery.data])
    const update = (event) => setForm((current) => ({...current, [event.target.name]: event.target.value}))
    const saveProduct = (event) => {
        event.preventDefault()
        if (!form.name || !form.price) return
        const product = new Product({...form, price: Number(form.price)})
        if (editing) dispatch({type: 'update', product: {...product, id: editing}})
        else dispatch({type: 'add', product})
        setEditing(null);
        setForm(emptyForm)
    }
    const editProduct = (product) => {
        setEditing(product.id);
        setForm(product)
    }
    const register = (event) => {
        event.preventDefault();
        if (userEmail && !registered.includes(userEmail)) setRegistered((list) => [...list, userEmail]);
        setUserEmail('')
    }
    return <main className="page-top admin-page page-grid">
        <div className="admin-heading">
            <div><span className="eyebrow">BACK OFFICE / PRIVATE ARCHIVE</span><h1>Admin<br/><em>terminal.</em></h1>
            </div>
            <div className="admin-badge"><Shield size={17}/> AUTHENTICATED / LOCAL</div>
        </div>
        <div className="admin-dashboard">
            <section className="admin-panel">
                <div className="panel-heading">
                    <span><PackageIcon/> PRODUCTS CRUD</span><small>{state.products.length} items</small></div>
                {productsQuery.isPending ? <Loader label="SYNCING..."/> :
                    <div className="admin-table">{state.products.map((product) => <div className="admin-row"
                                                                                       key={product.id}>
                        <div className={`product-art tiny ${product.visual}`}><span
                            className="product-monogram">CM</span></div>
                        <div><strong>{product.name}</strong><small>{product.category} / ${product.price}</small></div>
                        <span className="admin-tag">{product.tag}</span>
                        <button className="icon-button" onClick={() => setPreview(product)}><Eye size={15}/></button>
                        <button className="icon-button" onClick={() => editProduct(product)}><Pencil size={15}/>
                        </button>
                        <button className="icon-button danger"
                                onClick={() => dispatch({type: 'remove', id: product.id})}><Trash2 size={15}/></button>
                    </div>)}</div>}</section>
            <section className="admin-panel product-editor">
                <div className="panel-heading"><span>{editing ? <Pencil size={16}/> :
                    <Plus size={16}/>} {editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</span></div>
                <form onSubmit={saveProduct} className="admin-form"><label>Name<input name="name" value={form.name}
                                                                                      onChange={update}
                                                                                      placeholder="Product name"/></label><label>Price<input
                    name="price" type="number" value={form.price} onChange={update} placeholder="42"/></label><label>Category<select
                    name="category" value={form.category}
                    onChange={update}>{categories.filter((item) => item.id !== 'all').map((item) => <option
                    key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Tag<select name="tag"
                                                                                                           value={form.tag}
                                                                                                           onChange={update}>
                    <option>new</option>
                    <option>core</option>
                    <option>archive</option>
                    <option>limited</option>
                </select></label><label className="wide">Description<textarea name="description"
                                                                              value={form.description}
                                                                              onChange={update}/></label>
                    <div className="admin-form-actions">
                        <button type="submit" className="button button-red"><Save
                            size={15}/> {editing ? 'Update' : 'Create'}</button>
                        {editing && <button type="button" className="text-button" onClick={() => {
                            setEditing(null);
                            setForm(emptyForm)
                        }}>Cancel</button>}</div>
                </form>
            </section>
        </div>
        <section className="admin-bottom">
            <div className="admin-panel user-panel">
                <div className="panel-heading"><span><UserPlus size={16}/> USER REGISTRATION</span></div>
                <form onSubmit={register} className="inline-form"><input type="email" value={userEmail}
                                                                         onChange={(event) => setUserEmail(event.target.value)}
                                                                         placeholder="fan@email.com" required/>
                    <button className="button button-ghost"><UserPlus size={14}/> Register</button>
                </form>
                {registered.length > 0 && <div className="registered-users">{registered.map((email) => <span
                    key={email}>{email} ✓</span>)}</div>}</div>
            <div className="admin-panel api-panel">
                <div className="panel-heading"><span>SERVER STATUS</span><small className="status-online">●
                    ONLINE</small></div>
                <p>GET /products · POST /orders</p><p className="muted">fetch → local fallback · TanStack cache ·
                localStorage</p></div>
        </section>
        <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="Product preview">
            <div className="product-modal">
                <div className={`product-art large ${preview?.visual}`}><span className="product-monogram">CM</span>
                </div>
                <div><h3>{preview?.name}</h3><p>{preview?.description}</p><strong
                    className="modal-price">${preview?.price}</strong></div>
            </div>
        </Modal></main>
}

function PackageIcon() {
    return <span className="package-icon">▦</span>
}
