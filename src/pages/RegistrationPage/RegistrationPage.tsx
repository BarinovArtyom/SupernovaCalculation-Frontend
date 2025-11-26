import React from "react";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./RegistrationPage.css";
import Header from "../../components/Header/Header";

const RegistrationPage: React.FC = () => {
    return (
        <>
            <Header />
            <div className="body">
                <div className="registration-page">
                    <div className="container">
                        <RegisterForm/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistrationPage;