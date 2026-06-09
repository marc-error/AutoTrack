import { useState, useEffect, useRef, useCallback } from 'react'

function safeEval(expr) {
  if (!/^[\d+\-*/().%\s]+$/.test(expr)) {
    throw new Error('Invalid expression')
  }
  const tokens = expr.match(/(\d+\.?\d*|[+\-*/()%])/g)
  if (!tokens) throw new Error('Invalid expression')
  let pos = 0

  function parseExpr() {
    let left = parseTerm()
    while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
      const op = tokens[pos++]
      const right = parseTerm()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function parseTerm() {
    let left = parseUnary()
    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/' || tokens[pos] === '%')) {
      const op = tokens[pos++]
      const right = parseUnary()
      if (op === '%') left = left / 100 * right
      else left = op === '*' ? left * right : left / right
    }
    return left
  }

  function parseUnary() {
    if (tokens[pos] === '-') { pos++; return -parsePrimary() }
    return parsePrimary()
  }

  function parsePrimary() {
    if (tokens[pos] === '(') {
      pos++
      const val = parseExpr()
      if (tokens[pos] !== ')') throw new Error('Unmatched parenthesis')
      pos++
      return val
    }
    const num = parseFloat(tokens[pos++])
    if (isNaN(num)) throw new Error('Invalid number')
    return num
  }

  const result = parseExpr()
  if (pos !== tokens.length) throw new Error('Unexpected token')
  return result
}

function getStorageKey(uid) {
  return `calc_history_${uid}`
}

function getNoteKey(uid) {
  return `calc_note_${uid}`
}

function loadHistory(uid) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(uid))) || []
  } catch { return [] }
}

function saveHistory(uid, history) {
  localStorage.setItem(getStorageKey(uid), JSON.stringify(history))
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function CalculatorTab({ uid }) {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState(() => loadHistory(uid))
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(getNoteKey(uid)) || '' } catch { return '' }
  })
  const [toast, setToast] = useState(null)
  const handlePressRef = useRef(null)
  const toastTimeout = useRef(null)

  useEffect(() => {
    setHistory(loadHistory(uid))
    setExpression('')
    setResult('')
    try { setNote(localStorage.getItem(getNoteKey(uid)) || '') } catch { setNote('') }
  }, [uid])

  useEffect(() => {
    localStorage.setItem(getNoteKey(uid), note)
  }, [note, uid])

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimeout.current)
    toastTimeout.current = setTimeout(() => setToast(null), 1500)
  }, [])

  const copyResult = useCallback(() => {
    if (!result || result === 'Error') return
    navigator.clipboard.writeText(result).then(() => showToast('Copied!'))
  }, [result, showToast])

  const handlePress = (btn) => {
    if (btn === 'C') {
      setExpression('')
      setResult('')
    } else if (btn === 'CE') {
      setExpression('')
      setResult('')
    } else if (btn === 'back') {
      setExpression(prev => prev.slice(0, -1))
    } else if (btn === '=') {
      try {
        const evalResult = safeEval(expression)
        const resultStr = String(evalResult)
        setResult(resultStr)
        const entry = { id: Date.now(), expression, result: resultStr, createdAt: new Date().toISOString() }
        const updated = [entry, ...history].slice(0, 30)
        setHistory(updated)
        saveHistory(uid, updated)
        setExpression(resultStr)
      } catch {
        setResult('Error')
      }
    } else if (btn === '+/-') {
      if (expression.startsWith('-')) {
        setExpression(expression.slice(1))
      } else if (expression) {
        setExpression('-' + expression)
      }
    } else if (btn === '%') {
      setExpression(prev => prev + '%')
    } else if (btn === '00') {
      setExpression(prev => prev + '00')
    } else {
      setExpression(prev => prev + btn)
      setResult('')
    }
  }

  handlePressRef.current = handlePress

  useEffect(() => {
    const handleKeyDown = (e) => {
      const active = document.activeElement
      if (active?.tagName === 'TEXTAREA' || active?.tagName === 'INPUT' || active?.closest('.calc-notes')) return

      const key = e.key

      if (/^[0-9]$/.test(key)) {
        e.preventDefault()
        handlePressRef.current(key)
      } else if (key === '.') {
        e.preventDefault()
        handlePressRef.current('.')
      } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault()
        handlePressRef.current(key)
      } else if (key === '(' || key === ')') {
        e.preventDefault()
        handlePressRef.current(key)
      } else if (key === '%') {
        e.preventDefault()
        handlePressRef.current('%')
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handlePressRef.current('=')
      } else if (key === 'Backspace') {
        e.preventDefault()
        handlePressRef.current('back')
      } else if (key === 'Escape' || key === 'Delete') {
        e.preventDefault()
        handlePressRef.current('C')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const buttons = [
    ['C', '(', ')', '%'],
    ['back', '7', '8', '9', '/'],
    ['CE', '4', '5', '6', '*'],
    ['+/-', '1', '2', '3', '-'],
    ['00', '0', '.', '=', '+']
  ]

  const clearHistory = () => {
    setHistory([])
    saveHistory(uid, [])
  }

  const deleteHistoryItem = (id) => {
    const updated = history.filter(e => e.id !== id)
    setHistory(updated)
    saveHistory(uid, updated)
  }

  const loadFromHistory = (entry) => {
    setExpression(entry.result)
    setResult('')
  }

  return (
    <div className="calc-layout">
      <div className="calc-left">
        <div className="calc-card">
          <div className="calc-display" onClick={copyResult} title="Click to copy result">
            <input
              className="calc-expression"
              type="text"
              value={expression}
              onChange={(e) => { setExpression(e.target.value); setResult('') }}
            />
            <div className="calc-result">{result || '0'}</div>
            {toast && <div className="calc-toast">{toast}</div>}
          </div>
          <div className="calc-buttons">
          {buttons.map((row, ri) => (
            <div key={ri} className="calc-row">
              {row.map(btn => {
                const isOp = ['/', '*', '-', '+'].includes(btn)
                const isEquals = btn === '='
                const isClear = btn === 'C' || btn === 'CE'
                const isSpecial = btn === 'back' || btn === '+/-' || btn === '%'
                return (
                  <button
                    key={btn}
                    className={[
                      'calc-btn',
                      isOp && ' op',
                      isEquals && ' equals',
                      isClear && ' clear',
                      isSpecial && ' special',
                      btn === 'back' && ' back'
                    ].filter(Boolean).join(' ')}
                    onClick={() => handlePress(btn)}
                  >
                    {btn === 'back' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                    ) : btn === 'CE' ? 'CE' : btn}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="calc-notes">
        <div className="calc-notes-label">Notes</div>
        <textarea
          className="calc-notes-textarea"
          placeholder="Quick notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="calc-right">
        <div className="calc-history-header">
          <h4>History</h4>
          {history.length > 0 && (
            <button className="calc-clear-history" onClick={clearHistory}>Clear all</button>
          )}
        </div>
        <div className="calc-history-list">
          {history.length === 0 && <div className="calc-empty">No history yet.</div>}
          {history.map(entry => (
            <div key={entry.id} className="calc-history-item" onClick={() => loadFromHistory(entry)}>
              <div className="calc-history-top">
                <div className="calc-history-expr">{entry.expression}</div>
                <button className="calc-history-delete" onClick={(e) => { e.stopPropagation(); deleteHistoryItem(entry.id) }} title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="calc-history-result">= {entry.result}</div>
              {entry.createdAt && <div className="calc-history-time">{formatTime(entry.createdAt)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
