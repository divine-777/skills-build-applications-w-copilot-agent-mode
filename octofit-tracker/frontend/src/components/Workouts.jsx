import { useEffect, useMemo, useState } from 'react'

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function Workouts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME
    const apiBaseUrl = codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api`
      : 'http://localhost:8000/api'

    return `${apiBaseUrl}/workouts/`
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
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
          setError(err.message || 'Unable to load workouts')
        }
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <p className="text-secondary small mb-3">Source: {endpoint}</p>

        {loading && <p className="mb-0">Loading workouts...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="row g-3">
            {items.length === 0 && <p className="text-secondary mb-0">No workouts available.</p>}
            {items.map((workout) => (
              <div className="col-md-6" key={workout._id || workout.id || workout.title}>
                <article className="border rounded p-3 h-100">
                  <h3 className="h6">{workout.title || 'Untitled workout'}</h3>
                  <p className="small text-muted mb-2">
                    Goal: {workout.goal || 'N/A'} | Difficulty: {workout.difficulty || 'N/A'}
                  </p>
                  <p className="small mb-2">Estimated: {workout.estimatedMinutes ?? 'N/A'} min</p>
                  <ul className="small mb-0">
                    {(workout.exercises || []).map((exercise) => (
                      <li key={`${workout._id || workout.title}-${exercise}`}>{exercise}</li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Workouts
