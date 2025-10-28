import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage";
import ScopesPage from "./pages/ScopesPage/ScopesPage";
import ScopePage from "./pages/ScopePage/ScopePage";
import { ROUTES } from "./Routes";

function App({ setMode }: { setMode: React.Dispatch<React.SetStateAction<string>> }) {
    setMode("dark"); // Устанавливаем светлую тему по умолчанию
    console.log("Written light");
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} index element={<HomePage />} />
                <Route path={ROUTES.SCOPES} element={<ScopesPage />} />
                <Route path={`${ROUTES.SCOPE}:id`} element={<ScopePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;