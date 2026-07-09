import { useEffect, useState } from 'react'

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function Activities() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const codespacesEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  const localhostEndpoint = 'http://localhost:8000/api/activities/'
  const endpoint = import.meta.env.VITE_CODESPACE_NAME ? codespacesEndpoint : localhostEndpoint

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
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
          setError(err.message || 'Unable to load activities')
        }
      } finally {
        setLoading(false)
      }
    }

    loadActivities()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <p className="text-secondary small mb-3">Source: {endpoint}</p>

        {loading && <p className="mb-0">Loading activities...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Duration (min)</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary">
                      No activities available.
                    </td>
                  </tr>
                )}
                {items.map((activity) => (
                  <tr key={activity._id || activity.id}>
                    <td>{activity.user?.username || activity.user?.fullName || 'N/A'}</td>
                    <td>{activity.activityType || 'N/A'}</td>
                    <td>{activity.durationMinutes ?? 'N/A'}</td>
                    <td>{activity.caloriesBurned ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Activities
