"use client"

import { useEffect, useState } from 'react'
import { Card, InputGroup, FormControl, Button, Table, Spinner } from 'react-bootstrap'
import { getScripts } from '@/lib/api'

interface ScriptsSectionProps {
  projectPath: string
}

export default function ScriptsSection({ projectPath }: ScriptsSectionProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [scripts, setScripts] = useState<any[]>([])
  const [q, setQ] = useState<string>('')

  const load = async (search?: string) => {
    setError('')
    setLoading(true)
    try {
      const res = await getScripts(projectPath, search)
      setScripts(res.results || [])
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
          <Card.Title className="h6 mb-0" data-qa="scripts-title">Scripts</Card.Title>
          <InputGroup style={{ width: 360 }}>
            <FormControl
              placeholder="Search scripts"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && load(q)}
              data-qa="scripts-search-input"
            />
            <Button variant="primary" onClick={() => load(q)} data-qa="scripts-search-button">
              {loading ? <><Spinner animation="border" size="sm" className="me-2" />Searching</> : 'Search'}
            </Button>
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <div className="alert alert-danger" data-qa="scripts-error">{error}</div>}
        {!loading && scripts.length === 0 && <div data-qa="scripts-empty">No scripts found.</div>}
        {scripts.length > 0 && (
          <Table striped bordered hover size="sm" data-qa="scripts-table">
            <thead>
              <tr>
                <th data-qa="scripts-col-name">Name</th>
                <th data-qa="scripts-col-file">File</th>
                <th data-qa="scripts-col-snippet">Snippet</th>
              </tr>
            </thead>
            <tbody>
              {scripts.map((s, idx) => (
                <tr key={idx} data-qa={`script-row-${idx}`}>
                  <td data-qa={`script-name-${idx}`}>{s.name}</td>
                  <td data-qa={`script-file-${idx}`}>{s.relative_path || s.file_path}</td>
                  <td data-qa={`script-snippet-${idx}`}>{(s.content || '').slice(0, 120)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}
