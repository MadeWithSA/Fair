import { useState, useEffect, useRef, useMemo } from 'react'
import { Sun, Moon, Heart, ShoppingBag, ShoppingCart, Search, X, Eye, Star, ThumbsUp, Truck, Flame, Clock, Trash2, ShieldCheck, Zap, Percent, Headphones, ArrowDownRight, Check, Globe, LayoutGrid, Package, Coffee, Sparkles, Wind, Tv, Scissors, RotateCcw } from 'lucide-react'
import { T, LANGS } from './i18n'
import { PRODUCTS, SWATCH } from './data'

const CAT_ICONS = { all: LayoutGrid, large: Package, kitchen: Coffee, cleaning: Sparkles, climate: Wind, tv: Tv, beauty: Scissors }
const BADGE_CLS = { hit: 'bg-sky-600 text-white', new: 'bg-cyan-500 text-white', sale: 'bg-rose-500 text-white', rec: 'bg-sky-500 text-white', prem: 'bg-slate-800 text-white' }
const ADV_ICONS = [ShieldCheck, Zap, Percent, Headphones]
const INIT_FAVS = ['coffee', 'robot']

const useLS = (k, d) => {
  const [v, s] = useState(() => { try { const x = localStorage.getItem(k); return x ? JSON.parse(x) : d } catch { return d } })
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }, [k, v])
  return [v, s]
}
const fmt = (n, cur) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + cur
const nameOf = (p, t) => `${t.types[p.type].n} ${p.model}`

/* ---------- Animated background: drifting blobs + connected particles ---------- */
function Background({ dark }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    let w, h, raf, m = { x: 0.5, y: 0.5 }
    const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    const mv = (e) => { m = { x: e.clientX / w, y: e.clientY / h } }
    rs(); addEventListener('resize', rs); addEventListener('mousemove', mv)
    const P = Array.from({ length: 48 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1.5 + Math.random() * 3.5, vx: (Math.random() - 0.5) * 0.3, vy: -0.1 - Math.random() * 0.35, d: Math.random() }))
    const dot = dark ? 'rgba(56,189,248,.35)' : 'rgba(14,165,233,.25)'
    const loop = () => {
      x.clearRect(0, 0, w, h)
      P.forEach((p) => {
        p.x += p.vx + (m.x - 0.5) * p.d * 0.8; p.y += p.vy
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fillStyle = dot; x.fill()
      })
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.hypot(dx, dy)
        if (d < 130) { x.strokeStyle = (dark ? 'rgba(56,189,248,' : 'rgba(14,165,233,') + (0.14 * (1 - d / 130)) + ')'; x.beginPath(); x.moveTo(P[i].x, P[i].y); x.lineTo(P[j].x, P[j].y); x.stroke() }
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('mousemove', mv) }
  }, [dark])
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute -top-36 -left-32 w-[540px] h-[540px] rounded-full bg-sky-200/50 dark:bg-sky-500/10 blur-[120px] animate-blob-a" />
      <div className="absolute top-24 -right-28 w-[480px] h-[480px] rounded-full bg-cyan-100/70 dark:bg-cyan-400/10 blur-[110px] animate-blob-b" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[380px] rounded-full bg-sky-100/60 dark:bg-blue-500/10 blur-[130px] animate-blob-a" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  const r = useRef(null); const [v, s] = useState(false)
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { s(true); o.disconnect() } }, { threshold: 0.08 }); o.observe(r.current); return () => o.disconnect() }, [])
  return <div ref={r} style={{ transitionDelay: delay + 'ms' }} className={`reveal ${v ? 'in' : ''} ${className}`}>{children}</div>
}

function Card({ p, t, i, fav, liked, likes, onFav, onLike, onAdd, onOpen }) {
  const ref = useRef(null)
  const move = (e) => {
    if (innerWidth < 768) return
    const b = ref.current.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top
    ref.current.style.transform = `perspective(1000px) rotateX(${((y - b.height / 2) / (b.height / 2)) * -3.5}deg) rotateY(${((x - b.width / 2) / (b.width / 2)) * 3.5}deg) translateY(-4px)`
  }
  const leave = () => { ref.current.style.transform = '' }
  const disc = Math.round((1 - p.price / p.old) * 100)
  return (
    <Reveal delay={Math.min(i * 40, 320)}>
      <article ref={ref} onMouseMove={move} onMouseLeave={leave} className="tilt group h-full flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-fair-card border border-sky-100 dark:border-fair-border hover:border-sky-400 shadow-sm hover:shadow-xl hover:shadow-sky-900/10">
        <div>
          <div className="relative aspect-[4/3] bg-fair-ice dark:bg-slate-900 overflow-hidden">
            <img src={p.img} alt={nameOf(p, t)} loading="lazy" onClick={() => onOpen(p.id)} className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-sm ${BADGE_CLS[p.badge]}`}>{t.badges[p.badge]}</span>
              <span className="px-2 py-0.5 rounded-lg bg-white/95 dark:bg-slate-900/90 text-sky-700 dark:text-sky-300 text-[11px] font-bold">-{disc}%</span>
            </div>
            <button onClick={() => onFav(p.id)} aria-label={t.fav} className={`absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-100 dark:border-slate-700 flex items-center justify-center hover:scale-105 active:scale-90 transition-all ${fav ? 'animate-pop' : ''}`}>
              <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-slate-300'}`} />
            </button>
            <button onClick={() => onOpen(p.id)} className="absolute bottom-3 left-3 right-3 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 text-xs font-bold shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-500" />{t.quick}
            </button>
          </div>
          <div className="p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-sky-600 dark:text-sky-400">{t.cats[p.cat]}</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{p.rating} <span className="text-slate-400 font-normal">({p.rev})</span></span>
            </div>
            <h3 onClick={() => onOpen(p.id)} className="cursor-pointer text-base font-extrabold leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{nameOf(p, t)}</h3>
            <div className="flex flex-wrap gap-1.5">
              {p.specs.slice(0, 2).map(([k, v]) => <span key={k} className="text-[11px] px-2 py-0.5 rounded-lg bg-fair-ice dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-sky-100/80 dark:border-fair-border">{v}</span>)}
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-sky-50 dark:border-fair-border/80 space-y-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[11px] text-slate-400 line-through">{fmt(p.old, t.cur)}</div>
              <div className="text-base sm:text-lg font-black">{fmt(p.price, t.cur)}</div>
            </div>
            <button onClick={(e) => onLike(p.id, e.currentTarget)} className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border active:scale-90 transition-all ${liked ? 'bg-sky-100 dark:bg-sky-500/20 border-sky-300 text-sky-700 dark:text-sky-300' : 'bg-fair-ice dark:bg-slate-900 border-sky-100 dark:border-fair-border text-slate-600 dark:text-slate-300'}`}>
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-sky-600' : ''}`} /><span>{likes}</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAdd(p.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm shadow-sky-500/20 active:scale-95 transition-all"><ShoppingCart className="w-3.5 h-3.5" />{t.toCart}</button>
            <button onClick={() => onOpen(p.id)} aria-label={t.preview} className="p-2.5 rounded-xl bg-fair-ice hover:bg-sky-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-sky-100 dark:border-fair-border text-sky-700 dark:text-sky-300 active:scale-95 transition-all"><Eye className="w-4 h-4" /></button>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export default function App() {
  const [lang, setLang] = useLS('fair_lang', 'ru')
  const [dark, setDark] = useLS('fair_dark', false)
  const [favs, setFavs] = useLS('fair_favs', INIT_FAVS)
  const [liked, setLiked] = useLS('fair_liked', ['coffee'])
  const [extra, setExtra] = useLS('fair_like_extra', {})
  const [cart, setCart] = useLS('fair_cart', [{ id: 'kettle', qty: 1, color: 0 }])
  const [cat, setCat] = useState('all'); const [q, setQ] = useState(''); const [sort, setSort] = useState('popular'); const [onlyFav, setOnlyFav] = useState(false)
  const [pv, setPv] = useState(null); const [pvColor, setPvColor] = useState(0); const [pvTab, setPvTab] = useState('desc')
  const [drawer, setDrawer] = useState(null); const [promo, setPromo] = useState(false); const [promoVal, setPromoVal] = useState('')
  const [toasts, setToasts] = useState([]); const [bump, setBump] = useState(false)
  const [left, setLeft] = useState(2 * 86400 + 14 * 3600 + 38 * 60 + 45)
  const t = T[lang]

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => { const i = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { document.body.style.overflow = pv || drawer ? 'hidden' : '' }, [pv, drawer])
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') { setPv(null); setDrawer(null) } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])

  const toast = (msg) => { const id = Math.random(); setToasts((a) => [...a, { id, msg }]); setTimeout(() => setToasts((a) => a.filter((x) => x.id !== id)), 2700) }
  const likesOf = (p) => p.likes + (extra[p.id] || 0)
  const byId = (id) => PRODUCTS.find((p) => p.id === id)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return PRODUCTS.filter((p) => (!onlyFav || favs.includes(p.id)) && (cat === 'all' || p.cat === cat) && (!s || (nameOf(p, t) + ' ' + t.types[p.type].d + ' ' + p.specs.map((x) => x[1]).join(' ')).toLowerCase().includes(s)))
      .sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : sort === 'likes' ? likesOf(b) - likesOf(a) : b.rating * 100 + likesOf(b) - (a.rating * 100 + likesOf(a)))
  }, [q, cat, sort, onlyFav, favs, extra, lang])

  const toggleFav = (id) => { const on = favs.includes(id); setFavs(on ? favs.filter((x) => x !== id) : [...favs, id]); toast((on ? t.favDel : t.favAdd) + ' ' + nameOf(byId(id), t)) }
  const toggleLike = (id, el) => {
    if (liked.includes(id)) { setLiked(liked.filter((x) => x !== id)); setExtra({ ...extra, [id]: (extra[id] || 0) - 1 }) }
    else {
      setLiked([...liked, id]); setExtra({ ...extra, [id]: (extra[id] || 0) + 1 })
      if (el) { const s = document.createElement('span'); s.textContent = '+1'; s.className = 'animate-plus pointer-events-none absolute -top-3 right-1 text-xs font-black text-sky-500'; el.appendChild(s); setTimeout(() => s.remove(), 750) }
    }
  }
  const add = (id, color = 0) => {
    setCart((c) => c.some((x) => x.id === id && x.color === color) ? c.map((x) => x.id === id && x.color === color ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1, color }])
    setBump(true); setTimeout(() => setBump(false), 420); toast(t.inCart + ' ' + nameOf(byId(id), t))
  }
  const qty = (i, d) => setCart((c) => c.map((x, k) => k === i ? { ...x, qty: x.qty + d } : x).filter((x) => x.qty > 0))
  const resetAll = () => { setCat('all'); setQ(''); setSort('popular'); setOnlyFav(false) }
  const open = (id) => { setPv(id); setPvColor(0); setPvTab('desc') }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const subtotal = cart.reduce((s, c) => s + byId(c.id).price * c.qty, 0)
  const discount = promo ? Math.round(subtotal * 0.1) : 0
  const d = Math.floor(left / 86400), hh = Math.floor((left % 86400) / 3600), mm = Math.floor((left % 3600) / 60), ss = left % 60
  const hero = byId('coffee'), deal = byId('robot'), pvp = pv && byId(pv)
  const hasFilter = cat !== 'all' || q || onlyFav
  const iconBtn = 'p-2.5 rounded-2xl bg-fair-ice dark:bg-fair-card border border-sky-100 dark:border-fair-border hover:border-sky-400 transition-all active:scale-95'

  return (
    <div className="font-sans selection:bg-sky-500/20">
      <Background dark={dark} />

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((x) => <div key={x.id} className="animate-toast flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 text-white text-sm font-semibold shadow-xl border border-sky-500/30"><Check className="w-4 h-4 text-sky-400 shrink-0" />{x.msg}</div>)}
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-fair-dark/85 glass border-b border-sky-100 dark:border-fair-border">
        <div className="hidden md:block bg-fair-ice dark:bg-slate-900/70 border-b border-sky-100/80 dark:border-fair-border/70">
          <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-semibold"><Truck className="w-3.5 h-3.5" />{t.free} • <span className="font-medium text-slate-500 dark:text-slate-400">{t.warrantyTop}</span></span>
            <span>{t.promoTop} <strong className="text-sky-600 dark:text-sky-400">FAIR10</strong> • <a href="tel:+998712004400" className="font-semibold hover:text-sky-600">+998 (71) 200-44-00</a></span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-5">
          <a href="#top" onClick={resetAll} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M5 6h14M5 12h10M5 18h6" /><circle cx="17.5" cy="15.5" r="2.5" /></svg>
            </div>
            <div className="flex flex-col"><span className="text-xl sm:text-2xl font-black tracking-tight leading-none">Fair<span className="text-sky-500">.</span></span><span className="text-[10px] font-semibold tracking-widest text-sky-600 dark:text-sky-400 mt-0.5">Home &amp; Tech</span></div>
          </a>
          <div className="hidden sm:block flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-fair-ice/80 dark:bg-fair-card border border-sky-100 dark:border-fair-border text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all" />
            {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center rounded-2xl bg-fair-ice dark:bg-fair-card border border-sky-100 dark:border-fair-border p-1" title="Language">
              <Globe className="w-4 h-4 text-sky-500 mx-1.5" />
              {LANGS.map((l) => <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${lang === l ? 'bg-sky-600 text-white shadow' : 'text-slate-500 hover:text-sky-600'}`}>{l}</button>)}
            </div>
            <button onClick={() => { setDark(!dark); toast(!dark ? t.themeD : t.themeL) }} aria-label="Theme" className={iconBtn}>{dark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-sky-600" />}</button>
            <button onClick={() => setDrawer('fav')} aria-label={t.fav} className={`${iconBtn} inline-flex items-center gap-2`}><Heart className="w-5 h-5 text-rose-500" /><span className="min-w-[20px] h-5 px-1.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[11px] font-bold flex items-center justify-center">{favs.length}</span></button>
            <button onClick={() => setDrawer('cart')} aria-label={t.cart} className={`${bump ? 'animate-pop' : ''} inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-cyan-500 text-white shadow-md shadow-sky-500/25 active:scale-95 transition-all`}>
              <ShoppingBag className="w-5 h-5" /><span className="hidden md:inline text-sm font-bold">{t.cart}</span><span className="min-w-[20px] h-5 px-1.5 rounded-full bg-white text-sky-700 text-[11px] font-extrabold flex items-center justify-center">{cartCount}</span>
            </button>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-3 flex gap-2">
          <div className="relative flex-1"><Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="w-full pl-10 pr-3 py-2 rounded-xl bg-fair-ice dark:bg-fair-card border border-sky-100 dark:border-fair-border text-xs focus:outline-none focus:border-sky-500" /></div>
          <div className="flex rounded-xl bg-fair-ice dark:bg-fair-card border border-sky-100 dark:border-fair-border p-0.5">{LANGS.map((l) => <button key={l} onClick={() => setLang(l)} className={`px-2 rounded-lg text-[11px] font-bold uppercase ${lang === l ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>{l}</button>)}</div>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* HERO */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[32px] bg-gradient-to-br from-fair-ice via-white to-sky-50/90 dark:from-fair-card dark:via-slate-900 dark:to-sky-950/40 border border-sky-100 dark:border-fair-border p-6 sm:p-10 lg:p-12 shadow-xl shadow-sky-900/[0.04] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-sky-500/15 border border-sky-200/80 dark:border-sky-400/25 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-sm"><span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />{t.newCol}</div>
                <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.08]">{t.h1a} <span className="shine">{t.h1b}</span> {t.h1c}</h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">{t.heroText}</p>
                <div className="flex flex-wrap gap-3.5">
                  <a href="#catalog" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-cyan-500 shadow-lg shadow-sky-500/25 hover:-translate-y-0.5 transition-all">{t.toCatalog}<ArrowDownRight className="w-4 h-4" /></a>
                  <button onClick={() => { resetAll(); setSort('likes'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }) }} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-sky-700 dark:text-sky-200 bg-white dark:bg-slate-800/90 hover:bg-sky-50 border border-sky-200/80 dark:border-fair-border hover:-translate-y-0.5 transition-all"><Flame className="w-4 h-4 text-orange-500" />{t.hits}</button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sky-100 dark:border-fair-border max-w-md">
                  {[[PRODUCTS.length + '', t.m1], ['0%', t.m2], [t.h2h, t.m3]].map(([a, b]) => <div key={b}><div className="text-xl sm:text-2xl font-black">{a}</div><div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{b}</div></div>)}
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="animate-levitate rounded-3xl bg-white dark:bg-fair-card border border-sky-100 dark:border-fair-border p-5 sm:p-6 shadow-2xl shadow-sky-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">{t.choice}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{hero.rating} ({hero.rev})</span>
                  </div>
                  <div onClick={() => open(hero.id)} className="cursor-pointer group relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-sky-50 dark:bg-slate-900 mb-4">
                    <img src={hero.img} alt={nameOf(hero, t)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent" />
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-xs font-bold"><Eye className="w-3.5 h-3.5 text-sky-500" />{t.preview}</span>
                    <div className="absolute bottom-3 left-3 text-white text-sm font-bold">{hero.model}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {hero.specs.map(([k, v]) => <div key={k} className="p-2 rounded-xl bg-fair-ice dark:bg-slate-900/80 border border-sky-100/80 dark:border-fair-border"><div className="text-[10px] text-slate-400">{t.spec[k]}</div><div className="text-xs font-bold">{v}</div></div>)}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div><div className="text-xs text-slate-400 line-through">{fmt(hero.old, t.cur)}</div><div className="text-xl font-black">{fmt(hero.price, t.cur)}</div></div>
                    <button onClick={() => add(hero.id)} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold shadow-md shadow-sky-500/25 active:scale-95 transition-all"><ShoppingCart className="w-4 h-4" />{t.toCart}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANTAGES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.advs.map(([a, b], i) => { const Ic = ADV_ICONS[i]; return (
            <Reveal key={a} delay={i * 60}><div className="rounded-2xl bg-white dark:bg-fair-card border border-sky-100 dark:border-fair-border p-4 flex items-center gap-3.5 shadow-sm hover:-translate-y-1 hover:border-sky-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0"><Ic className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold">{a}</h3><p className="text-xs text-slate-500 dark:text-slate-400">{b}</p></div>
            </div></Reveal>) })}
        </section>

        {/* CATALOG */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div><span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">{t.eyebrow}</span><h2 className="text-2xl sm:text-3xl font-black mt-1">{t.title}</h2></div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button onClick={() => setOnlyFav(!onlyFav)} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all ${onlyFav ? 'border-rose-300 bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'border-sky-100 dark:border-fair-border bg-white dark:bg-fair-card hover:border-rose-300'}`}><Heart className="w-4 h-4 text-rose-500" />{t.onlyFav}</button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="pl-4 pr-8 py-2.5 rounded-2xl bg-white dark:bg-fair-card border border-sky-100 dark:border-fair-border text-xs sm:text-sm font-semibold cursor-pointer hover:border-sky-400 focus:outline-none">
                {Object.entries(t.sort).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-sb">
            {Object.keys(t.cats).map((id) => { const Ic = CAT_ICONS[id]; return (
              <button key={id} onClick={() => setCat(id)} className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${cat === id ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/25' : 'bg-white dark:bg-fair-card text-slate-600 dark:text-slate-300 border-sky-100 dark:border-fair-border hover:border-sky-400'}`}><Ic className="w-4 h-4" />{t.cats[id]}</button>) })}
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div>{t.shown} <strong className="text-slate-900 dark:text-white">{list.length}</strong></div>
            {hasFilter && <button onClick={resetAll} className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-semibold"><RotateCcw className="w-3.5 h-3.5" />{t.reset}</button>}
          </div>
          {list.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {list.map((p, i) => <Card key={p.id + lang} p={p} t={t} i={i} fav={favs.includes(p.id)} liked={liked.includes(p.id)} likes={likesOf(p)} onFav={toggleFav} onLike={toggleLike} onAdd={add} onOpen={open} />)}
            </div>
          ) : (
            <div className="animate-zoom rounded-3xl bg-fair-ice dark:bg-fair-card border border-sky-100 dark:border-fair-border p-12 text-center max-w-lg mx-auto space-y-4">
              <h3 className="text-lg font-bold">{t.empty}</h3><p className="text-sm text-slate-500">{t.emptyText}</p>
              <button onClick={resetAll} className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold">{t.showAll}</button>
            </div>
          )}
        </section>

        {/* DEAL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-[32px] bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 dark:from-sky-900 dark:via-slate-900 dark:to-cyan-950 p-6 sm:p-10 text-white shadow-2xl shadow-sky-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold"><Clock className="w-3.5 h-3.5" />{t.deal}</div>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">{t.dealTitle} {deal.model}</h2>
              <p className="text-sm sm:text-base text-sky-100 max-w-xl">{t.dealText}</p>
              <div className="flex gap-3 pt-2">
                {[d, hh, mm, ss].map((v, i) => <div key={i} className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex flex-col items-center justify-center"><span key={v} className="text-xl font-black animate-fade">{String(v).padStart(2, '0')}</span><span className="text-[10px] opacity-80">{t.tm[i]}</span></div>)}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <div><div className="text-xs text-sky-200 line-through">{fmt(deal.old, t.cur)}</div><div className="text-2xl sm:text-3xl font-black">{fmt(deal.price, t.cur)}</div></div>
                <button onClick={() => add(deal.id)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-extrabold text-sm shadow-lg active:scale-95 transition-all"><ShoppingBag className="w-4 h-4" />{t.grab}</button>
                <button onClick={() => open(deal.id)} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 font-bold text-sm border border-white/25 transition-all"><Eye className="w-4 h-4" />{t.preview}</button>
              </div>
            </div>
            <div className="lg:col-span-5"><div onClick={() => open(deal.id)} className="cursor-pointer rounded-3xl overflow-hidden border border-white/20 shadow-2xl group"><img src={deal.img} alt={nameOf(deal, t)} className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500" /></div></div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-fair-ice dark:bg-fair-card border-t border-sky-100 dark:border-fair-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="space-y-3"><span className="text-xl font-black">Fair<span className="text-sky-500">.</span></span><p className="text-sm text-slate-500 dark:text-slate-400">{t.footText}</p><div className="text-xs font-semibold text-sky-700 dark:text-sky-400">{t.addr}</div></div>
          <div><h4 className="text-sm font-bold mb-3">{t.categories}</h4><ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">{['large', 'kitchen', 'cleaning', 'climate'].map((c) => <li key={c}><a href="#catalog" onClick={() => setCat(c)} className="hover:text-sky-600">{t.cats[c]}</a></li>)}</ul></div>
          <div><h4 className="text-sm font-bold mb-3">{t.buyers}</h4><ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400"><li><button onClick={() => setDrawer('cart')} className="hover:text-sky-600">{t.cart}</button></li><li><button onClick={() => setDrawer('fav')} className="hover:text-sky-600">{t.fav}</button></li></ul></div>
          <div className="space-y-2"><h4 className="text-sm font-bold">{t.contacts}</h4><div className="text-lg font-black">+998 (71) 200-44-00</div><p className="text-xs text-slate-500">{t.work}</p><span className="inline-block px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-fair-border text-xs font-semibold text-sky-700 dark:text-sky-300">FAIR10 (-10%)</span></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-6 border-t border-sky-200/60 dark:border-fair-border text-xs text-slate-400">{t.rights}</div>
      </footer>

      {/* QUICK PREVIEW */}
      {pvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
          <div onClick={() => setPv(null)} className="animate-fade fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div className="animate-zoom relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-fair-card border border-sky-100 dark:border-fair-border shadow-2xl overflow-hidden">
            <div className="px-5 sm:px-7 py-4 border-b border-sky-100 dark:border-fair-border bg-fair-ice/70 dark:bg-slate-900/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs"><span className="px-3 py-1 rounded-full font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">{t.cats[pvp.cat]}</span><span className="text-slate-400">{t.sku}: FR-{1000 + PRODUCTS.indexOf(pvp) * 37}</span></div>
              <button onClick={() => setPv(null)} aria-label="Close" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-fair-border text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-fair-ice dark:bg-slate-900 border border-sky-100 dark:border-fair-border group">
                  <img src={pvp.img} alt={nameOf(pvp, t)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-extrabold">-{Math.round((1 - pvp.price / pvp.old) * 100)}%</div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 text-white text-[11px]">{t.hint}</div>
                </div>
                <div className="flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs"><span className="inline-flex items-center gap-1 font-bold text-amber-500"><Star className="w-4 h-4 fill-amber-400" />{pvp.rating}</span><span className="text-slate-500">{pvp.rev} {t.reviews}</span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.inStock}</span></div>
                    <h2 className="text-xl sm:text-2xl font-black leading-snug">{nameOf(pvp, t)}</h2>
                    <div><div className="text-xs font-semibold text-slate-500 mb-2">{t.color}</div>
                      <div className="flex gap-2.5">{SWATCH.default.map((hex, i) => <button key={hex} onClick={() => setPvColor(i)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${pvColor === i ? 'border-sky-500 scale-110' : 'border-slate-300 dark:border-slate-600'}`}><span className="w-6 h-6 rounded-full border border-black/10" style={{ background: hex }} /></button>)}</div></div>
                    <div className="grid grid-cols-2 gap-2.5">{pvp.specs.slice(0, 4).map(([k, v]) => <div key={k} className="p-2.5 rounded-xl bg-fair-ice dark:bg-slate-900 border border-sky-100 dark:border-fair-border"><div className="text-[11px] text-slate-400">{t.spec[k]}</div><div className="text-xs font-bold mt-0.5">{v}</div></div>)}</div>
                  </div>
                  <div className="pt-4 border-t border-sky-100 dark:border-fair-border space-y-4">
                    <div className="flex items-end justify-between gap-2">
                      <div><div className="text-xs text-slate-400 line-through">{fmt(pvp.old, t.cur)}</div><div className="text-2xl sm:text-3xl font-black">{fmt(pvp.price, t.cur)}</div></div>
                      <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-bold">{t.from} {fmt(Math.round(pvp.price / 12), t.cur)}{t.perMonth}</span>
                    </div>
                    <div className="flex gap-2.5">
                      <button onClick={() => add(pvp.id, pvColor)} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-cyan-500 text-white text-sm font-extrabold shadow-lg shadow-sky-500/25 active:scale-95 transition-all"><ShoppingCart className="w-4 h-4" />{t.addCart}</button>
                      <button onClick={(e) => toggleLike(pvp.id, e.currentTarget)} className={`relative inline-flex items-center gap-1.5 px-4 rounded-2xl border text-sm font-bold active:scale-95 transition-all ${liked.includes(pvp.id) ? 'bg-sky-100 dark:bg-sky-500/20 border-sky-300 text-sky-700 dark:text-sky-300' : 'bg-fair-ice dark:bg-slate-900 border-sky-100 dark:border-fair-border'}`}><ThumbsUp className="w-4 h-4" />{likesOf(pvp)}</button>
                      <button onClick={() => toggleFav(pvp.id)} aria-label={t.fav} className={`p-3.5 rounded-2xl border active:scale-95 transition-all ${favs.includes(pvp.id) ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 text-rose-500' : 'bg-fair-ice dark:bg-slate-900 border-sky-100 dark:border-fair-border'}`}><Heart className={`w-4 h-4 ${favs.includes(pvp.id) ? 'fill-rose-500' : ''}`} /></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-sky-100 dark:border-fair-border space-y-4">
                <div className="flex gap-2">{[['desc', t.tabDesc], ['specs', t.tabSpecs]].map(([k, l]) => <button key={k} onClick={() => setPvTab(k)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pvTab === k ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800'}`}>{l}</button>)}</div>
                {pvTab === 'desc' ? <p className="animate-fade text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t.types[pvp.type].d}</p> : (
                  <div className="animate-fade divide-y divide-sky-100 dark:divide-fair-border rounded-2xl border border-sky-100 dark:border-fair-border overflow-hidden">
                    {[...pvp.specs.map(([k, v]) => [t.spec[k], v]), [t.warranty, `${pvp.warranty || 24} ${t.months}`]].map(([k, v]) => <div key={k} className="px-4 py-2.5 flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="font-bold">{v}</span></div>)}
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER */}
      {drawer && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div onClick={() => setDrawer(null)} className="animate-fade fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />
          <div className="animate-slide fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-fair-card border-l border-sky-100 dark:border-fair-border shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-sky-100 dark:border-fair-border bg-fair-ice/70 dark:bg-slate-900/70 flex items-center justify-between">
              <div><h3 className="text-base font-extrabold">{drawer === 'cart' ? t.cartTitle : t.favTitle}</h3><p className="text-xs text-slate-500">{drawer === 'cart' ? `${t.goods} ${cartCount}` : `${t.saved} ${favs.length}`}</p></div>
              <button onClick={() => setDrawer(null)} aria-label="Close" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-fair-border text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {drawer === 'fav' ? (favs.length ? favs.map((id) => { const p = byId(id); return (
                <div key={id} className="animate-fade p-3 rounded-2xl bg-fair-ice/70 dark:bg-slate-900/70 border border-sky-100 dark:border-fair-border flex items-center gap-3">
                  <img src={p.img} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0"><div className="text-xs font-bold truncate">{nameOf(p, t)}</div><div className="text-xs font-black text-sky-600 dark:text-sky-400">{fmt(p.price, t.cur)}</div>
                    <div className="flex gap-3 mt-2"><button onClick={() => add(id)} className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-[11px] font-bold">{t.toCart}</button><button onClick={() => toggleFav(id)} className="text-[11px] text-slate-400 hover:text-rose-500">{t.remove}</button></div></div>
                </div>) }) : <div className="text-center py-16"><div className="font-bold">{t.emptyFav}</div><p className="text-xs text-slate-500 mt-2">{t.emptyFavT}</p></div>)
              : (cart.length ? cart.map((c, i) => { const p = byId(c.id); return (
                <div key={c.id + c.color} className="animate-fade p-3 rounded-2xl bg-fair-ice/70 dark:bg-slate-900/70 border border-sky-100 dark:border-fair-border flex items-center gap-3">
                  <img src={p.img} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0"><div className="text-xs font-bold truncate">{nameOf(p, t)}</div><div className="text-xs font-black text-sky-600 dark:text-sky-400 mt-0.5">{fmt(p.price * c.qty, t.cur)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-lg bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700"><button onClick={() => qty(i, -1)} className="px-2 py-0.5 text-xs font-bold">−</button><span className="px-2 text-xs font-bold">{c.qty}</span><button onClick={() => qty(i, 1)} className="px-2 py-0.5 text-xs font-bold">+</button></div>
                      <button onClick={() => qty(i, -c.qty)} aria-label={t.remove} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div></div>
                </div>) }) : <div className="text-center py-16"><div className="font-bold">{t.emptyCart}</div><p className="text-xs text-slate-500 mt-2">{t.emptyCartT}</p></div>)}
            </div>
            <div className="p-5 border-t border-sky-100 dark:border-fair-border bg-fair-ice/80 dark:bg-slate-900/80 space-y-3.5">
              {drawer === 'cart' && cart.length ? (<>
                <form onSubmit={(e) => { e.preventDefault(); if (promoVal.trim().toUpperCase() === 'FAIR10') { setPromo(true); toast(t.promoOk) } else toast(t.promoBad) }} className="flex gap-2">
                  <input value={promoVal} onChange={(e) => setPromoVal(e.target.value)} placeholder={t.promoPh} className="flex-1 text-xs rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:border-sky-500" />
                  <button className="px-3.5 py-2 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-bold">OK</button>
                </form>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500"><span>{t.sum}</span><span>{fmt(subtotal, t.cur)}</span></div>
                  {promo && <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold"><span>{t.disc}</span><span>-{fmt(discount, t.cur)}</span></div>}
                  <div className="flex justify-between text-slate-500"><span>{t.dlv}</span><span className="text-sky-600 dark:text-sky-400 font-semibold">{t.dlvFree}</span></div>
                  <div className="flex justify-between text-base font-black pt-1.5 border-t border-sky-200/60 dark:border-slate-800"><span>{t.total}</span><span>{fmt(subtotal - discount, t.cur)}</span></div>
                </div>
                <button onClick={() => { setCart([]); setPromo(false); setDrawer(null); toast(t.ordered) }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-cyan-500 text-white text-sm font-extrabold shadow-lg shadow-sky-500/25 active:scale-95 transition-all">{t.checkout}</button>
              </>) : <button onClick={() => setDrawer(null)} className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold">{t.cont}</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
