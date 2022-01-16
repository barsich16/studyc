import {Navigate, Route, Routes} from "react-router-dom";
import MyClass from "./components/MyClass/MyClass";
import {MainPage} from "./components/MainPage";
import {Layout} from "antd";
import {LeftSidebar} from "./components/Siders/LeftSidebar";
import {RightSidebar} from "./components/Siders/RightSidebar";
import DashboardContainer from "./components/Dashboard/DashboardContainer";
import TeacherMarks from "./components/Marks/TeacherMarks";
import Settings from "./components/Settings/Settings";
import PupilMarks from "./components/Marks/PupilMarks";
import {LeftSidebarTeacher} from "./components/Siders/LeftSidebarTeacher";
import {SubjectTeacher} from "./components/Subjects/SubjectsTeacher";


export const generateRoutes = (isAuth, role) => {
    console.log("Role: ", role);
    if (isAuth && role === 1) { //role === 1 - pupil
        return (
            <Layout style={{minHeight: '100vh'}}>
                <LeftSidebar />
                <Routes>
                    <Route path="/" element={<DashboardContainer />}/>
                    <Route path="/myclass" element={<MyClass/>}/>
                    <Route path="/marks" element={<PupilMarks />}/>
                    <Route path="/settings" element={<Settings />}/>

                </Routes>
                <RightSidebar />
            </Layout>
        )
    } else if (isAuth && role === 2) { //role === 2 - teacher
        return (
            <Layout style={{minHeight: '100vh'}}>
                <LeftSidebarTeacher />
                <Routes>
                    <Route path="/" element={<DashboardContainer />}/>
                    <Route path="/myclass" element={<MyClass/>}/>
                    <Route path="/marks" element={<TeacherMarks />}/>
                    <Route path="/settings" element={<Settings />}/>
                    <Route path="/subjects/:subjectId" element={<SubjectTeacher />}/>

                    <Route path="*" element={<Navigate to="/" />}/>
                </Routes>
                <RightSidebar />
            </Layout>
        )
    }
    return  (
        <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    )
}
