import { Spinner } from 'react-bootstrap'

export default function LoadingSpinner(): JSX.Element {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" data-qa="loading-spinner-container">
      <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} data-qa="loading-spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}
