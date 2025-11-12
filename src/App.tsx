import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage";
import ScopesPage from "./pages/ScopesPage/ScopesPage";
import ScopePage from "./pages/ScopePage/ScopePage";
import { ROUTES } from "./Routes";
import { useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";

function App() {
    useEffect (() => {
        invoke('tauri', {cmd: 'create'})
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error));
        
        return () => {
            invoke('tauri', {cmd: 'close'})
                .then((response: any) => console.log(response))
                .catch((error: any) => console.log(error));
        }
    }, []);
    console.log("Written light");
    
    return (
        <BrowserRouter basename='/SupernovaEnergyCalculation-Frontend'>
            <Routes>
                <Route path={ROUTES.HOME} index element={<HomePage />} />
                <Route path={ROUTES.SCOPES} element={<ScopesPage />} />
                <Route path={`${ROUTES.SCOPE}/:id`} element={<ScopePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;