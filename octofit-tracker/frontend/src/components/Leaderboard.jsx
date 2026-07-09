import { useEffect, useState } from 'react'

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function Leaderboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const codespacesEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  const localhostEndpoint = 'http://localhost:8000/api/leaderboard/'
  const endpoint = import.meta.env.VITE_CODESPACE_NAME ? codespacesEndpoint : localhostEndpoint

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItems(payload))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard')
        }
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <p className="text-secondary small mb-3">Source: {endpoint}</p>

        {loading && <p className="mb-0">Loading leaderboard...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <ol className="list-group list-group-numbered">
            {items.length === 0 && <p className="text-secondary mb-0">No ranking data available.</p>}
            {items.map((entry) => (
              <li key={entry._id || entry.id || entry.rank} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-semibold">{entry.user?.fullName || entry.user?.username || 'Unknown athlete'}</div>
                  <span className="small text-muted">Rank #{entry.rank ?? 'N/A'}</span>
                </div>
                <span className="badge text-bg-primary rounded-pill">{entry.points ?? 0} pts</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
