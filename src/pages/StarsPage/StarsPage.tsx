import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StarsPage.css';
import Header from "../../components/Header/Header";
import { ROUTES } from "../../Routes";
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { api } from '../../api';
import { returnHeaderConfig } from '../../store/slices/userSlice';
import type { DsStar } from '../../api/Api';

const StarsPage: React.FC = () => {
    const [stars, setStars] = useState<DsStar[]>([]);
    const [filteredStars, setFilteredStars] = useState<DsStar[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, uid } = useSelector((state: RootState) => state.user);

    // Состояния для фильтров
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    const fetchStars = async () => {
        if (!isAuthenticated) {
            setError("Для просмотра заявок необходимо авторизоваться.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.stars.starsList(undefined, returnHeaderConfig());
            const allStars = response.data;
            setStars(allStars);
            
            // Изначально отфильтровать только по статусам (как было раньше)
            const initiallyFiltered = allStars.filter(star => 
                star.status === 'formed' || star.status === 'finished' || star.status === 'declined'
            );
            setFilteredStars(initiallyFiltered);
        } catch (err: any) {
            console.error('Error fetching stars:', err);
            setError("Ошибка при загрузке заявок.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStars();
    }, [dispatch, isAuthenticated]);

    // Функция применения фильтров
    const applyFilters = () => {
        let result = stars.filter(star => 
            star.status === 'formed' || star.status === 'finished' || star.status === 'declined'
        );

        // Фильтр по статусу
        if (statusFilter !== 'all') {
            result = result.filter(star => star.status === statusFilter);
        }

        // Фильтр по дате от
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            result = result.filter(star => {
                if (!star.creation_date || star.creation_date === '0001-01-01T00:00:00Z' || star.creation_date === '0001-01-01T00:00:00') {
                    return false;
                }
                const starDate = new Date(star.creation_date);
                return starDate >= fromDate;
            });
        }

        // Фильтр по дате до
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // Устанавливаем конец дня
            result = result.filter(star => {
                if (!star.creation_date || star.creation_date === '0001-01-01T00:00:00Z' || star.creation_date === '0001-01-01T00:00:00') {
                    return false;
                }
                const starDate = new Date(star.creation_date);
                return starDate <= toDate;
            });
        }

        setFilteredStars(result);
    };

    // Функция сброса фильтров
    const clearFilters = () => {
        setStatusFilter('all');
        setDateFrom('');
        setDateTo('');
        
        // Возвращаем исходную фильтрацию
        const initiallyFiltered = stars.filter(star => 
            star.status === 'formed' || star.status === 'finished' || star.status === 'declined'
        );
        setFilteredStars(initiallyFiltered);
    };

    // Автоматически применяем фильтры при их изменении
    useEffect(() => {
        if (stars.length > 0) {
            applyFilters();
        }
    }, [statusFilter, dateFrom, dateTo, stars]);

    const getStatusText = (status: string | undefined) => {
        if (!status) return 'Неизвестно';
        
        const statusMap: { [key: string]: string } = {
            'active': 'Черновик',
            'formed': 'Сформирована',
            'declined': 'Отклонена',
            'finished': 'Завершена',
            'deleted': 'Удалена'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string | undefined) => {
        if (!status) return '';
        
        const statusClassMap: { [key: string]: string } = {
            'active': 'status-draft',
            'formed': 'status-formed',
            'declined': 'status-declined',
            'finished': 'status-finished',
            'deleted': 'status-deleted'
        };
        return statusClassMap[status] || '';
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString || dateString === '0001-01-01T00:00:00Z' || dateString === '0001-01-01T00:00:00') {
            return '-';
        }
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const formatShortDate = (dateString: string | undefined) => {
        if (!dateString || dateString === '0001-01-01T00:00:00Z' || dateString === '0001-01-01T00:00:00') {
            return '-';
        }
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className='body'>
                    <div className="stars-page">
                        <h1>Мои заявки</h1>
                        <div className="error">Для просмотра заявок необходимо авторизоваться.</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className='body'>
                <div className="stars-page">
                    {error && <div className="error">{error}</div>}
                    <h1>Мои заявки</h1>
                    
                    {/* Секция фильтров */}
                    <div className="filters-section">
                        <h3>Фильтры заявок</h3>
                        <div className="filters-row">
                            <div className="filter-group">
                                <label htmlFor="statusFilter">Статус:</label>
                                <select 
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Все статусы</option>
                                    <option value="formed">Сформированные</option>
                                    <option value="finished">Завершенные</option>
                                    <option value="declined">Отклоненные</option>
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label htmlFor="dateFrom">Дата создания от:</label>
                                <input 
                                    type="date" 
                                    id="dateFrom"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            
                            <div className="filter-group">
                                <label htmlFor="dateTo">Дата создания до:</label>
                                <input 
                                    type="date" 
                                    id="dateTo"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                            
                            <div className="filter-actions">
                                <button 
                                    className="clear-filters-btn"
                                    onClick={clearFilters}
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="page-info">
                        <p>Отображаются только завершенные, сформированные и отклоненные заявки. Черновики и удаленные заявки скрыты.</p>
                    </div>
                    
                    {isLoading ? (
                        <div className="loading">Загрузка заявок...</div>
                    ) : filteredStars.length > 0 ? (
                        <>
                            <div className="stars-count">
                                Найдено заявок: {filteredStars.length}
                            </div>
                            
                            {/* Карточки заявок вместо таблицы */}
                            <div className="stars-cards-container">
                                {filteredStars.map((star) => (
                                    <div 
                                        key={star.id}
                                        className="star-card clickable-card"
                                        onClick={() => star.id && navigate(`${ROUTES.STAR}/${star.id}`)}
                                    >
                                        <div className="star-card-header">
                                            <div className="star-card-id">
                                                <span className="card-label">ID:</span>
                                                <span className="card-value">{star.id || '-'}</span>
                                            </div>
                                            <div className="star-card-status">
                                                <span className={`status-badge ${getStatusClass(star.status)}`}>
                                                    {getStatusText(star.status)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="star-card-title">
                                            <h3>{star.name || 'Без названия'}</h3>
                                        </div>
                                        
                                        <div className="star-card-info">
                                            <div className="card-info-row">
                                                <span className="card-label">Созвездие:</span>
                                                <span className="card-value">{star.constellation || 'Не указано'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="star-card-dates">
                                            <div className="date-row">
                                                <div className="date-item">
                                                    <span className="date-label">Создана:</span>
                                                    <span className="date-value">{formatShortDate(star.creation_date)}</span>
                                                </div>
                                                {star.form_date && star.form_date !== '0001-01-01T00:00:00Z' && (
                                                    <div className="date-item">
                                                        <span className="date-label">Сформирована:</span>
                                                        <span className="date-value">{formatShortDate(star.form_date)}</span>
                                                    </div>
                                                )}
                                                {star.finish_date && star.finish_date !== '0001-01-01T00:00:00Z' && (
                                                    <div className="date-item">
                                                        <span className="date-label">Завершена:</span>
                                                        <span className="date-value">{formatShortDate(star.finish_date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="star-card-footer">
                                            <span className="view-details-link">Просмотреть детали →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-stars">
                            <h3>Заявок не найдено</h3>
                            <p>По выбранным фильтрам заявок не найдено.</p>
                            <p>Попробуйте изменить параметры фильтрации.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StarsPage;