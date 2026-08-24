import {useQuery} from '@tanstack/react-query'
import {Filter, PackageSearch, SlidersHorizontal} from 'lucide-react'
import {useEffect, useMemo, useRef, useState} from 'react'
import {apiFetch} from '../api/mockApi'
import {categories} from '../data'
import {useCategory} from '../context/AppContext'
import {Loader, Modal, ProductCard, SectionIntro} from '../components/UI'

export default function ShopPage() {
    const {category, setCategory} = useCategory()
    const [query, setQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(6)
    const [selected, setSelected] = useState(null)
    const sentinel = useRef(null)
    const productsQuery = useQuery({queryKey: ['products'], queryFn: () => apiFetch('/products')})
    const filtered = useMemo(() => (productsQuery.data || []).filter((product) => (category === 'all' || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())), [productsQuery.data, category, query])
    useEffect(() => setVisibleCount(6), [category, query])
    useEffect(() => {
        const node = sentinel.current
        if (!node) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 3, filtered.length))
        }, {rootMargin: '180px'})
        observer.observe(node)
        return () => observer.disconnect()
    }, [filtered.length])
    return <>
        <main className="page-top">
            <section className="page-grid shop-hero"><SectionIntro eyebrow="THE MORGUE STORE / 001"
                                                                   title={<>Wear the<br/><span>evidence.</span></>}
                                                                   text="Лимитированный мерч, физические релизы и вещи для тех, кто любит, когда графика говорит громче слов."/>
                <div className="shop-stats">
                    <span>12<br/><small>OBJECTS</small></span><span>05<br/><small>COLLECTIONS</small></span><span>WORLDWIDE<br/><small>SHIPPING</small></span>
                </div>
            </section>
            <section className="page-grid shop-content">
                <aside className="filter-sidebar">
                    <div className="filter-title"><Filter size={16}/> FILTERS</div>
                    <div className="category-list">{categories.map((item) => <button
                        className={category === item.id ? 'active' : ''} key={item.id}
                        onClick={() => setCategory(item.id)}><span>{item.name}</span><small>{item.count}</small>
                    </button>)}</div>
                    <div className="side-note">
                        <SlidersHorizontal size={18}/>
                    </div>
                </aside>
                <div className="catalog">
                    <div className="catalog-toolbar"><strong>{filtered.length} OBJECTS
                        FOUND</strong><label>SEARCH <input value={query}
                                                           onChange={(event) => setQuery(event.target.value)}
                                                           placeholder="название..."/></label></div>
                    {productsQuery.isPending ? <Loader label="LOADING CATALOG..."/> : productsQuery.isError ?
                        <div className="empty-state"><PackageSearch size={36}/><p>Не удалось загрузить каталог.</p>
                        </div> : <>
                            <div className="product-grid">{filtered.slice(0, visibleCount).map((product) => <ProductCard
                                key={product.id} product={product} onDetails={setSelected}/>)}</div>
                            <div ref={sentinel}
                                 className="infinite-sentinel">{visibleCount < filtered.length ? 'SCROLL TO LOAD MORE' : '— END OF CATALOG —'}</div>
                        </>}</div>
            </section>
        </main>
        <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name}>
            <div className="product-modal">
                <div className={`product-art large ${selected?.visual}`}><span className="product-monogram">CM</span>
                </div>
                <div><p>{selected?.description}</p><strong className="modal-price">${selected?.price}</strong><p
                    className="muted">Категория: {selected?.category}</p></div>
            </div>
        </Modal>
    </>
}
