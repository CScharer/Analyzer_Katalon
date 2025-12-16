'use client'

import { useState } from 'react'
import { Container, Alert } from 'react-bootstrap'
import ProjectSelector from '@/components/ProjectSelector'
import Dashboard from '@/components/Dashboard'

export default function Home(): JSX.Element {
  const [projectPath, setProjectPath] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleProjectSelect = (path: string): void => {
    setProjectPath(path)
    setError(null)
  }

  return (
    <main className="min-vh-100">
      <div className="bg-white shadow-sm border-bottom mb-4">
        <Container className="py-4">
          <h1 className="display-5 fw-bold text-primary" data-qa="app-title">
            Katalon Studio Project Analyzer
          </h1>
          <p className="lead text-muted" data-qa="app-lead">
            Analyze and visualize your Katalon Studio automation projects
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <ProjectSelector 
          onProjectSelect={handleProjectSelect}
          currentPath={projectPath}
        />

        {error && (
          <Alert variant="danger" className="mt-4" data-qa="page-error-alert">
            <Alert.Heading data-qa="page-error-heading">Error</Alert.Heading>
            <p className="mb-0" data-qa="page-error-message">{error}</p>
          </Alert>
        )}

        {projectPath && (
          <div className="mt-4">
            <Dashboard 
              projectPath={projectPath}
              onError={(err: string) => setError(err)}
            />
          </div>
        )}

        {!projectPath && (
          <div className="text-center py-5 my-5" data-qa="empty-state">
            <div className="text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="bi bi-folder2-open mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.553.586 1.734 1.383l.799 2.407A1.5 1.5 0 0 0 8.305 8h4.792a1.5 1.5 0 0 1 1.342.83l1.106 2.221A1.5 1.5 0 0 1 14.896 13H2.5a1.5 1.5 0 0 1-1.5-1.5zM2.5 3a.5.5 0 0 0-.5.5v8.793l.853-.853A.5.5 0 0 1 3.5 11h11.396l-1-2H2.5a.5.5 0 0 1-.5-.5V3.5a.5.5 0 0 0-.5-.5z"/>
              </svg>
              <h4 className="mt-3" data-qa="empty-state-title">Select a project to begin analysis</h4>
              <p className="text-muted" data-qa="empty-state-text">
                Enter the full path to your Katalon Studio project directory
                <br></br>
                <b>Example: </b><i>/Users/christopherscharer/Katalon Studio/onboarding</i>
              </p>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}

