import { useEffect, useState } from 'react'
import './App.css'

type Key = { label: string; className?: string }

const sanrioCharacters = [
  { name: 'Kuromi', symbol: '☠', className: 'kuromi-choice' },
  { name: 'Hello Kitty', symbol: '♡', className: 'kitty-choice' },
  { name: 'My Melody', symbol: '✿', className: 'melody-choice' },
  { name: 'Cinnamoroll', symbol: '☁', className: 'cinnamoroll-choice' },
  { name: 'Pompompurin', symbol: '★', className: 'purin-choice' },
]

const rows: Key[][] = [
  [{ label: '2nd', className: 'key-yellow' }, { label: 'MODE', className: 'key-blue' }, { label: 'DEL', className: 'key-blue' }, { label: 'ALPHA', className: 'key-green' }, { label: 'STAT', className: 'key-blue' }],
  [{ label: 'MATH', className: 'key-blue' }, { label: 'APPS', className: 'key-blue' }, { label: 'PRGM', className: 'key-blue' }, { label: 'VARS', className: 'key-blue' }, { label: 'CLEAR', className: 'key-blue' }],
  [{ label: 'x⁻¹', className: 'key-function' }, { label: 'SIN', className: 'key-function' }, { label: 'COS', className: 'key-function' }, { label: 'TAN', className: 'key-function' }, { label: '◀', className: 'key-nav' }],
  [{ label: 'x²', className: 'key-function' }, { label: 'SIN⁻¹', className: 'key-function' }, { label: 'COS⁻¹', className: 'key-function' }, { label: 'TAN⁻¹', className: 'key-function' }, { label: '▶', className: 'key-nav' }],
  [{ label: 'LOG', className: 'key-function' }, { label: 'LN', className: 'key-function' }, { label: '(', className: 'key-function' }, { label: ')', className: 'key-function' }, { label: '▲', className: 'key-nav' }],
  [{ label: '⁻', className: 'key-function' }, { label: '7' }, { label: '8' }, { label: '9' }, { label: '÷', className: 'key-operator' }],
  [{ label: 'π', className: 'key-function' }, { label: '4' }, { label: '5' }, { label: '6' }, { label: '×', className: 'key-operator' }],
  [{ label: 'EE', className: 'key-function' }, { label: '1' }, { label: '2' }, { label: '3' }, { label: '−', className: 'key-operator' }],
  [{ label: 'ANS', className: 'key-function' }, { label: '0' }, { label: '.', className: 'key-number' }, { label: '(-)', className: 'key-number' }, { label: '+', className: 'key-operator' }],
  [{ label: 'ON', className: 'key-blue' }, { label: 'ENTER', className: 'key-enter' }],
]

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(() => localStorage.getItem('juans-sanrio-onboarded') === 'true')
  const [favorite, setFavorite] = useState(() => localStorage.getItem('juans-sanrio-favorite') || '')
  const [expression, setExpression] = useState('')
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState('Ready')

  const press = (label: string) => {
    if (/^\d$/.test(label) || ['.', 'π', '(', ')'].includes(label)) {
      const value = label === 'π' ? 'π' : label
      setExpression((current) => current + value)
      setDisplay((current) => (current === '0' ? value : current + value))
    } else if (['+', '−', '×', '÷'].includes(label)) {
      const operator = label === '×' ? ' × ' : label === '÷' ? ' ÷ ' : ` ${label} `
      setExpression((current) => current + operator)
      setDisplay((current) => `${current} ${label}`)
    } else if (['LN', 'LOG', 'SIN', 'COS', 'TAN', 'SIN⁻¹', 'COS⁻¹', 'TAN⁻¹'].includes(label)) {
      const functions: Record<string, [string, string]> = {
        LN: ['Math.log(', 'ln('], LOG: ['Math.log10(', 'log('],
        SIN: ['Math.sin(', 'sin('], COS: ['Math.cos(', 'cos('], TAN: ['Math.tan(', 'tan('],
        'SIN⁻¹': ['Math.asin(', 'sin⁻¹('], 'COS⁻¹': ['Math.acos(', 'cos⁻¹('], 'TAN⁻¹': ['Math.atan(', 'tan⁻¹('],
      }
      const [code, shown] = functions[label]
      setExpression((current) => current + code)
      setDisplay((current) => (current === '0' ? shown : current + shown))
    } else if (label === 'x²') {
      setExpression((current) => current + '**2')
      setDisplay((current) => `${current}²`)
    } else if (label === 'x⁻¹') {
      setExpression((current) => current + '**-1')
      setDisplay((current) => `${current}⁻¹`)
    } else if (label === 'EE') {
      setExpression((current) => current + 'e')
      setDisplay((current) => `${current}e`)
    } else if (label === '(-)') {
      setExpression((current) => `-(${current || '0'})`)
      setDisplay((current) => `−(${current})`)
    } else if (label === 'DEL') {
      setExpression((current) => current.slice(0, -1))
      setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : '0'))
    } else if (label === 'CLEAR') {
      setExpression(''); setDisplay('0'); setHistory('Ready')
    } else if (label === 'ENTER') {
      try {
        const safe = expression.replaceAll('π', String(Math.PI)).replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-')
        const result = Function(`"use strict"; return (${safe || 0})`)()
        setHistory(`${display}  →`); setDisplay(Number.isFinite(result) ? String(result) : 'ERR: DOMAIN'); setExpression(String(result))
      } catch { setDisplay('ERR: SYNTAX'); setHistory('Check expression') }
    } else if (label === 'ANS') {
      setExpression((current) => current + display); setDisplay((current) => (current === '0' ? display : current + display))
    } else if (label === '2nd' || label === 'ALPHA') setHistory(label === '2nd' ? '2nd function' : 'Alpha mode')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') { event.preventDefault(); press('ENTER') }
      if (event.key === 'Escape') { event.preventDefault(); press('CLEAR') }
      if (/^\d$/.test(event.key) || ['.', '+', '(', ')'].includes(event.key)) press(event.key)
      if (event.key === '*') press('×')
      if (event.key === '/') { event.preventDefault(); press('÷') }
      if (event.key === '-') press('−')
      if (event.key === 'Backspace') press('DEL')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  if (!hasOnboarded) {
    return (
      <main className="welcome-shell">
        <div className="welcome-sparkle sparkle-one">✦</div><div className="welcome-sparkle sparkle-two">♡</div>
        <section className="welcome-card">
          <div className="welcome-mascot"><span>☠</span></div>
          <p className="eyebrow">WELCOME TO JUAN'S SANRIO WORLD</p>
          <h1>Who's your favorite<br /><em>Sanrio character?</em></h1>
          <p className="welcome-copy">Pick a favorite to personalize your scientific calculator experience.</p>
          <div className="character-grid">{sanrioCharacters.map((character) => <button key={character.name} className={`character-choice ${character.className} ${favorite === character.name ? 'selected' : ''}`} onClick={() => setFavorite(character.name)}><span className="character-symbol">{character.symbol}</span><span>{character.name}</span>{favorite === character.name && <b>✓</b>}</button>)}</div>
          <button className="welcome-continue" disabled={!favorite} onClick={() => { localStorage.setItem('juans-sanrio-favorite', favorite); localStorage.setItem('juans-sanrio-onboarded', 'true'); setHasOnboarded(true) }}>Continue to calculator <span>→</span></button>
          <p className="welcome-note">Your preference is saved on this device.</p>
        </section>
      </main>
    )
  }

  const activeCharacter = sanrioCharacters.find((character) => character.name === favorite) || sanrioCharacters[0]
  const themeClass = `theme-${activeCharacter.name.toLowerCase().replaceAll(' ', '-')}`
  const changeTheme = () => {
    localStorage.removeItem('juans-sanrio-onboarded')
    localStorage.removeItem('juans-sanrio-favorite')
    setHasOnboarded(false)
    setFavorite('')
  }

  return (
    <main className={`app-shell ${themeClass}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="app-header"><div className="brand-mark"><span>{activeCharacter.symbol}</span></div><div><p className="eyebrow">{activeCharacter.name.toUpperCase()} · MATH LAB</p><h1>Juan's Sanrio Scientific Calculator</h1></div><button className="theme-switch" onClick={changeTheme}>CHANGE THEME</button><div className="status-pill"><i /> CALCULATOR ONLINE</div></header>
      <section className="workspace">
        <div className="calculator-wrap"><div className="calculator">
          <div className="calculator-brand"><div className="bunny-badge"><span>{activeCharacter.symbol}</span></div><strong>TI-84</strong><span>Plus CE</span><small>PYTHON</small></div>
          <div className="screen-frame"><div className="screen-top"><span>▶ RUN-MAT</span><span>RAD</span><span>Auto</span></div><div className="screen-content"><div className="history-line">{history}</div><div className="display-line">{display}<b>_</b></div></div><div className="screen-footer"><span>▸</span><span>Math</span><span>Frac</span><span>Dec</span></div></div>
          <div className="keypad">{rows.map((row, rowIndex) => <div className={`key-row row-${rowIndex}`} key={rowIndex}>{row.map((key) => <button key={key.label} className={`calc-key ${key.className ?? ''}`} onClick={() => press(key.label)}>{key.label}</button>)}</div>)}</div>
        </div><div className="calculator-shadow" /></div>
        <aside className="side-panel"><div className="panel-heading"><span className="panel-icon">{activeCharacter.symbol}</span><div><p className="eyebrow">{activeCharacter.name.toUpperCase()} MODE</p><h2>Graphing mode</h2></div></div>
          <div className="graph-card"><div className="graph-grid"><div className="graph-curve" /><span className="axis-x">x</span><span className="axis-y">y</span></div><div className="graph-legend"><span><i className="legend-dot" /> f(x) = sin(x)</span><span className="graph-value">Y₁</span></div></div>
          <div className="quick-card"><p className="eyebrow">KEYBOARD SHORTCUTS</p><div><kbd>ENTER</kbd><span>Evaluate expression</span></div><div><kbd>ESC</kbd><span>Clear current line</span></div><div><kbd>↑ ↓</kbd><span>Browse history</span></div></div>
          <p className="tip"><span>✦</span> Tip: Use <strong>2nd</strong> to access inverse functions and alternate key commands.</p>
        </aside>
      </section>
      <footer className="app-footer"><span>SCIENTIFIC CALCULATOR · v1.0</span><span>DEG &nbsp;|&nbsp; RAD &nbsp;|&nbsp; GRAD</span><span>READY TO CALCULATE</span></footer>
    </main>
  )
}

export default App
