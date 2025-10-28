import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './ScopeCard.css';
import { type Scope } from '../../modules/models';
import image from '../../statics/default.png';

interface ScopeCardProps {
  scope: Scope;
  onDetailsClick: (id: number) => void;
  onAddToStar: (id: number) => void;
}

const ScopeCard: React.FC<ScopeCardProps> = ({ scope, onDetailsClick, onAddToStar }) => {
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDetailsClick(scope.id);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToStar(scope.id);
  };

  const imageUrl = scope.img_link || image;

  return (
    <li className="scope-item">
      <Card className="scope-card">
        <Card.Body className="scope-card-body">
          <div className="scope-content">
            <Card.Title className="scope-title">{scope.name}</Card.Title>
            <Card.Text className="scope-description">
              {scope.description}
            </Card.Text>
            <div className="scope-buttons">
              <Button 
                className="details-button"
                onClick={handleDetailsClick}
                variant="secondary"
              >
                Подробнее
              </Button>
              <Button 
                className="order-button"
                onClick={handleAddClick}
                variant="secondary"
              >
                Добавить
              </Button>
            </div>
          </div>
          <Card.Img 
            className="scope-image" 
            src={imageUrl} 
            alt={scope.name}
          />
        </Card.Body>
      </Card>
    </li>
  );
};

export default ScopeCard;