import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { type Scope } from '../../modules/models';
import { mockScopes } from '../../modules/mock';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './ScopePage.css';
import image from '../../statics/default.png'

const ScopePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [scope, setScope] = useState<Scope | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchScope = async () => {
        try {
            const response = await fetch(`/api/scope/${id}`);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log('Backend scope response:', data);

            if (data && data.Specs && data.Specs.id) {
                const scopeData: Scope = {
                    id: data.Specs.id,
                    name: data.Specs.name,
                    description: data.Specs.description,
                    status: data.Specs.status,
                    img_link: data.Specs.img_link,
                    filter: data.Specs.filter,
                    lambda: data.Specs.lambda,
                    delta_lamb: data.Specs.delta_lamb,
                    zero_point: data.Specs.zero_point
                };

                setScope(scopeData);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Fetch error, using mock data:', error);
            const idNum = parseInt(id as string, 10);
            const mockScope = mockScopes.find(scope => scope?.id === idNum) as Scope;
            setScope(mockScope);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScope();

        return () => {
            setScope(null);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="scope-page">
                <Header />
                <BreadCrumbs crumbs={[
                    { label: ROUTE_LABELS["/scopes"], path: ROUTES.SCOPES },
                    { label: 'Загрузка...' }
                ]} />
                <div className="loading">Загрузка данных телескопа...</div>
            </div>
        );
    }

    if (!scope) {
        return (
            <div className="scope-page">
                <Header />
                <BreadCrumbs crumbs={[
                    { label: ROUTE_LABELS["/scopes"], path: ROUTES.SCOPES },
                    { label: 'Не найден' }
                ]} />
                <div className="not-found">Телескоп не найден</div>
            </div>
        );
    }

    return (
        <div className="scope-page">
            <Header />
            
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS["/scopes"], path: ROUTES.SCOPES },
                { label: scope.name }
            ]} />

            <div className="details-card">
                <div className="scope-content">
                    <div className="scope-title">{scope.name}</div>
                    <div className="scope-info">Фильтр: {scope.filter}</div>
                    <div className="scope-info">Эффективная длина волны: {scope.lambda} Å</div>
                    <div className="scope-info">Ширина полосы пропускания: {scope.delta_lamb} Å</div>
                    <div className="scope-info">Константа нулевой точки: {scope.zero_point}</div>
                    <div className="scope-description">{scope.description}</div>
                    
                    <div className="scope-buttons">
                        <button 
                            className="order-button"
                            onClick={() => window.history.back()}
                        >
                            Назад к списку
                        </button>
                    </div>
                </div>
                <img 
                    className="scope-image" 
                    src={scope.img_link || image} 
                    alt={scope.name}
                />
            </div>
        </div>
    );
};

export default ScopePage;