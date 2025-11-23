"use client"

import { useEffect, useState } from 'react'
import { Card, InputGroup, FormControl, Button, Table, Spinner } from 'react-bootstrap'
import { getProfiles } from '@/lib/api'

interface ProfilesSectionProps {
  projectPath: string
}

export default function ProfilesSection({ projectPath }: ProfilesSectionProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [profiles, setProfiles] = useState<any[]>([])
  const [q, setQ] = useState<string>('')

  const load = async (search?: string) => {
    setError('')
    setLoading(true)
    try {
      const res = await getProfiles(projectPath, search)
      setProfiles(res.results || [])
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectPath) load()
  }, [projectPath])

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title className="h6 mb-0">Profiles</Card.Title>
          <InputGroup style={{ width: 360 }}>
            <FormControl
              placeholder="Search profiles"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-qa="profiles-search-input"
            />
            <Button variant="outline-secondary" onClick={() => load(q)} data-qa="profiles-search-button">{loading ? <Spinner animation="border" size="sm" /> : 'Search'}</Button>
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <div className="alert alert-danger" data-qa="profiles-error">{error}</div>}
        {!loading && profiles.length === 0 && <div data-qa="profiles-empty">No profiles found.</div>}
        {profiles.length > 0 && (
          <Table striped bordered hover size="sm" data-qa="profiles-table">
            <thead>
              <tr>
                <th data-qa="profiles-col-name">Name</th>
                <th data-qa="profiles-col-file">File</th>
                <th data-qa="profiles-col-vars">Variables</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p, idx) => (
                <tr key={idx} data-qa={`profile-row-${idx}`}>
                  <td data-qa={`profile-name-${idx}`}>{p.name}</td>
                  <td data-qa={`profile-file-${idx}`}>{p.relative_path || p.file_path}</td>
                  <td data-qa={`profile-vars-${idx}`}>{Object.keys(p.global_variables || {}).length}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}
