'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Badge } from 'react-bootstrap'
import { getTestSuites } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface TestSuitesSectionProps {
  projectPath: string
}

export default function TestSuitesSection({ projectPath }: TestSuitesSectionProps): JSX.Element {
  const [testSuites, setTestSuites] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadTestSuites()
  }, [projectPath, currentPage])

  const loadTestSuites = async (): Promise<void> => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getTestSuites(projectPath, itemsPerPage, offset)
      setTestSuites(data.test_suites || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error loading test suites:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  if (loading && testSuites.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="h6 mb-0">Test Suites ({total})</Card.Title>
      </Card.Header>
      <Card.Body>
        {testSuites.length === 0 ? (
          <p className="text-muted text-center py-4">No test suites found</p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Test Cases</th>
                  <th>Rerun</th>
                  <th>Data Binding</th>
                </tr>
              </thead>
              <tbody>
                {testSuites.map((suite, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{suite.name || 'N/A'}</strong>
                    </td>
                    <td>{suite.description || '-'}</td>
                    <td>
                      <Badge bg="info">
                        {suite.test_cases?.length || 0}
                      </Badge>
                    </td>
                    <td>
                      {suite.is_rerun ? (
                        <Badge bg="success">Yes</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
                    <td>
                      {suite.test_cases?.some((tc: any) => tc.using_data_binding) ? (
                        <Badge bg="warning">Yes</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
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
  )
}

