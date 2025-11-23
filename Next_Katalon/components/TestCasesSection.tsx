'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Form, InputGroup, Button, Badge } from 'react-bootstrap'
import { getTestCases, searchTestCases } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface TestCasesSectionProps {
  projectPath: string
}

export default function TestCasesSection({ projectPath }: TestCasesSectionProps): JSX.Element {
  const [testCases, setTestCases] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error, setError] = useState<string>('')
  const itemsPerPage = 10

  useEffect(() => {
    loadTestCases()
  }, [projectPath, currentPage])

  const loadTestCases = async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getTestCases(projectPath, itemsPerPage, offset)
      setTestCases(data.test_cases || [])
      setTotal(data.total || 0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading test cases'
      setError(message)
      console.error('Error loading test cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setSearchQuery('')
      loadTestCases()
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await searchTestCases(projectPath, searchQuery)
      setTestCases(data.results || [])
      setTotal(data.count || 0)
      setCurrentPage(1)
    } catch (error) {
      let message = 'Error searching test cases'
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
      console.error('Error searching test cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  if (loading && testCases.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search test cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('')
                loadTestCases()
              }}>
                Clear
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="h6 mb-0">Test Cases ({total})</Card.Title>
        </Card.Header>
        <Card.Body>
          {testCases.length === 0 ? (
            <p className="text-muted text-center py-4">No test cases found</p>
          ) : (
            <>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Tag</th>
                    <th>Record Option</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((testCase, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{testCase.name || 'N/A'}</strong>
                      </td>
                      <td>{testCase.description || '-'}</td>
                      <td>
                        {testCase.tag ? (
                          <Badge bg="secondary">{testCase.tag}</Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{testCase.record_option || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                      disabled={currentPage === 1}
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
                            <Pagination.Ellipsis />
                          )}
                          <Pagination.Item
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Pagination.Item>
                        </div>
                      ))}
                    <Pagination.Next 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages}
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

