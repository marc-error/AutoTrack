import { useState, useEffect } from 'react'

function safeEval(expr) {
  if (!/^[\d+\-*/().\s]+$/.test(expr)) {
    throw new Error('Invalid expression')
  }
  const tokens = expr.match(/(\d+\.?\d*|[+\-*/()])/g)
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
    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/')) {
      const op = tokens[pos++]
      const right = parseUnary()
      left = op === '*' ? left * right : left / right
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

function loadHistory(uid) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(uid))) || []
  } catch { return [] }
}

function saveHistory(uid, history) {
  localStorage.setItem(getStorageKey(uid), JSON.stringify(history))
}

export default function CalculatorTab({ uid }) {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState(() => loadHistory(uid))

  useEffect(() => {
    setHistory(loadHistory(uid))
    setExpression('')
    setResult('')
  }, [uid])

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', 'back']
  ]

  const handlePress = (btn) => {
    if (btn === 'C') {
      setExpression('')
      setResult('')
    } else if (btn === 'back') {
      setExpression(prev => prev.slice(0, -1))
    } else if (btn === '=') {
      try {
        const evalResult = safeEval(expression)
        const resultStr = String(evalResult)
        setResult(resultStr)
        const entry = { id: Date.now(), expression, result: resultStr }
        const updated = [entry, ...history].slice(0, 20)
        setHistory(updated)
        saveHistory(uid, updated)
        setExpression(resultStr)
      } catch {
        setResult('Error')
      }
    } else {
      setExpression(prev => prev + btn)
      setResult('')
    }
  }

  const clearHistory = () => {
    setHistory([])
    saveHistory(uid, [])
  }

  const loadFromHistory = (entry) => {
    setExpression(entry.result)
    setResult('')
  }

  return (
    <div className="calc-layout">
      <div className="calc-left">
        <div className="calc-display">
          <div className="calc-expression">{expression || '0'}</div>
          <div className="calc-result">{result}</div>
        </div>
        <div className="calc-buttons">
          {buttons.map((row, ri) => (
            <div key={ri} className="calc-row">
              {row.map(btn => (
                <button
                  key={btn}
                  className={`calc-btn${btn === '=' ? ' equals' : ''}${btn === 'C' ? ' clear' : ''}${btn === 'back' ? ' back' : ''}`}
                  onClick={() => handlePress(btn)}
                >
                  {btn === 'back' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                  ) : btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="calc-right">
        <div className="calc-history-header">
          <h4>History</h4>
          {history.length > 0 && (
            <button className="calc-clear-history" onClick={clearHistory}>Clear</button>
          )}
        </div>
        <div className="calc-history-list">
          {history.length === 0 && <div className="calc-empty">No history yet.</div>}
          {history.map(entry => (
            <div key={entry.id} className="calc-history-item" onClick={() => loadFromHistory(entry)}>
              <div className="calc-history-expr">{entry.expression}</div>
              <div className="calc-history-result">= {entry.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
