import { type FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col } from 'react-bootstrap';
import Header from "../../components/Header/Header";
import ScopeCard from "../../components/ScopeCard/ScopeCard";
import { ROUTES } from '../../Routes';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  getStar, 
  deleteStar, 
  setError, 
  formStar, 
  setStarData, 
  updateStarData 
} from '../../store/slices/CalculationsDraft';
import "./StarPage.css";
import type { Scope } from '../../modules/models';

const StarPage: FC = () => {
  const { star_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    scopes,
    starData,
    error,
    isDraft,
    app_id,
    tempCalcValues
  } = useSelector((state: RootState) => state.vacancyApplicationDraft);

  const [localStarData, setLocalStarData] = useState({
    name: '',
    constellation: ''
  });

  useEffect(() => {
    if (star_id) {
      dispatch(getStar(star_id));
    }
  }, [dispatch, star_id]);

  useEffect(() => {
    setLocalStarData({
      name: starData.name || '',
      constellation: starData.constellation || ''
    });
  }, [starData.name, starData.constellation]);

  const handleDetailsClick = (id: number) => {
    navigate(`${ROUTES.SCOPES}/${id}`);
  };

  const handleAddToStar = (id: number) => {
    console.log('Add to star:', id);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (star_id) {
      try {
        await dispatch(deleteStar(star_id)).unwrap();
        navigate(ROUTES.SCOPES);
      } catch (error) {
        dispatch(setError(error as string));
      }
    }
  };

  const handleFormStar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (star_id) {
      try {
        console.log('Отправляемые данные:', tempCalcValues);
        
        await dispatch(formStar({ 
          starId: star_id, 
          calcValues: tempCalcValues 
        })).unwrap();
        
        navigate(ROUTES.SCOPES);
      } catch (error) {
        dispatch(setError(error as string));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalStarData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveStar = async () => {
    if (star_id) {
      try {
        console.log('Сохранение данных звезды:', localStarData);
        
        dispatch(setStarData(localStarData));
        
        await dispatch(updateStarData({ 
          starId: star_id, 
          starData: localStarData 
        })).unwrap();
        
        console.log('Данные успешно сохранены');
        
        dispatch(getStar(star_id));
        
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
        dispatch(setError(error as string));
      }
    }
  };

  return (
    <div className="star-page">
      <Header />
      
      {error && (
        <div className="alert alert-danger">
          Ошибка: {error}
        </div>
      )}
      
      <div className="star-inf">
        {!isDraft ? (
          <div className="star-info-display">
            <div className="star-name">Звезда: {starData.name || 'Не указано'}</div>
            <div className="star-cons">Созвездие: {starData.constellation || 'Не указано'}</div>
          </div>
        ) : (
          <div className="star-edit-form">
            <div className="form-group">
              <label className="form-label">Название звезды</label>
              <input
                type="text"
                name="name"
                className="form-control star-input"
                value={localStarData.name}
                onChange={handleInputChange}
                placeholder="Введите название звезды"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Созвездие</label>
              <input
                type="text"
                name="constellation"
                className="form-control star-input"
                value={localStarData.constellation}
                onChange={handleInputChange}
                placeholder="Введите созвездие"
              />
            </div>
            <button 
              type="button" 
              className="action-button save-data-button"
              onClick={handleSaveStar}
            >
              Сохранить изменения
            </button>
          </div>
        )}
      </div>

      <div className="scope-container">
        <div className="cards-wrapper-2 d-flex flex-column">
          {scopes.length ? (
            scopes.map(({ scope, calc, count }) => (
              scope.id ? (
                <Col key={scope.id}>
                  <ScopeCard
                    scope={scope as Scope}
                    calc={calc}
                    onDetailsClick={handleDetailsClick}
                    onAddToStar={handleAddToStar}
                    count={count}
                    isDraft={isDraft}
                  />
                </Col>
              ) : null
            ))
          ) : (
            <section className="scopes-not-found">
              <h1>К сожалению, пока ничего не найдено</h1>
            </section>
          )}
        </div>
      </div>

      <div className="buttons-container">
        {isDraft && (
          <>
            <button 
              type="button" 
              className="action-button delete-button"
              onClick={handleDelete}
            >
              Удалить заявку
            </button>
            <button 
              type="button" 
              className="action-button save-button"
              onClick={handleFormStar}
            >
              Сохранить заявку
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StarPage;