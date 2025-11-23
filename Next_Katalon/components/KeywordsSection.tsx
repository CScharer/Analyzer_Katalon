'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Pagination, Form, InputGroup, Button, Badge } from 'react-bootstrap'
import { getKeywords, searchKeywords } from '@/lib/api'
import LoadingSpinner from './LoadingSpinner'

interface KeywordsSectionProps {
  projectPath: string
}

export default function KeywordsSection({ projectPath }: KeywordsSectionProps): JSX.Element {
  const [keywords, setKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [error, setError] = useState<string>('')
  const itemsPerPage = 10

  useEffect(() => {
    loadKeywords()
  }, [projectPath, currentPage])

  const loadKeywords = async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')
      const offset = (currentPage - 1) * itemsPerPage
      const data = await getKeywords(projectPath, itemsPerPage, offset)
      setKeywords(data.keywords || [])
      setTotal(data.total || 0)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading keywords'
      setError(message)
      console.error('Error loading keywords:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setSearchQuery('')
      loadKeywords()
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await searchKeywords(projectPath, searchQuery)
      // The backend returns results as { keyword, file } entries. Group/deduplicate files by path.
      const fileMap = new Map<string, any>()
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach((result: any) => {
          const file = result.file
          const key = file?.relative_path || JSON.stringify(file)
          if (!fileMap.has(key)) fileMap.set(key, file)
        })
      }
      const files = Array.from(fileMap.values())
      setKeywords(files)
      setTotal(files.length)
      setCurrentPage(1)
    } catch (error) {
      let message = 'Error searching keywords'
      try {
        if (error && typeof error === 'object' && 'message' in error) {
          // prefer the thrown Error message (lib/api now surfaces backend info)
          // @ts-ignore
          const errMsg: string = error.message
          // If backend reports project not found, show a friendly instruction
          if (errMsg.includes('Project path does not exist')) {
            message = 'Project not found on the server. Please re-select the project in the Project selector.'
          } else {
            message = errMsg
          }
        }
      } catch (_) {}
      setError(message)
      console.error('Error searching keywords:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  if (loading && keywords.length === 0) {
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
              placeholder="Search keywords..."
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
                loadKeywords()
              }}>
                Clear
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title className="h6 mb-0">Keywords ({total})</Card.Title>
        </Card.Header>
        <Card.Body>
          {keywords.length === 0 ? (
            <p className="text-muted text-center py-4">No keywords found</p>
          ) : (
            <>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>File</th>
                    <th>Keywords</th>
                    <th>Imports</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kwFile, index) => (
                    <tr key={index}>
                      <td>
                        {kwFile.package ? (
                          <Badge bg="primary">{kwFile.package}</Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <small className="text-muted">{kwFile.relative_path || '-'}</small>
                      </td>
                      <td>
                        {kwFile.keywords?.length > 0 ? (
                          <div>
                            {kwFile.keywords.map((kw: any, idx: number) => (
                              <Badge key={idx} bg="info" className="me-1">
                                {kw.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {kwFile.imports?.length || 0} imports
                        </small>
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
    </div>
  )
}

