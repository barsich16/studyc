import {BrowserRouter} from "react-router-dom";
import {generateRoutes} from "./routes";
import Loader from "./components/Loader";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import {partLogin} from "./redux/userReducer";
import './App.css';
import 'antd/dist/antd.css';

import {useFetching} from "./hooks/useFetching.hook";

const App = ({isAuthenticated, loading, role, partLogin}) => {
    const storageName = 'userData';
    const {fetching} = useFetching();
    const [ready, setReady] = useState(false);
    const [isLocalStorage, setIsLocalStorage] = useState(false);

    useEffect( () => {
        if (!ready) {
            const data = JSON.parse(localStorage.getItem(storageName));
            if (data && data.token) {
                setIsLocalStorage(true);
                fetching(partLogin, data.userId, data.token, data.role);
                setReady(true);
            }
        }
    }, [partLogin]);

    if (loading) {
        return <Loader />
    }

    if (isAuthenticated) {
        const routes = generateRoutes(isAuthenticated, role);
        return (
            <BrowserRouter>
                <div className="App">
                    {routes}
                </div>
            </BrowserRouter>
        );
    }
    else {
        const routes = generateRoutes(false);
        return (
            <BrowserRouter>
                <div className="App">
                    {routes}
                </div>
            </BrowserRouter>
        );
    }
}

const mapState = state => ({
    isAuthenticated: state.user.isAuthenticated,
    isLoginizationFinished: state.user.isLoginizationFinished,
    loading: state.user.loading,
    role: state.user.role
});
export default connect(mapState, {partLogin})(App);
