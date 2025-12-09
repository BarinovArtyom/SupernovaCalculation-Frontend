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
    const { isAuthenticated, uid, role } = useSelector((state: RootState) => state.user);
    const [isModerator, setIsModerator] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    useEffect(() => {
        setIsModerator(role === 2);
    }, [role]);


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
            
            const initiallyFiltered = allStars.filter(star => 
                star.status === 'formed' || star.status === 'completed' || star.status === 'declined'
            );
            setFilteredStars(initiallyFiltered);
        } catch (err: any) {
            console.error('Error fetching stars:', err);
            setError("Ошибка при загрузке заявок.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateStarStatus = async (starId: number, status: 'completed' | 'declined') => {
        try {
            setIsLoading(true);
            const response = await api.star.finishUpdate(
                starId.toString(),
                { status },
                returnHeaderConfig()
            );
            
            if (response.status === 200) {
                
                setStars(prevStars => 
                    prevStars.map(star => 
                        star.id === starId 
                            ? { 
                                ...star, 
                                status: status,
                                finish_date: new Date().toISOString(),
                                mod_id: uid || 0,
                                completed_calculations: status === 'completed' ? 0 : undefined
                              } 
                            : star
                    )
                );
                
                if (status === 'completed') {
                    startPollingForCalculations(starId);
                }
                
            }
        } catch (err: any) {
            console.error('Error updating star status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const startPollingForCalculations = (starId: number) => {
        let pollCount = 0;
        const maxPolls = 30;
        
        const poll = async () => {
            if (pollCount >= maxPolls) return;
            
            try {
                const response = await api.stars.starsList(undefined, returnHeaderConfig());
                const updatedStar = response.data.find((star: DsStar) => star.id === starId);
                
                if (updatedStar && updatedStar.completed_calculations !== undefined) {
                    setStars(prevStars => 
                        prevStars.map(star => 
                            star.id === starId 
                                ? { ...star, completed_calculations: updatedStar.completed_calculations } 
                                : star
                        )
                    );
                }
                
                pollCount++;
                setTimeout(poll, 5000);
            } catch (err) {
                console.error('Polling error:', err);
            }
        };
        
        setTimeout(poll, 5000);
    };

    useEffect(() => {
        if (!isAuthenticated || !isModerator) return;
        
        const pollInterval = setInterval(() => {
            fetchStars();
        }, 5000);
        
        return () => clearInterval(pollInterval);
    }, [isAuthenticated, isModerator]);

    useEffect(() => {
        fetchStars();
    }, [dispatch, isAuthenticated]);

    const applyFilters = () => {
        let result = stars.filter(star => 
            star.status === 'formed' || star.status === 'completed' || star.status === 'declined'
        );

        if (statusFilter !== 'all') {
            result = result.filter(star => star.status === statusFilter);
        }

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

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
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

    const clearFilters = () => {
        setStatusFilter('all');
        setDateFrom('');
        setDateTo('');
        
        const initiallyFiltered = stars.filter(star => 
            star.status === 'formed' || star.status === 'completed' || star.status === 'declined'
        );
        setFilteredStars(initiallyFiltered);
    };

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
            'completed': 'Завершена',
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
            'completed': 'status-finished',
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

    const handleCardClick = (star: DsStar, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.moderator-actions')) {
            e.stopPropagation();
            return;
        }
        
        if (star.id) {
            navigate(`${ROUTES.STAR}/${star.id}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className='body'>
                    <div className="stars-page">
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
                    
                    {notification && (
                        <div className={`notification notification-${notification.type}`}>
                            {notification.message}
                            <button 
                                className="notification-close"
                                onClick={() => setNotification(null)}
                            >
                                ×
                            </button>
                        </div>
                    )}
                                        
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
                                    <option value="completed">Завершенные</option>
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
                    
                    
                    {isLoading && !stars.length ? (
                        <div className="loading">Загрузка заявок...</div>
                    ) : filteredStars.length > 0 ? (
                        <>
                            <div className="stars-count">
                                Найдено заявок: {filteredStars.length}
                            </div>
                            
                            <div className="stars-cards-container">
                                {filteredStars.map((star) => (
                                    <div 
                                        key={star.id}
                                        className="star-card clickable-card"
                                        onClick={(e) => handleCardClick(star, e)}
                                    >
                                        <div className="star-card-header">
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
                                            {star.completed_calculations !== undefined && star.status === 'completed' && (
                                                <div className="card-info-row">
                                                    <span className="card-label">Завершено расчетов:</span>
                                                    <span className="card-value" style={{ color: '#1A408A', fontWeight: 'bold' }}>
                                                        {star.completed_calculations}
                                                    </span>
                                                </div>
                                            )}
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
                                        
                                        {/* Кнопки модератора */}
                                        {isModerator && star.status === 'formed' && (
                                            <div className="moderator-actions">
                                                <div className="action-buttons">
                                                    <button 
                                                        className="approve-btn"
                                                        onClick={() => star.id && updateStarStatus(star.id, 'completed')}
                                                        disabled={isLoading}
                                                    >
                                                        Одобрить
                                                    </button>
                                                    <button 
                                                        className="decline-btn"
                                                        onClick={() => star.id && updateStarStatus(star.id, 'declined')}
                                                        disabled={isLoading}
                                                    >
                                                        Отклонить
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {star.status === 'completed' && star.completed_calculations !== undefined && (
                                            <div className="calculations-progress">
                                                <div className="progress-label">
                                                    Прогресс расчетов: {star.completed_calculations > 0 ? 'Завершено' : 'В процессе'}
                                                </div>
                                                {star.completed_calculations > 0 && (
                                                    <div className="progress-message">
                                                        <small>{star.completed_calculations} расчетов завершено</small>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="star-card-footer">
                                            <span className="view-details-link">Просмотреть детали</span>
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