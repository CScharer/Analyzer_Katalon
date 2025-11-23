'use client'

import { useState, useEffect } from 'react'
import { Card, Nav, Tab } from 'react-bootstrap'
import { getDashboardData } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'
import SummaryCards from './SummaryCards'
import CoverageSection from './CoverageSection'
import TestCasesSection from './TestCasesSection'
import KeywordsSection from './KeywordsSection'
import TestSuitesSection from './TestSuitesSection'
import ObjectRepositorySection from './ObjectRepositorySection'

interface DashboardProps {
  projectPath: string
  onError: (error: string) => void
}

export default function Dashboard({ projectPath, onError }: DashboardProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    loadDashboardData()
  }, [projectPath])

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await getDashboardData(projectPath)
      setDashboardData(data)
    } catch (error: any) {
      onError(error.response?.data?.detail || error.message || 'Failed to load project data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!dashboardData) {
    return <></>
  }

  return (
    <div className="mt-4">
      {/* Project Info */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="h3">{dashboardData.project_info?.project_name || 'Project'}</Card.Title>
          <Card.Text className="text-muted mb-0">
            <small>{dashboardData.project_info?.project_path}</small>
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Card>
        <Card.Body>
          <Tab.Container defaultActiveKey="overview" onSelect={(k) => setActiveTab(k || 'overview')}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="test-cases">Test Cases</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="test-suites">Test Suites</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="keywords">Keywords</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="objects">Object Repository</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <div>
                  <SummaryCards summary={dashboardData.summary} />
                  <CoverageSection coverage={dashboardData.coverage} />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="test-cases">
                <TestCasesSection projectPath={projectPath} />
              </Tab.Pane>

              <Tab.Pane eventKey="test-suites">
                <TestSuitesSection projectPath={projectPath} />
              </Tab.Pane>

              <Tab.Pane eventKey="keywords">
                <KeywordsSection projectPath={projectPath} />
              </Tab.Pane>

              <Tab.Pane eventKey="objects">
                <ObjectRepositorySection projectPath={projectPath} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  )
}
