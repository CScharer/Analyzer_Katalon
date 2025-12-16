'use client'

import { useState, useEffect } from 'react'
import { Card, Form, Button, InputGroup, ListGroup, Spinner, CloseButton } from 'react-bootstrap'
import { getProjectSummary } from '@/lib/api'

interface ProjectSelectorProps {
  onProjectSelect: (path: string) => void
  currentPath: string
}

export default function ProjectSelector({ onProjectSelect, currentPath }: ProjectSelectorProps): JSX.Element {
  const [inputPath, setInputPath] = useState<string>(currentPath)
  const [recentProjects, setRecentProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('recentProjects')
    setRecentProjects(stored ? JSON.parse(stored) : [])
  }, [])

  const validateAndSelect = async (path: string): Promise<void> => {
    if (!path || !path.trim()) return
    setError('')
    setLoading(true)
    try {
      await getProjectSummary(path.trim())
      onProjectSelect(path.trim())
      // Save to recent projects
      if (typeof window !== 'undefined') {
        const updated = [path.trim(), ...recentProjects.filter(p => p !== path.trim())].slice(0, 5)
        setRecentProjects(updated)
        localStorage.setItem('recentProjects', JSON.stringify(updated))
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to load project. Please check the path and try again.'
      setError(msg)
      console.error('Project validation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    validateAndSelect(inputPath)
  }

  const handleRecentClick = (path: string): void => {
    setInputPath(path)
    validateAndSelect(path)
  }

  const removeRecent = (pathToRemove: string): void => {
    const updated = recentProjects.filter(p => p !== pathToRemove)
    setRecentProjects(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentProjects', JSON.stringify(updated))
    }
    // if current input equals removed path, clear it
    if (inputPath === pathToRemove) setInputPath('')
  }

  const clearAllRecent = (): void => {
    if (!confirm('Clear all recent project paths? This cannot be undone.')) return
    setRecentProjects([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentProjects')
    }
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0" data-qa="project-selector-title">Select Project</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label data-qa="project-selector-label">Project Path</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={inputPath}
                onChange={(e) => setInputPath(e.target.value)}
                placeholder="/path/to/katalon/project"
                size="lg"
                data-qa="project-path-input"
              />
              <Button variant="primary" type="submit" size="lg" disabled={loading} data-qa="project-analyze-button">
                {loading ? (
                  <><Spinner animation="border" size="sm" className="me-2" data-qa="project-analyzing-spinner" />Analyzing</>
                ) : (
                  'Analyze'
                )}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted" data-qa="project-help-text">
              Enter the full path to your Katalon Studio project directory<br></br>
              <br></br>
              <b>Example: </b><i>/Users/christopherscharer/Katalon Studio/onboarding</i>
            </Form.Text>
          </Form.Group>
        </Form>

        {error && (
          <div className="alert alert-danger" role="alert" data-qa="project-error">{error}</div>
        )}

        {recentProjects.length > 0 && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0" data-qa="recent-projects-title">Recent Projects</h6>
              <div>
                <Button variant="outline-secondary" size="sm" onClick={clearAllRecent} className="me-2" data-qa="recent-clear-button">
                  Clear All
                </Button>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {recentProjects.map((path, index) => (
                <div key={index} className="d-inline-flex align-items-center border rounded px-2 py-1" data-qa={`recent-project-row-${index}`}>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleRecentClick(path)}
                    className="p-0 me-2"
                    data-qa={`recent-project-button-${index}`}
                  >
                    {path.split('/').pop() || path}
                  </Button>
                  <CloseButton onClick={() => removeRecent(path)} data-qa={`recent-project-remove-${index}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
