import ReactDOM from 'react-dom/client';
import App from './App';
import store from "./store/store";
import { Provider } from "react-redux";
import {registerSW} from "virtual:pwa-register";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

if ("serviceWorker" in navigator) {
  registerSW()
}