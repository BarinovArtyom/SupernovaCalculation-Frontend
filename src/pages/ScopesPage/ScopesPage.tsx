import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import ScopeCard from "../../components/ScopeCard/ScopeCard";
import InputField from "../../components/InputField/InputField";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { type Scope } from "../../modules/models";
import type { RootState, AppDispatch } from "../../store/store";
import { getScopesList } from "../../store/slices/scopesSlice";
import { setCount } from "../../store/slices/CalculationsDraft";
import "./ScopesPage.css";
import image from '../../statics/cart.png';
import { api } from "../../api";

const ScopesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { searchValue, scopes, loading } = useSelector((state: RootState) => state.scopes);
    const { app_id, count } = useSelector((state: RootState) => state.vacancyApplicationDraft);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getScopesList());
    }, [dispatch]);

    const handleDetailsClick = (id: number) => {
        navigate(`/scope/${id}`);
    };

    const handleCartClick = (app_id: number | undefined) => {
        if (app_id) {
            navigate(`${ROUTES.STAR}/${app_id}`);
        }
    };

    const handleAddToStar = async (id: number) => {
        try {
            await api.scope.addtostarCreate({
                scope_id: id.toString()
            });
            
            const newCount = (count || 0) + 1;
            dispatch(setCount(newCount));
            
        } catch (error) {
            console.error('Error adding scope to star:', error);
        }
    };

    return (
        <div className="scopes-page">
            <Header />
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS["/scopes"], path: ROUTES.SCOPES }
            ]} />

            <div className="search-section">
                <InputField
                    value={searchValue}
                    loading={loading}
                />
            </div>

            {loading && (
                <div className="loading-indicator">Загрузка...</div>
            )}

            <div className="scope-container">
                {!loading && scopes.length === 0 ? (
                    <section className="scopes-not-found">
                        <h1>К сожалению, ничего не найдено</h1>
                    </section>
                ) : (
                    <ul className="scope-list">
                        {scopes.map((scope: Scope) => (
                            <ScopeCard
                                key={scope.id}
                                scope={scope}
                                onDetailsClick={handleDetailsClick}
                                onAddToStar={handleAddToStar}
                                disabled={loading}
                            />
                        ))}
                    </ul>
                )}
            </div>

            <div className={`cart-icon-container ${(!isAuthenticated || !app_id) ? 'cart-disabled' : ''}`}>
                <button 
                    className="cart-button"
                    onClick={() => handleCartClick(app_id)}
                    disabled={!isAuthenticated || !app_id}
                >
                    <img
                        className="cart-icon"
                        src={image}
                        alt="Расчеты"
                    />
                    {(!isAuthenticated || !app_id) ? null : (
                        <div className="cart-badge">{count}</div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ScopesPage;