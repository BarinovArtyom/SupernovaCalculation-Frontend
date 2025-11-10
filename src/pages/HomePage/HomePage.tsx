import React from 'react';
import { Carousel } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../../Routes';
import "./HomePage.css";

// Импортируем изображения
import carousel1 from '../../statics/carousel1.jpg';
import carousel2 from '../../statics/carousel2.jpg';
import carousel3 from '../../statics/carousel3.jpg';
import defaultCarouselImage from '../../statics/default.png';

const HomePage: React.FC = () => {
    const carouselItems = [
        {
            title: "Система расчета энергии сверхновых",
            description: "Астрономическая платформа для расчета энергии вспышек сверхновых типа Ia и оценки синтезированного никеля-56",
            image: carousel1
        },
        {
            title: "Профессиональные телескопы",
            description: "Работа с данными ведущих обсерваторий мира включая Hubble, James Webb и другие",
            image: carousel2
        },
        {
            title: "Точные расчеты",
            description: "Научно обоснованные методы расчета энергии сверхновых звезд",
            image: carousel3
        }
    ];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultCarouselImage;
    };

    return (
        <div className="home-page">
            <Header />
            
            <BreadCrumbs crumbs={[
                { label: ROUTE_LABELS["/"] }
            ]} />

            <main className="main-container">
                <div className="home-body">
                    <Carousel fade className="home-carousel">
                        {carouselItems.map((item, index) => (
                            <Carousel.Item key={index} interval={5000}>
                                <img
                                    className="d-block w-100 carousel-image"
                                    src={item.image}
                                    alt={item.title}
                                    onError={handleImageError}
                                />
                                <Carousel.Caption className="carousel-caption-custom">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className="home-bg-fade"></div>
            </main>
        </div>
    );
};

export default HomePage;