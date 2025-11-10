import { type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import ScopeCard from "../../components/ScopeCard/ScopeCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { type Scope } from "../../modules/models";
import { mockScopes } from "../../modules/mock";
import { setSearchQuery } from "../../store/slices/filtersSlice";
import { 
    setScopes, 
    setLoading, 
    setError, 
    setStarId, 
    setCalcCount 
} from "../../store/slices/scopesSlice";
import type { RootState } from "../../store/store";
import "./ScopesPage.css";
import image from '../../statics/cart.png'

const ScopesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchQuery = useSelector((state: RootState) => state.filters.searchQuery);
    const scopes = useSelector((state: RootState) => state.scopes.scopes);
    const loading = useSelector((state: RootState) => state.scopes.loading);
    const calcCount = useSelector((state: RootState) => state.scopes.calcCount);
    const starId = useSelector((state: RootState) => state.scopes.starId);

    const fetchScopes = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await fetch(`/api/scopes?search=${searchQuery.toLowerCase()}`);

            if (!response.ok) {
                throw new Error('Network response failed');
            }
            
            const result = await response.json();

            if (result && result.Scopes && Array.isArray(result.Scopes)) {
                const scopesData: Scope[] = result.Scopes.map((scope: any) => ({
                    id: scope.id,
                    name: scope.name,
                    description: scope.description,
                    img_link: scope.img_link,
                    filter: scope.filter,
                    lambda: scope.lambda,
                    delta_lamb: scope.delta_lamb,
                    zero_point: scope.zero_point
                }));

                dispatch(setScopes(scopesData));
                dispatch(setCalcCount(result.CalcCount || 0));
                dispatch(setStarId(result.Star_ID || 0));
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            createMocks();
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createMocks = () => {
        const filteredScopes = mockScopes.filter(scope => 
            scope.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        dispatch(setScopes(filteredScopes));
        dispatch(setCalcCount(3));
        dispatch(setStarId(1));
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
                dispatch(setCalcCount(calcCount + 1));
                console.log(`Телескоп ${id} добавлен в расчеты`);
            } else {
                throw new Error('Failed to add scope to star');
            }
        } catch (error) {
            console.error('Error adding scope to star:', error);
            dispatch(setCalcCount(calcCount + 1));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
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
                        onChange={handleSearchChange}
                        disabled={loading}
                    />
                </form>
            </div>

            {loading && (
                <div className="loading-indicator">Загрузка...</div>
            )}

            <div className="scope-container">
                <ul className="scope-list">
                    {scopes.map(scope => (
                        <ScopeCard 
                            key={scope.id} 
                            scope={scope}
                            onDetailsClick={handleDetailsClick}
                            onAddToStar={handleAddToStar}
                            disabled={loading}
                        />
                    ))}
                </ul>
            </div>

            <div className={`cart-icon-container ${starId === 0 ? 'cart-disabled' : ''}`}>
                <a href={starId === 0 ? '#' : `/star/${starId}`}>
                    <img 
                        className="cart-icon" 
                        src={image}
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