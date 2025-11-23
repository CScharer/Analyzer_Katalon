'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Badge, Form, InputGroup, Button } from 'react-bootstrap'
import { getTestSuites, searchTestSuites } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface TestSuitesSectionProps {
  projectPath: string
}

export default function TestSuitesSection({ projectPath }: TestSuitesSectionProps): JSX.Element {
  const [testSuites, setTestSuites] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error, setError] = useState<string>('')
  const itemsPerPage = 10

  useEffect(() => {
    loadTestSuites()
  }, [projectPath, currentPage])

  const loadTestSuites = async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getTestSuites(projectPath, itemsPerPage, offset)
      setTestSuites(data.test_suites || [])
      setTotal(data.total || 0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading test suites'
      setError(message)
      console.error('Error loading test suites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setSearchQuery('')
      loadTestSuites()
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await searchTestSuites(projectPath, searchQuery)
      setTestSuites(data.results || [])
      setTotal(data.count || 0)
      setCurrentPage(1)
    } catch (error) {
      let message = 'Error searching test suites'
      try {
        if (error && typeof error === 'object' && 'message' in error) {
          const errMsg: string = (error as any).message
          if (errMsg.includes('Project path does not exist')) {
            message = 'Project not found on the server. Please re-select the project in the Project selector.'
          } else {
            message = errMsg
          }
        }
      } catch (_) {}
      setError(message)
      console.error('Error searching test suites:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  if (loading && testSuites.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          {error && (
            <div className="alert alert-danger mb-3" role="alert" data-qa="testsuites-error">
              {error}
            </div>
          )}
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search test suites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              data-qa="testsuites-search-input"
            />
            <Button variant="primary" onClick={handleSearch} data-qa="testsuites-search-button">
              Search
            </Button>
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('')
                loadTestSuites()
              }} data-qa="testsuites-clear-button">
                Clear
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
      <Card.Header>
        <Card.Title className="h6 mb-0" data-qa="testsuites-title">Test Suites ({total})</Card.Title>
      </Card.Header>
      <Card.Body>
        {testSuites.length === 0 ? (
          <p className="text-muted text-center py-4" data-qa="testsuites-empty">No test suites found</p>
        ) : (
          <>
            <Table striped hover responsive data-qa="testsuites-table">
              <thead>
                <tr>
                  <th data-qa="testsuites-col-name">Name</th>
                  <th data-qa="testsuites-col-desc">Description</th>
                  <th data-qa="testsuites-col-cases">Test Cases</th>
                  <th data-qa="testsuites-col-rerun">Rerun</th>
                  <th data-qa="testsuites-col-binding">Data Binding</th>
                </tr>
              </thead>
              <tbody>
                {testSuites.map((suite, index) => (
                  <tr key={index} data-qa={`testsuite-row-${index}`}>
                    <td data-qa={`testsuite-name-${index}`}>
                      <strong>{suite.name || 'N/A'}</strong>
                    </td>
                    <td data-qa={`testsuite-desc-${index}`}>{suite.description || '-'}</td>
                    <td data-qa={`testsuite-cases-${index}`}>
                      <Badge bg="info" data-qa={`testsuite-badge-cases-${index}`}>
                        {suite.test_cases?.length || 0}
                      </Badge>
                    </td>
                    <td data-qa={`testsuite-rerun-${index}`}>
                      {suite.is_rerun ? (
                        <Badge bg="success" data-qa={`testsuite-badge-rerun-${index}`}>Yes</Badge>
                      ) : (
                        <Badge bg="secondary" data-qa={`testsuite-badge-rerun-${index}`}>No</Badge>
                      )}
                    </td>
                    <td data-qa={`testsuite-binding-${index}`}>
                      {suite.test_cases?.some((tc: any) => tc.using_data_binding) ? (
                        <Badge bg="warning" data-qa={`testsuite-badge-binding-${index}`}>Yes</Badge>
                      ) : (
                        <Badge bg="secondary" data-qa={`testsuite-badge-binding-${index}`}>No</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3" data-qa="testsuites-pagination">
                <Pagination>
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    data-qa="testsuites-pg-first"
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    data-qa="testsuites-pg-prev"
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, arr) => (
                      <div key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <Pagination.Ellipsis data-qa={`testsuites-pg-ellipsis-${idx}`} />
                        )}
                        <Pagination.Item
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          data-qa={`testsuites-pg-item-${page}`}
                        >
                          {page}
                        </Pagination.Item>
                      </div>
                    ))}
                  <Pagination.Next 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    data-qa="testsuites-pg-next"
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages}
                    data-qa="testsuites-pg-last"
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
    </div>
  )
}

