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
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, uid } = useSelector((state: RootState) => state.user);

    const fetchStars = async () => {
        if (!isAuthenticated) {
            setError("Для просмотра заявок необходимо авторизоваться.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.stars.starsList(undefined, returnHeaderConfig());
            setStars(response.data);
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

    const filteredStars = stars.filter(star => 
        star.status === 'formed' || star.status === 'finished' || star.status === 'declined'
    );

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
                            <table className="stars-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Название</th>
                                        <th>Созвездие</th>
                                        <th>Статус</th>
                                        <th>Дата создания</th>
                                        <th>Дата формирования</th>
                                        <th>Дата завершения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStars.map((star) => (
                                        <tr
                                            key={star.id}
                                            className="clickable-row"
                                            onClick={() => star.id && navigate(`${ROUTES.STAR}/${star.id}`)}
                                        >
                                            <td>{star.id || '-'}</td>
                                            <td>{star.name || 'Не указано'}</td>
                                            <td>{star.constellation || 'Не указано'}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(star.status)}`}>
                                                    {getStatusText(star.status)}
                                                </span>
                                            </td>
                                            <td>{formatDate(star.creation_date)}</td>
                                            <td>{formatDate(star.form_date)}</td>
                                            <td>{formatDate(star.finish_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="no-stars">
                            <h3>Заявок не найдено</h3>
                            <p>У вас пока нет завершенных, сформированных или отклоненных заявок.</p>
                            <p>Активные черновики можно найти в <a href={ROUTES.SCOPES}>разделе услуг</a>.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StarsPage;