import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import "./HomePage.css"

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/scopes');
    };

    return (
        <div className="home-page">
            <Header />
            
            <main className="main-container">
                <div className="home-body">
                    <span className="home-title">Система расчета энергии сверхновых</span>
                    <span className="home-desc">
                        Астрономическая платформа для расчета энергии вспышек сверхновых типа Ia 
                        и оценки синтезированного никеля-56 на основе данных телескопов
                    </span>
                    <button className="btn-continue" onClick={handleContinue}>
                        Перейти к телескопам
                    </button>
                </div>
                <div className="home-bg-fade"></div>
            </main>
        </div>
    );
};

export default HomePage;