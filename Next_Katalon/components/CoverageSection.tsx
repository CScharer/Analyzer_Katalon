'use client'

import { Row, Col, Card } from 'react-bootstrap'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CoverageSectionProps {
  coverage: any
  onCardClick?: (key: string) => void
}

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1']

export default function CoverageSection({ coverage, onCardClick }: CoverageSectionProps): JSX.Element {
  const testCaseCoverage = coverage?.test_case_coverage || {}
  const objectUsage = coverage?.object_repository_usage || {}
  const keywordUsage = coverage?.keyword_usage || {}

  const coverageData = [
    {
      name: 'Test Cases',
      used: testCaseCoverage.used_in_suites || 0,
      unused: testCaseCoverage.unused || 0,
      total: testCaseCoverage.total_test_cases || 0,
      coverage: testCaseCoverage.coverage_percentage || 0,
    },
    {
      name: 'Objects',
      used: objectUsage.used_objects || 0,
      unused: objectUsage.unused_objects || 0,
      total: objectUsage.total_objects || 0,
      coverage: objectUsage.coverage_percentage || 0,
    },
  ]

  const keywordData = [
    { name: 'Used', value: keywordUsage.used_keywords || 0 },
    { name: 'Unused', value: (keywordUsage.total_keywords || 0) - (keywordUsage.used_keywords || 0) },
  ]

  return (
    <div>
      <h4 className="mb-4" data-qa="coverage-title">Coverage Analysis</h4>
      
      <Row className="g-4 mb-4">
        {/* Coverage Bar Chart */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <Card.Title className="h6 mb-0" data-qa="coverage-usage-title">Usage Coverage</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" fill="#198754" name="Used" />
                  <Bar dataKey="unused" fill="#dc3545" name="Unused" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Keyword Usage Pie Chart */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <Card.Title className="h6 mb-0" data-qa="coverage-keyword-title">Keyword Usage</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={keywordData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {keywordData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Coverage Stats */}
      <Row className="g-4">
        <Col md={4}>
          <Card 
            className="border-primary" 
            data-qa="coverage-card-testcases"
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => onCardClick && onCardClick('test-cases')}
            onKeyDown={(e) => { if (e.key === 'Enter') onCardClick && onCardClick('test-cases') }}
          >
            <Card.Body>
              <Card.Title className="h6 text-primary" data-qa="coverage-card-testcases-title">Test Case Coverage</Card.Title>
              <h2 className="text-primary mb-2" data-qa="coverage-card-testcases-value">
                {testCaseCoverage.coverage_percentage?.toFixed(1) || 0}%
              </h2>
              <Card.Text className="text-muted small mb-0" data-qa="coverage-card-testcases-sub">{
                `${testCaseCoverage.used_in_suites || 0} of ${testCaseCoverage.total_test_cases || 0} used`
              }</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="border-success" 
            data-qa="coverage-card-objects"
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => onCardClick && onCardClick('objects')}
            onKeyDown={(e) => { if (e.key === 'Enter') onCardClick && onCardClick('objects') }}
          >
            <Card.Body>
              <Card.Title className="h6 text-success" data-qa="coverage-card-objects-title">Object Repository Coverage</Card.Title>
              <h2 className="text-success mb-2" data-qa="coverage-card-objects-value">
                {objectUsage.coverage_percentage?.toFixed(1) || 0}%
              </h2>
              <Card.Text className="text-muted small mb-0" data-qa="coverage-card-objects-sub">{
                `${objectUsage.used_objects || 0} of ${objectUsage.total_objects || 0} used`
              }</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="border-info" 
            data-qa="coverage-card-keywords"
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => onCardClick && onCardClick('keywords')}
            onKeyDown={(e) => { if (e.key === 'Enter') onCardClick && onCardClick('keywords') }}
          >
            <Card.Body>
              <Card.Title className="h6 text-info" data-qa="coverage-card-keywords-title">Keywords</Card.Title>
              <h2 className="text-info mb-2" data-qa="coverage-card-keywords-value">
                {keywordUsage.used_keywords || 0} / {keywordUsage.total_keywords || 0}
              </h2>
              <Card.Text className="text-muted small mb-0" data-qa="coverage-card-keywords-sub">
                {keywordUsage.unused_keywords?.length || 0} unused
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
