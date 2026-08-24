import {useQuery} from '@tanstack/react-query'
import {ArrowDown, ArrowRight, ExternalLink, Play, Radio, Skull} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {apiFetch} from '../api/mockApi'
import {albums, events, timeline, visualSlides} from '../data'
import {SectionIntro, TrackList} from '../components/UI'
import {Slider} from '../components/Slider'

const PREVIEW_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
const cover = (url) => url.replace('100x100bb', '600x600bb')

const albumArt = {
    vol1: cover(
        'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ad/13/32/ad13320b-9973-20d1-46d7-ed2bc9082225/00602577013348.rgb.jpg/100x100bb.jpg',
    ),
    vol2: cover(
        'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/f9/fe/6b/f9fe6b16-23cb-be1d-93b1-4b5291605299/19UM1IM08770.rgb.jpg/100x100bb.jpg',
    ),
    toxic: cover(
        'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f3/ef/3b/f3ef3bcf-1e2e-fb30-2f25-c17b2cc80805/20UMGIM61475.rgb.jpg/100x100bb.jpg',
    ),
    vol3: cover(
        'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/85/bc/6b85bcae-314a-152d-c4cc-9a0a8753e290/21UM1IM25271.rgb.jpg/100x100bb.jpg',
    ),
    mba: cover(
        'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/65/e5/17/65e51712-59db-4c9f-e7ad-7790df122415/23UMGIM53329.rgb.jpg/100x100bb.jpg',
    ),
}
export default function HomePage() {
    const tracksQuery = useQuery({queryKey: ['tracks'], queryFn: () => apiFetch('/tracks')})
    const [activeTrack, setActiveTrack] = useState(null)
    const audio = useRef(null)
    useEffect(() => () => audio.current?.pause(), [])
    const onPlay = (track) => {
        if (activeTrack === track.id) {
            audio.current?.pause();
            setActiveTrack(null);
            return;
        }

        audio.current?.pause();
        audio.current = new Audio(track.link);
        audio.current.play().catch(() => {});
        audio.current.onended = () => setActiveTrack(null);
        setActiveTrack(track.id);
    };

    return <main>


        <section className="hero-section page-grid">

            <div className="hero-copy"><span className="eyebrow">CITY MORGUE</span>

                <h1>THE<br/><em>NOISE</em><br/>NEVER<br/>DIES.</h1>
                <p className="hero-lede">Хроника дуэта, который
                    превратил рэп в хоррор-саундтрек Нью-Йорка.
                    История ZillaKami и SosMula: от подвала SoundCloud и панк-рэпа до финального альбома My Bloody America. </p>

                <div className="hero-actions">
                    <a className="button button-red" href="#story">Enter the archive <ArrowDown size={16}/> </a>

                    <Link className="button button-ghost" to="/shop">Магазин<ArrowRight size={16}/> </Link>

                    <a className="button button-black" href="#history">История<ArrowDown size={16}/> </a>
                </div>
            </div>

            <div className="hero-grid">
                <div className="hero-art">
                    <img src={albumArt.toxic} alt="City Morgue Toxic Boogaloo cover" />
                    <img src={albumArt.vol2} alt="City Morgue As Good As Dead cover" />
                    <img src={albumArt.mba} alt="City Morgue My Bloody America cover" />
                </div>
            </div>
        </section>
        <section className="ticker">
            <div className="ticker-track"> CITY MORGUE ✶ ZILLAKAMI ✶ SOSMULA ✶ TRAP METAL ✶ HORRORCORE ✶ PUNK RAP ✶ CITY
                MORGUE ✶ ZILLAKAMI ✶ SOSMULA✶
            </div>
        </section>
        <section id="story" className="section page-grid story-section"><SectionIntro eyebrow="01 / ORIGIN STORY"
                                                                                      title={<>Как они стали<br/><span>City Morgue?</span></>}
                                                                                      text="Не просто группа, а короткое замыкание между рэпом, metal и панк-этикой. Ниже — путь от локального шума до культового архива."/>
            <div className="timeline">{timeline.map((item, index) => <article className="timeline-item" key={item.year}>
                <div className="timeline-marker">0{index + 1}</div>
                <div className="timeline-year">{item.year}</div>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>)}</div>
        </section>

        <section className="section meaning-section">
            <div className="page-grid meaning-grid">

                <div className="meaning-visual">
                    <img src="/dist/assets/Снимок%20экрана%202026-08-24%20174414.png" alt="City Morgue visual" />
                </div>

                <div className="meaning-copy">
                    <span className="eyebrow">02 / WHAT IT MEANS</span>
                    <h2>Грязь — это<br/><em>не стиль.</em></h2>

                    <p>Это способ говорить о страхе, зависимости, насилии, одиночестве и выживании без лака. City Morgue берут экстремальные образы из хоррора и улицы, доводят их до предела — и оставляют слушателю пространство для собственного прочтения.</p>

                    <div className="meaning-tags">
                        <span>TRAP METAL</span>
                        <span>SHOCK RAP</span>
                        <span>DIY ENERGY</span>
                    </div>
                </div>

            </div>
        </section>
        <section className="section page-grid music-section"><SectionIntro eyebrow="03 / SONGS WITH TEETH"
                                                                           title="Треки, которые\nоставили след"
                                                                           text="Нажми play для демо-превью, а open ↗ — чтобы открыть релиз в Spotify. Истории треков — часть звукового архива."/>
            <div className="music-layout">
                <div className="music-note"><Radio
                    size={20}/><span>PREVIEW PLAYER<br/><small>external audio / demo</small></span></div>
                {tracksQuery.isPending ? <div className="loader">LOADING TRACKS...</div> :
                    <TrackList tracks={tracksQuery.data || []} onPlay={onPlay} activeId={activeTrack}/>}</div>
        </section>
        <section id="history" className="section page-grid releases-section"><SectionIntro eyebrow="04 / RELEASES"
                                                                              title="Четыре<br /><span>тёмные главы</span>"/>
            <div className="album-grid">{albums.map((album) => <article className="album-card" key={album.title}>
                <div className={`album-cover ${album.className}`}>
                    <small>{album.subtitle}</small><strong>{album.title}</strong><span>{album.year} / CITY MORGUE</span>
                </div>
                <div className="album-fact"><span>{album.year}</span><p>{album.fact}</p></div>
            </article>)}</div>
        </section>
        <section className="section slider-section">
            <div className="page-grid"><SectionIntro eyebrow="05 / VISUAL EVIDENCE"
                                                     title="Сцена как<br />место преступления"/></div>
            <Slider slides={visualSlides}/></section>
        <section className="section page-grid events-section"><SectionIntro eyebrow="06 / LIVE FILES"
                                                                            title="Громкие даты"
                                                                            text="Совместные туры, сольные сеты и тот самый момент, когда записи перестают быть записью."/>
            <div className="events-list">{events.map((event) => <article className="event-row"
                                                                         key={`${event.date}-${event.city}`}><span
                className={`event-status ${event.status}`}>{event.status}</span>
                <time>{event.date}</time>
                <strong>{event.city}</strong><span>{event.type}</span><ExternalLink size={15}/></article>)}</div>
        </section>
        <section className="final-cta page-grid">
            <div><span className="eyebrow">THE ARCHIVE IS NEVER CLOSED</span><h2>Take the noise<br/><em>with you.</em>
            </h2></div>
            <Link className="button button-red" to="/shop">Open the store <ArrowRight size={16}/></Link></section>
    </main>
}
