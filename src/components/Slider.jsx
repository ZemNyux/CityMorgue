import {ArrowLeft, ArrowRight} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'

export function Slider({slides}) {
    const [active, setActive] = useState(0)
    const timer = useRef(null)
    const go = (next) => setActive((current) => (current + next + slides.length) % slides.length)
    useEffect(() => {
        timer.current = setInterval(() => go(1), 6000);
        return () => clearInterval(timer.current)
    }, [slides.length])
    const slide = slides[active]
    return <div className="hero-slider">
        <div className="slide-image"
             style={{backgroundImage: `linear-gradient(90deg, rgba(6,6,6,.86), rgba(6,6,6,.15)), url(${slide.image})`}}/>
        <div className="slide-content"><span className="eyebrow">{slide.eyebrow}</span>
            <h2>{slide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{slide.caption}</p></div>
        <div className="slide-controls">
            <div className="slide-dots">{slides.map((item, index) => <button key={item.eyebrow}
                                                                             className={index === active ? 'active' : ''}
                                                                             onClick={() => setActive(index)}
                                                                             aria-label={`Слайд ${index + 1}`}/>)}</div>
            <div>
                <button className="icon-button" onClick={() => go(-1)} aria-label="Предыдущий слайд"><ArrowLeft
                    size={16}/></button>
                <button className="icon-button" onClick={() => go(1)} aria-label="Следующий слайд"><ArrowRight
                    size={16}/></button>
            </div>
        </div>
    </div>
}
