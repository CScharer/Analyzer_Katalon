import { Card, Row, Col } from 'react-bootstrap'

interface SummaryCardsProps {
  summary: any
}

export default function SummaryCards({ summary }: SummaryCardsProps): JSX.Element {
  const cards = [
    {
      title: 'Test Cases',
      value: summary?.test_cases?.total || 0,
      subtitle: 'Total test cases',
      variant: 'primary',
      icon: '📋',
    },
    {
      title: 'Test Suites',
      value: summary?.test_suites?.total || 0,
      subtitle: 'Total test suites',
      variant: 'success',
      icon: '📦',
    },
    {
      title: 'Keywords',
      value: summary?.keywords?.total_keywords || 0,
      subtitle: `${summary?.keywords?.total_files || 0} files`,
      variant: 'info',
      icon: '🔑',
    },
    {
      title: 'Objects',
      value: summary?.object_repository?.total || 0,
      subtitle: 'Object repository items',
      variant: 'warning',
      icon: '🎯',
    },
    {
      title: 'Profiles',
      value: summary?.profiles?.total || 0,
      subtitle: 'Execution profiles',
      variant: 'danger',
      icon: '⚙️',
    },
    {
      title: 'Scripts',
      value: summary?.scripts?.total || 0,
      subtitle: 'Test scripts',
      variant: 'secondary',
      icon: '📜',
    },
  ]

  return (
    <Row className="g-4 mb-4">
      {cards.map((card, index) => (
        <Col key={index} xs={12} sm={6} lg={4}>
          <Card className={`border-${card.variant} h-100`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="text-muted small mb-2">{card.title}</Card.Title>
                  <h2 className={`text-${card.variant} mb-1`}>{card.value}</h2>
                  <Card.Text className="text-muted small mb-0">{card.subtitle}</Card.Text>
                </div>
                <div className={`text-${card.variant}`} style={{ fontSize: '2.5rem' }}>
                  {card.icon}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
