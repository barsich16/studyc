import {BrowserRouter} from "react-router-dom";
import {generateRoutes} from "./routes";
import Loader from "./components/Loader";
import {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {login, partLogin} from "./redux/userReducer";
import './App.css';
import 'antd/dist/antd.css';
import {setStatusMessage} from "./redux/teacherReducer";
//import {useFetching} from "./hooks/useFetching.hook";
import {message} from "antd";
import {useFetching} from "./hooks/useFetching.hook";

const App = ({isAuthenticated, isLoginizationFinished, role, partLogin}) => {
    const storageName = 'userData';
    const {fetching} = useFetching();
    const [ready, setReady] = useState(false);
    const [isLocalStorage, setIsLocalStorage] = useState(true);

    useEffect( () => {
        if (!ready) {
            const data = JSON.parse(localStorage.getItem(storageName));
            if (data && data.token) {
                fetching(partLogin, data.userId, data.token, data.role);
                // login(data.userId, data.token, data.role).then(tokenExpired => {
                //     if (tokenExpired) {
                //         message.error("Термін дії токену вийшов");
                //     }
                // })
                setReady(true);
            } else {
                setIsLocalStorage(false);
            }
        }
    }, []);

    if (!isLocalStorage || isLoginizationFinished) {
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
        return <Loader />
    }
}

const mapState = state => ({
    isAuthenticated: state.user.isAuthenticated,
    isLoginizationFinished: state.user.isLoginizationFinished,
    role: state.user.role
});
export default connect(mapState, {setStatusMessage, partLogin})(App);

