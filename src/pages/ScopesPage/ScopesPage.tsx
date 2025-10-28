import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ScopeCard from "../../components/ScopeCard/ScopeCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { type Scope } from "../../modules/models";
import { mockScopes } from "../../modules/mock";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import "./ScopesPage.css";

const ScopesPage = () => {
    const [scopes, setScopes] = useState<Scope[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [starId, setStarId] = useState(1);
    const [calcCount, setCalcCount] = useState(0);
    
    const navigate = useNavigate();

    const fetchScopes = async () => {
        try {
            const response = await fetch(`/api/scopes?search=${searchQuery.toLowerCase()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Backend response:', result);

            if (result && result.Scopes && Array.isArray(result.Scopes)) {
                const scopesData = result.Scopes.map((scope: any) => ({
                    id: scope.id,
                    name: scope.name,
                    description: scope.description,
                    img_link: scope.img_link,
                    filter: scope.filter,
                    lambda: scope.lambda,
                    delta_lamb: scope.delta_lamb,
                    zero_point: scope.zero_point
                }));

                setScopes(scopesData);
                setCalcCount(result.CalcCount || 0);
                setStarId(result.Star_ID || 0);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error("Fetch error, using mock data:", error);
            const filteredScopes = mockScopes.filter(scope => 
                scope.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scope.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setScopes(filteredScopes);
            setCalcCount(3);
            setStarId(1);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await fetchScopes();
    };

    const handleDetailsClick = (id: number) => {
        navigate(`/scope/${id}`);
    };

    const handleAddToStar = async (id: number) => {
        try {
            const response = await fetch('/api/scope/addtostar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scope_id: id })
            });

            if (response.ok) {
                await fetchScopes();
                console.log(`Телескоп ${id} добавлен в расчеты`);
            } else {
                throw new Error('Failed to add scope to star');
            }
        } catch (error) {
            console.error('Error adding scope to star:', error);
            setCalcCount(prev => prev + 1);
        }
    };

    useEffect(() => {
        fetchScopes();
    }, []);

    return (
        <div className="scopes-page">
            <Header />
            
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS["/scopes"], path: ROUTES.SCOPES }
            ]} />

            <div className="search-section">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="search"
                        className="field-search-text"
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="scope-container">
                <ul className="scope-list">
                    {scopes.map(scope => (
                        <ScopeCard 
                            key={scope.id} 
                            scope={scope}
                            onDetailsClick={handleDetailsClick}
                            onAddToStar={handleAddToStar}
                        />
                    ))}
                </ul>
            </div>

            <div className={`cart-icon-container ${starId === 0 ? 'cart-disabled' : ''}`}>
                <a href={starId === 0 ? '#' : `/star/${starId}`}>
                    <img 
                        className="cart-icon" 
                        src="http://127.0.0.1:9000/vedro/cart.png" 
                        alt="Расчеты" 
                    />
                    {calcCount > 0 && (
                        <div className="cart-badge">{calcCount}</div>
                    )}
                </a>
            </div>
        </div>
    );
};

export default ScopesPage;