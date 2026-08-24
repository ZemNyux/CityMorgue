import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {ArrowUpRight, Check, LoaderCircle, X} from 'lucide-react'
import {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, NavLink} from 'react-router-dom'
import {toggleLanguage} from '../store'
import {useCart} from '../context/AppContext'

export function Header() {
    const {count} = useCart()
    const dispatch = useDispatch()
    const language = useSelector((state) => state.preferences.language)
    const [menuOpen, setMenuOpen] = useState(false)
    const links = [['/', 'Архив'], ['/shop', 'Мерч'], ['/cart', 'Корзина'], ['/admin', 'Admin']]
    return <header className="site-header">
        <Link className="brand" to="/"><span>CITY<br/>MORGUE</span></Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}
                                                 onClick={() => setMenuOpen(false)}>{label}{to === '/cart' && count > 0 ?
                <small>{count}</small> : null}</NavLink>)}
        </nav>
        <div className="header-actions">
            <button className="lang-switch" onClick={() => dispatch(toggleLanguage())}>{language}</button>
            <Link className="header-cta" to="/shop">Enter store <ArrowUpRight size={14}/></Link>
            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">{menuOpen ?
                <X size={18}/> : 'MENU'}</button>
        </div>
    </header>
}

export function SectionIntro({eyebrow, title, text, action}) {
    return <div className="section-intro">
        <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
        <div className="section-intro-copy">{text && <p>{text}</p>}{action}</div>
    </div>
}

export function Modal({open, onClose, title, children}) {
    return <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="modal-root" onClose={onClose}>
            <TransitionChild as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0"
                             enterTo="opacity-100" leave="transition ease-in duration-150" leaveFrom="opacity-100"
                             leaveTo="opacity-0">
                <div className="modal-backdrop"/>
            </TransitionChild>
            <div className="modal-wrap"><TransitionChild as={Fragment} enter="transition ease-out duration-200"
                                                         enterFrom="opacity-0 translate-y-4"
                                                         enterTo="opacity-100 translate-y-0"
                                                         leave="transition ease-in duration-150"
                                                         leaveFrom="opacity-100 translate-y-0"
                                                         leaveTo="opacity-0 translate-y-4"><DialogPanel
                className="modal-panel">
                <button className="icon-button modal-close" onClick={onClose} aria-label="Закрыть"><X size={18}/>
                </button>
                <DialogTitle className="modal-title">{title}</DialogTitle>{children}</DialogPanel></TransitionChild>
            </div>
        </Dialog>
    </Transition>
}

export function Loader({label = 'ЗАГРУЗКА...'}) {
    return <div className="loader"><LoaderCircle size={20} className="spin"/> {label}</div>
}

export function Notice({children, type = 'success'}) {
    return <div className={`notice notice-${type}`}><Check size={16}/> {children}</div>
}

export function TrackList({tracks, onPlay, activeId}) {
    return <div className="track-list">{tracks.map((track, index) => <TrackItem key={track.id} track={track}
                                                                                index={index} onPlay={onPlay}
                                                                                activeId={activeId}/>)}</div>
}

export function TrackItem({track, index, onPlay, activeId}) {
    const active = activeId === track.id

    return <article className={`track-row ${active ? 'is-playing' : ''}`}>
        <span className="track-index">0{index + 1}</span>

        <button className="track-play" onClick={() => onPlay(track)}
                aria-label={`Слушать ${track.title}`}>{active ? 'Ⅱ' : '▶'}
        </button>

        <div className="track-main">
            <h3>{track.title}</h3>
            <p>{track.story}</p>
        </div>

        <span className="track-year">{track.year}</span>

        <a className="track-link" href={track.spotify} target="_blank" rel="noreferrer">open </a>
    </article>
}

export function ProductCard({product, onDetails}) {
    const {dispatch} = useCart()
    const [added, setAdded] = useState(false)
    const add = () => {
        dispatch({type: 'add', product});
        setAdded(true);
        setTimeout(() => setAdded(false), 1300)
    }
    return <article className="product-card">
        <button className={`product-art ${product.visual}`} onClick={() => onDetails(product)}
                aria-label={`Открыть ${product.name}`}>

            <span className="product-stamp">{product.tag}</span>
            <span className="product-monogram">CM</span>
            <span className="product-art-label">{product.name}</span>

        </button>
        <div className="product-meta">
            <div><h3>{product.name}</h3><p>{product.description}</p></div>
            <strong>${product.price}</strong></div>
        <button className={`add-button ${added ? 'added' : ''}`} onClick={add}>{added ? <><Check
            size={14}/> Added</> : 'Add to cart +'}</button>
    </article>
}

export function Footer() {
    return <footer className="site-footer">
        <div className="footer-top"><span className="footer-logo">CITY MORGUE<span>®</span></span><span>THE ARCHIVE / 2016—NOW</span><a
            href="https://www.citymorgueofficial.com/" target="_blank" rel="noreferrer">official site ↗</a></div>
        <div className="footer-bottom"><span>Built for the noise.</span><span>NYC / WORLDWIDE</span></div>
    </footer>
}
