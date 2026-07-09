import { useEffect, useState } from 'react'

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function Teams() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const codespacesEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  const localhostEndpoint = 'http://localhost:8000/api/teams/'
  const endpoint = import.meta.env.VITE_CODESPACE_NAME ? codespacesEndpoint : localhostEndpoint

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
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
          setError(err.message || 'Unable to load teams')
        }
      } finally {
        setLoading(false)
      }
    }

    loadTeams()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <p className="text-secondary small mb-3">Source: {endpoint}</p>

        {loading && <p className="mb-0">Loading teams...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="list-group list-group-flush">
            {items.length === 0 && <p className="text-secondary mb-0">No teams available.</p>}
            {items.map((team) => (
              <article key={team._id || team.id || team.name} className="list-group-item px-0">
                <h3 className="h6 mb-1">{team.name || 'Unnamed team'}</h3>
                <p className="mb-1 text-secondary">{team.description || 'No description'}</p>
                <p className="mb-0 small text-muted">
                  Captain: {team.captain?.fullName || team.captain?.username || 'N/A'}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Teams
