'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Badge, Form, InputGroup, Button, Accordion } from 'react-bootstrap'
import { getObjectRepository, searchObjectRepository } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface ObjectRepositorySectionProps {
  projectPath: string
}

export default function ObjectRepositorySection({ projectPath }: ObjectRepositorySectionProps): JSX.Element {
  const [objects, setObjects] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error, setError] = useState<string>('')
  const itemsPerPage = 10

  useEffect(() => {
    loadObjects()
  }, [projectPath, currentPage])

  const loadObjects = async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getObjectRepository(projectPath, itemsPerPage, offset)
      setObjects(data.objects || [])
      setTotal(data.total || 0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading objects'
      setError(message)
      console.error('Error loading objects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setSearchQuery('')
      loadObjects()
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await searchObjectRepository(projectPath, searchQuery)
      setObjects(data.results || [])
      setTotal(data.count || 0)
      setCurrentPage(1)
    } catch (error) {
      let message = 'Error searching objects'
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
      console.error('Error searching objects:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  const getVariantForType = (type: string): string => {
    switch (type) {
      case 'WebElement':
        return 'primary'
      case 'MobileElement':
        return 'success'
      case 'WindowsElement':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  if (loading && objects.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          {error && (
            <div className="alert alert-danger mb-3" role="alert" data-qa="objects-error">
              {error}
            </div>
          )}
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              data-qa="objects-search-input"
            />
            <Button variant="primary" onClick={handleSearch} data-qa="objects-search-button">
              Search
            </Button>
            {searchQuery && (
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('')
                loadObjects()
              }} data-qa="objects-clear-button">
                Clear
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title className="h6 mb-0" data-qa="objects-title">Object Repository ({total})</Card.Title>
        </Card.Header>
        <Card.Body>
        {objects.length === 0 ? (
          <p className="text-muted text-center py-4" data-qa="objects-empty">No objects found</p>
        ) : (
          <>
            <Table striped hover responsive data-qa="objects-table">
              <thead>
                <tr>
                  <th data-qa="objects-col-name">Name</th>
                  <th data-qa="objects-col-type">Type</th>
                  <th data-qa="objects-col-selector-method">Selector Method</th>
                  <th data-qa="objects-col-selectors">Selectors</th>
                  <th data-qa="objects-col-properties">Properties</th>
                </tr>
              </thead>
              <tbody>
                {objects.map((obj, index) => (
                  <tr key={index} data-qa={`object-row-${index}`}>
                    <td data-qa={`object-name-${index}`}>
                      <strong>{obj.name || 'N/A'}</strong>
                      {obj.description && (
                        <div data-qa={`object-desc-${index}`}>
                          <small className="text-muted">{obj.description}</small>
                        </div>
                      )}
                    </td>
                    <td data-qa={`object-type-${index}`}>
                      {obj.element_type ? (
                        <Badge bg={getVariantForType(obj.element_type)} data-qa={`object-badge-type-${index}`}>
                          {obj.element_type}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td data-qa={`object-selector-method-${index}`}>
                      {obj.selector_method ? (
                        <Badge bg="info" data-qa={`object-badge-selector-${index}`}>{obj.selector_method}</Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td data-qa={`object-selectors-${index}`}>
                      {obj.selectors && Object.keys(obj.selectors).length > 0 ? (
                        <div>
                          {Object.entries(obj.selectors).map(([key, value]: [string, any]) => (
                            <div key={key} data-qa={`object-selector-${index}-${key}`}>
                              <small>
                                <strong>{key}:</strong> {String(value).substring(0, 50)}
                                {String(value).length > 50 ? '...' : ''}
                              </small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td data-qa={`object-properties-${index}`}>
                      {obj.properties?.length > 0 ? (
                        <Badge bg="secondary" data-qa={`object-badge-properties-${index}`}>{obj.properties.length} properties</Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3" data-qa="objects-pagination">
                <Pagination>
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    data-qa="objects-pg-first"
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    data-qa="objects-pg-prev"
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
                          <Pagination.Ellipsis data-qa={`objects-pg-ellipsis-${idx}`} />
                        )}
                        <Pagination.Item
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          data-qa={`objects-pg-item-${page}`}
                        >
                          {page}
                        </Pagination.Item>
                      </div>
                    ))}
                  <Pagination.Next 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    data-qa="objects-pg-next"
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages}
                    data-qa="objects-pg-last"
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

