import { useEffect, useState } from 'react'

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function Users() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const codespacesEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  const localhostEndpoint = 'http://localhost:8000/api/users/'
  const endpoint = import.meta.env.VITE_CODESPACE_NAME ? codespacesEndpoint : localhostEndpoint

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
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
          setError(err.message || 'Unable to load users')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <p className="text-secondary small mb-3">Source: {endpoint}</p>

        {loading && <p className="mb-0">Loading users...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary">
                      No users available.
                    </td>
                  </tr>
                )}
                {items.map((user) => (
                  <tr key={user._id || user.id || user.username}>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.fullName || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.fitnessLevel || 'N/A'}</td>
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

export default Users
