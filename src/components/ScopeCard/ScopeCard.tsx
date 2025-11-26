import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './ScopeCard.css';
import { type Scope, type Calc } from '../../modules/models';
import image from '../../statics/default.png';

import { 
  addScopeToStar, 
  setCalcValue,
  deleteScopeFromStar
} from '../../store/slices/CalculationsDraft';
import { getScopesList } from '../../store/slices/scopesSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';

interface ScopeCardProps {
  scope: Scope;
  calc?: Calc;
  onDetailsClick: (id: number) => void;
  onAddToStar: (id: number) => void;
  disabled?: boolean;
  count?: number;
  isDraft?: boolean;
}

const ScopeCard: React.FC<ScopeCardProps> = ({ 
  scope, 
  calc,
  onDetailsClick, 
  onAddToStar,
  disabled,
  count,
  isDraft = false
}) => {
  const { pathname } = useLocation();
  
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const tempCalcValues = useSelector((state: RootState) => state.vacancyApplicationDraft.tempCalcValues);
  const { app_id } = useSelector((state: RootState) => state.vacancyApplicationDraft);

  const handleAdd = async () => {
    if (scope.id) {
      await dispatch(addScopeToStar(scope.id));
      await dispatch(getScopesList());
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDetailsClick(scope.id);
  };

  const handleDeleteScope = async () => {
    if (scope.id && app_id) {
      try {
        await dispatch(deleteScopeFromStar({ 
          starId: app_id.toString(), 
          scopeId: scope.id 
        })).unwrap();
      } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (scope.id) {
      dispatch(setCalcValue({
        scopeId: scope.id.toString(),
        value: e.target.value
      }));
    }
  };

  const getInputValue = () => {
    if (!scope.id) return '';
    
    if (tempCalcValues[scope.id] !== undefined) {
      return tempCalcValues[scope.id];
    }
    
    if (calc) {
      return `${calc.inp_mass || ''} ${calc.inp_texp || ''} ${calc.inp_dist || ''}`.trim();
    }
    
    return '';
  };

  if (pathname === "/scopes") {
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
                {(isAuthenticated == true) && (
                  <Button 
                    className="order-button"
                    onClick={() => handleAdd()}
                    variant="secondary"
                    disabled={disabled}
                  >
                    Добавить
                  </Button>
                )}
              </div>
            </div>
            <Card.Img 
              className="scope-image" 
              src={scope.img_link || image} 
              alt={scope.name}
            />
          </Card.Body>
        </Card>
      </li>
    );
  }

  if (pathname.includes("/star/")) {
    return (
      <div className="star-scope-card">
        <div className="star-scope-content">
          <img 
            className="star-scope-image"
            src={scope.img_link || image} 
            alt={scope.name}
          />
          <div className="star-scope-title">{scope.name}</div>
        </div>
        <div className="star-inputs-container">
          <input 
            className="star-val-inp"
            type="text" 
            name={`calc_values_${scope.id}`}
            value={getInputValue()}
            onChange={handleInputChange}
            placeholder="Введите значение (масса темп расстояние)"
          />
          <input 
            className="star-res-inp"
            type="text" 
            value={calc ? `${calc.res_en || ''} ${calc.res_ni || ''}`.trim() : ""}
            placeholder="Результат" 
            readOnly
          />
        </div>
        {isDraft && (
          <button 
            className="delete-scope-button"
            onClick={handleDeleteScope}
          >
            Удалить
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default ScopeCard;