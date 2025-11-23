'use client'

import { useState } from 'react'
import { Card, Form, Button, InputGroup, ListGroup } from 'react-bootstrap'

interface ProjectSelectorProps {
  onProjectSelect: (path: string) => void
  currentPath: string
}

export default function ProjectSelector({ onProjectSelect, currentPath }: ProjectSelectorProps): JSX.Element {
  const [inputPath, setInputPath] = useState<string>(currentPath)
  const [recentProjects, setRecentProjects] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentProjects')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (inputPath.trim()) {
      onProjectSelect(inputPath.trim())
      // Save to recent projects
      if (typeof window !== 'undefined') {
        const updated = [inputPath.trim(), ...recentProjects.filter(p => p !== inputPath.trim())].slice(0, 5)
        setRecentProjects(updated)
        localStorage.setItem('recentProjects', JSON.stringify(updated))
      }
    }
  }

  const handleRecentClick = (path: string): void => {
    setInputPath(path)
    onProjectSelect(path)
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Select Project</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Path</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={inputPath}
                onChange={(e) => setInputPath(e.target.value)}
                placeholder="/path/to/katalon/project"
                size="lg"
              />
              <Button variant="primary" type="submit" size="lg">
                Analyze
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Enter the full path to your Katalon Studio project directory
            </Form.Text>
          </Form.Group>
        </Form>

        {recentProjects.length > 0 && (
          <div className="mt-4">
            <h6 className="text-muted mb-2">Recent Projects</h6>
            <div className="d-flex flex-wrap gap-2">
              {recentProjects.map((path, index) => (
                <Button
                  key={index}
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleRecentClick(path)}
                >
                  {path.split('/').pop() || path}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
