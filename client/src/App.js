import {BrowserRouter} from "react-router-dom";
import {useAuth} from "./hooks/auth.hook";
import {useRoutes} from "./routes";
import './App.css';
import 'antd/dist/antd.css';
import {AuthContext} from "./Context/AuthContext";

function App() {
    const {login, logout, token, userId} = useAuth();
    console.log("TOKEN: ", !!token);
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);
    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated
        }}>
            <BrowserRouter>
                <div className="App">
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>


    );
}

export default App;
