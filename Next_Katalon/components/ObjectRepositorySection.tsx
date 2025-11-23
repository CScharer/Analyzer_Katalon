'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Badge, Accordion } from 'react-bootstrap'
import { getObjectRepository } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface ObjectRepositorySectionProps {
  projectPath: string
}

export default function ObjectRepositorySection({ projectPath }: ObjectRepositorySectionProps): JSX.Element {
  const [objects, setObjects] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadObjects()
  }, [projectPath, currentPage])

  const loadObjects = async (): Promise<void> => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getObjectRepository(projectPath, itemsPerPage, offset)
      setObjects(data.objects || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error loading objects:', error)
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
    <Card>
      <Card.Header>
        <Card.Title className="h6 mb-0">Object Repository ({total})</Card.Title>
      </Card.Header>
      <Card.Body>
        {objects.length === 0 ? (
          <p className="text-muted text-center py-4">No objects found</p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Selector Method</th>
                  <th>Selectors</th>
                  <th>Properties</th>
                </tr>
              </thead>
              <tbody>
                {objects.map((obj, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{obj.name || 'N/A'}</strong>
                      {obj.description && (
                        <div>
                          <small className="text-muted">{obj.description}</small>
                        </div>
                      )}
                    </td>
                    <td>
                      {obj.element_type ? (
                        <Badge bg={getVariantForType(obj.element_type)}>
                          {obj.element_type}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {obj.selector_method ? (
                        <Badge bg="info">{obj.selector_method}</Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {obj.selectors && Object.keys(obj.selectors).length > 0 ? (
                        <div>
                          {Object.entries(obj.selectors).map(([key, value]: [string, any]) => (
                            <div key={key}>
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
                    <td>
                      {obj.properties?.length > 0 ? (
                        <Badge bg="secondary">{obj.properties.length} properties</Badge>
                      ) : (
                        '-'
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

