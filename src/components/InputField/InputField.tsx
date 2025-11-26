import './InputField.css';
import { type FC, type KeyboardEvent } from 'react';
import searchImg from "../../statics/search.png";

import { useSelector, useDispatch } from 'react-redux'; 
import type { RootState, AppDispatch } from '../../store/store';
import { getScopesList, setSearchValue } from '../../store/slices/scopesSlice';

interface Props {
    value: string;
    loading?: boolean;
}

const InputField: FC<Props> = ({ value, loading }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatch(getScopesList());
        }
    };

    const handleSearchClick = () => {
        dispatch(getScopesList());
    };

    return (  
        <div className="search-bar">
            <div className="search-input">
                <img src={searchImg} alt="Search Icon" className="search-icon" />
                <input
                    type="text"
                    placeholder="Поиск телескопов"
                    value={value}
                    onChange={(event) => dispatch(setSearchValue(event.target.value))}
                    onKeyPress={handleKeyPress}
                    className="inp-text"
                    disabled={loading}
                />
                <button 
                    disabled={loading} 
                    className="search-button" 
                    onClick={handleSearchClick}
                >
                    Найти
                </button>
            </div>
        </div>
    );
};

export default InputField;