import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage";
import ScopesPage from "./pages/ScopesPage/ScopesPage";
import ScopePage from "./pages/ScopePage/ScopePage";
import LoginPage from './pages/LoginPage/LoginPage';
import StarPage from './pages/StarPage/StarPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import StarsPage from './pages/StarsPage/StarsPage';
import { ROUTES } from "./Routes";

function App() {
    console.log("Written light");
    
    return (
        <BrowserRouter basename='/SupernovaEnergyCalculation-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<HomePage />} />
                <Route path={ROUTES.SCOPES} element={<ScopesPage />} />
                <Route path={`${ROUTES.SCOPE}/:id`} element={<ScopePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.STARS} element={<StarsPage />} />         
                <Route path={`${ROUTES.STAR}/:star_id`} element={<StarPage />} />  
                <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />  
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />         
            </Routes>
        </BrowserRouter>
    );
}

export default App;