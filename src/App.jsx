import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Check, Cloud, Code2, Eye, EyeOff, Github, Layers3, Menu, Rocket, Server, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

const lessons = [
  { icon: Cloud, title: 'Cloud foundations', text: 'Understand regions, availability zones, elasticity, and the shared responsibility model.', number: '01' },
  { icon: Server, title: 'Build the stack', text: 'Connect a modern React frontend to a secure, production-shaped Express API.', number: '02' },
  { icon: Rocket, title: 'Deploy to AWS', text: 'Ship with confidence using S3, CloudFront, App Runner, and managed services.', number: '03' },
]

const stack = [
  { label: 'React + Vite', note: 'Frontend', color: '#7dd3fc' },
  { label: 'Express.js', note: 'API', color: '#a3e635' },
  { label: 'Amazon Web Services', note: 'Cloud', color: '#fbbf24' },
]

function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignup = mode === 'signup'

  useEffect(() => { setError(''); setForm({ name: '', email: '', password: '' }) }, [mode])
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Something went wrong.')
      localStorage.setItem('cloudlaunch_session', JSON.stringify(data))
      onSuccess(data.user)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
      <div className="auth-mark"><Cloud size={25} strokeWidth={2.5} /></div>
      <p className="eyebrow">{isSignup ? 'START YOUR JOURNEY' : 'WELCOME BACK'}</p>
      <h2 id="auth-title">{isSignup ? 'Create your account' : 'Sign in to CloudLaunch'}</h2>
      <p className="auth-subtitle">{isSignup ? 'Join the classroom and start building in the cloud.' : 'Continue your cloud learning journey.'}</p>
      <form onSubmit={submit}>
        {isSignup && <label>Full name<input required minLength="2" autoFocus placeholder="Ada Lovelace" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}
        <label>Email address<input required type="email" autoFocus={!isSignup} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<div className="password-field"><input required minLength="8" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
        {error && <div className="form-error">{error}</div>}
        <button className="submit-button" disabled={loading}>{loading ? 'Please wait…' : isSignup ? 'Create free account' : 'Sign in'} <ArrowRight size={18}/></button>
      </form>
      <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to CloudLaunch?'} <button onClick={() => onSwitch(isSignup ? 'signin' : 'signup')}>{isSignup ? 'Sign in' : 'Create an account'}</button></p>
    </div>
  </div>
}

export default function App() {
  const [modal, setModal] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('cloudlaunch_session'))?.user || null } catch { return null } })
  const logout = () => { localStorage.removeItem('cloudlaunch_session'); setUser(null) }
  const openAuth = (mode) => { setModal(mode); setMenuOpen(false) }

  return <>
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-icon"><Cloud size={24}/></span><span>Cloud<span>Launch</span></span></a>
      <nav className={menuOpen ? 'nav-open' : ''}>
        <a href="#learn" onClick={() => setMenuOpen(false)}>Curriculum</a><a href="#stack" onClick={() => setMenuOpen(false)}>Tech stack</a><a href="#deploy" onClick={() => setMenuOpen(false)}>AWS path</a>
        <div className="mobile-auth">{user ? <><span>Hi, {user.name.split(' ')[0]}</span><button onClick={logout}>Sign out</button></> : <><button onClick={() => openAuth('signin')}>Sign in</button><button className="nav-cta" onClick={() => openAuth('signup')}>Join the class</button></>}</div>
      </nav>
      <div className="header-actions">{user ? <><span className="user-pill"><span>{user.name[0].toUpperCase()}</span>{user.name.split(' ')[0]}</span><button className="text-button" onClick={logout}>Sign out</button></> : <><button className="text-button" onClick={() => openAuth('signin')}>Sign in</button><button className="nav-cta" onClick={() => openAuth('signup')}>Join the class <ArrowRight size={16}/></button></>}</div>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="grid-lines"/>
        <div className="hero-copy">
          <div className="status-chip"><span/> NEW COHORT · CLOUD 101</div>
          <h1>Build it.<br/>Ship it to <em>the cloud.</em></h1>
          <p>A hands-on introduction to cloud computing. Learn the concepts, build a real full-stack app, and deploy it to AWS—step by step.</p>
          <div className="hero-buttons"><button className="primary-button" onClick={() => openAuth('signup')}>Start learning free <ArrowRight size={19}/></button><a className="secondary-button" href="#learn"><BookOpen size={18}/> Explore the course</a></div>
          <div className="trust-row"><span><Check/> No experience needed</span><span><Check/> Hands-on project</span><span><Check/> AWS deployment</span></div>
        </div>
        <div className="hero-visual" aria-label="Application deployment architecture">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="cloud-core"><Cloud size={54}/><strong>AWS</strong><small>eu-west-1</small></div>
          <div className="float-card card-code"><Code2/><span><strong>Web app</strong><small>React + Vite</small></span></div>
          <div className="float-card card-api"><Zap/><span><strong>API</strong><small>Express.js</small></span></div>
          <div className="float-card card-secure"><ShieldCheck/><span><strong>Secure</strong><small>JWT auth</small></span></div>
          <div className="deploy-line line-one"/><div className="deploy-line line-two"/><div className="deploy-line line-three"/>
        </div>
      </section>

      <section className="ticker"><span>COMPUTE</span><i/> <span>STORAGE</span><i/> <span>NETWORKING</span><i/> <span>SECURITY</span><i/> <span>DEPLOYMENT</span><i/> <span>SCALABILITY</span></section>

      <section className="learn-section" id="learn">
        <div className="section-heading"><div><p className="eyebrow">YOUR LEARNING PATH</p><h2>From zero to deployed.</h2></div><p>Three focused modules. One working application.<br/>A foundation you can build on.</p></div>
        <div className="lesson-grid">{lessons.map(({ icon: Icon, title, text, number }) => <article key={number} className="lesson-card"><span className="lesson-number">{number}</span><div className="lesson-icon"><Icon/></div><h3>{title}</h3><p>{text}</p><a href="#deploy">View module <ArrowRight size={16}/></a></article>)}</div>
      </section>

      <section className="stack-section" id="stack">
        <div className="terminal">
          <div className="terminal-top"><span/><span/><span/><small>cloudlaunch — deployment</small></div>
          <div className="terminal-body"><p><b>$</b> npm run build</p><p className="muted">✓ 42 modules transformed.</p><p className="muted">✓ built in 1.24s</p><br/><p><b>$</b> aws deploy --stage production</p><p className="success">● Upload complete</p><p className="success">● Distribution deployed</p><p className="url">→ https://cloudlaunch.demo</p><span className="cursor"/></div>
        </div>
        <div className="stack-copy"><p className="eyebrow">LEARN BY DOING</p><h2>Real tools.<br/>Real deployment.</h2><p>You won't just watch slides. You'll write code, connect services, read logs, and see your own application live on the internet.</p><div className="stack-list">{stack.map(item => <div key={item.label}><span style={{ background: item.color }}/><strong>{item.label}</strong><small>{item.note}</small></div>)}</div></div>
      </section>

      <section className="deploy-section" id="deploy">
        <div className="deploy-card"><div><p className="eyebrow"><Sparkles size={15}/> READY TO LAUNCH?</p><h2>Your first cloud app<br/>starts right here.</h2><p>Join the demo formation and turn cloud concepts into something you can share.</p></div><button className="light-button" onClick={() => openAuth('signup')}>Create your account <ArrowRight/></button><Layers3 className="deploy-decoration"/></div>
      </section>
    </main>

    <footer><a className="brand" href="#top"><span className="brand-icon"><Cloud size={22}/></span><span>Cloud<span>Launch</span></span></a><p>Built for curious minds learning the cloud.</p><a href="https://github.com" aria-label="GitHub"><Github/></a></footer>
    {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={setModal} onSuccess={(newUser) => { setUser(newUser); setModal(null) }}/>} 
  </>
}
