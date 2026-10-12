import { useState } from 'react'
import { API_BASE_URL } from './config'
import { requestGreeting } from './services/greetingApi'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanedName = name.trim()
    if (!cleanedName) {
      setGreeting(null)
      setErrorMessage('Please enter your name before calling the API.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await requestGreeting(cleanedName)
      setGreeting(response)
    } catch (error) {
      setGreeting(null)
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">React + FastAPI example</p>
        <h1>Simple frontend to backend flow</h1>
        <p className="hero-copy">
          This page sends your name to a FastAPI backend and shows the JSON
          response. It is intentionally small so you can follow the request flow
          easily.
        </p>

        <div className="hero-grid">
          <article className="info-card">
            <h2>1. Frontend collects input</h2>
            <p>
              The form below captures a name and sends a POST request to the
              backend endpoint.
            </p>
          </article>

          <article className="info-card">
            <h2>2. Backend returns JSON</h2>
            <p>
              The API responds with a greeting message, the cleaned name, and a
              timestamp.
            </p>
          </article>

          <article className="info-card">
            <h2>3. UI renders result</h2>
            <p>
              React stores the response in state and updates the page without a
              full reload.
            </p>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h2>Try the API</h2>
          <p className="panel-copy">
            Update <code>VITE_API_BASE_URL</code> when your backend is deployed
            to Cloud Run.
          </p>

          <div className="endpoint-box">
            <span className="endpoint-method">POST</span>
            <code>{API_BASE_URL}/api/greet</code>
          </div>

          <form className="greeting-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Calling API...' : 'Send to backend'}
            </button>
          </form>

          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        </article>

        <article className="panel">
          <h2>Latest response</h2>
          <p className="panel-copy">
            This is the exact payload the backend returns to the browser.
          </p>

          <pre className="response-box">
            {greeting
              ? JSON.stringify(greeting, null, 2)
              : `{\n  "message": "Waiting for a request...",\n  "received_name": "",\n  "timestamp": ""\n}`}
          </pre>

          {greeting ? (
            <div className="success-banner">
              <strong>{greeting.message}</strong>
              <span>Returned at {greeting.timestamp}</span>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default App
