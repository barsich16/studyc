import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./components/Dashboard/Dashboard";
import MyClass from "./components/MyClass/MyClass";
import {MainPage} from "./components/MainPage";
import {LoginPage} from "./components/LoginPage/LoginPage";
import {Layout} from "antd";
import {LeftSidebar} from "./components/Siders/LeftSidebar";
import {RightSidebar} from "./components/Siders/RightSidebar";


export const useRoutes = isAuth => {
    if (isAuth) {
        return (
            <Layout>
                <LeftSidebar />
                <Routes>
                    <Route path="/" element={<Dashboard />}/>
                    <Route path="/myclass" element={<MyClass/>}/>
                </Routes>
                <RightSidebar />
            </Layout>
        )
    }
    return  (
        <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/login" element={<LoginPage />}/>
        </Routes>
    )
}
