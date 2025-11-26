import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import Header from "../../components/Header/Header";
import type { AppDispatch, RootState } from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserAsync, getUserProfileAsync } from '../../store/slices/userSlice';

const ProfilePage: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    const { uid, username, role, isAuthenticated, error } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [success, setSuccess] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getUserProfileAsync());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (username) {
            setFormData(prev => ({
                ...prev,
                login: username
            }));
        }
    }, [username]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setSuccess(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setLocalError('Новые пароли не совпадают.');
            return;
        }

        if (!formData.currentPassword && formData.newPassword) {
            setLocalError('Для изменения пароля введите текущий пароль.');
            return;
        }

        if (!uid) {
            setLocalError('Пользователь не авторизован.');
            return;
        }

        try {
            await dispatch(updateUserAsync({
                user_id: uid,
                login: formData.login,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })).unwrap();
            
            setSuccess('Данные успешно обновлены.');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            setLocalError('Ошибка при обновлении данных. Проверьте введённые данные.');
        }
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className='body'>
                    <div className="profile-page">
                        <h1>Личный кабинет</h1>
                        <div className="error-message">Для доступа к личному кабинету необходимо авторизоваться.</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className='body'>
                <div className="profile-page">
                    <h1>Личный кабинет</h1>
                    <div className="user-info">
                        <p><strong>Роль:</strong> {role === 1 ? 'Модератор' : 'Пользователь'}</p>
                    </div>
                    
                    {localError && <div className="error-message">{localError}</div>}
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Логин</label>
                            <input
                                type="text"
                                id="login"
                                name="login"
                                value={formData.login}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentPassword">Текущий пароль</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Введите для подтверждения изменений"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">Новый пароль</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Оставьте пустым, если не хотите менять"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Подтверждение нового пароля</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Оставьте пустым, если не хотите менять"
                            />
                        </div>
                        <button type="submit" className="submit-button">Сохранить изменения</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;