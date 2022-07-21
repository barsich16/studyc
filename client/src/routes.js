import {Navigate, Route, Routes} from "react-router-dom";
import {MyClass} from "./components/MyClass/MyClass";
import {MainPage} from "./components/MainPage";
import {Layout} from "antd";
import {LeftSidebar} from "./components/Siders/LeftSidebar";
import {RightSidebar} from "./components/Siders/RightSidebar";
import DashboardContainer from "./components/Dashboard/DashboardContainer";
import {TeacherMarks} from "./components/Marks/TeacherMarks";
import Settings from "./components/Settings/Settings";
import {PupilMarksContainer} from "./components/Marks/PupilMarksTabs"
import {LeftSidebarTeacher} from "./components/Siders/LeftSidebarTeacher";
import {SubjectTeacher} from "./components/Subjects/SubjectsTeacher";
import InDevelopment from "./components/InDevelopment";
import {LeftSidebarAdmin} from "./components/Siders/LeftSidebarAdmin";
import {Employees} from "./components/Employee/Employee";
import {AppointmentTabs} from "./components/Appointment/AppointmentTabs";
import Schedule from "./components/Schedule/Schedule";
import Classes from "./components/Classes/Classes";
import StudyPlans from "./components/StudyPlans/StudyPlans";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {PupilSchedule} from "./components/Schedule/PupilSchedule";
import {LeftSidebarHeadTeacher} from "./components/Siders/LeftSidebarHeadTeacher";
import {SchoolGradeBook} from "./components/Marks/SchoolGradeBook";


export const generateRoutes = (isAuth, role) => {
    console.log("Role: ", role);
    if (isAuth && role === 'pupil') { //role === 1 - pupil
        return (
            <Layout hasSider>
                <LeftSidebar/>
                <Layout style={{minHeight: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<DashboardContainer/>}/>
                        <Route path="/myclass" element={<MyClass/>}/>
                        <Route path="/marks" element={<PupilMarksContainer/>}/>
                        <Route path="/myschedule" element={<PupilSchedule/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/development" element={<InDevelopment/>}/>
                    </Routes>
                </Layout>
                <RightSidebar/>
            </Layout>
        )
    } else if (isAuth && role === 'teacher') { //role === 2 - teacher
        return (
            <Layout hasSider>
                <LeftSidebarTeacher/>
                <Layout style={{minHeight: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<DashboardContainer/>}/>
                        <Route path="/myclass" element={<MyClass/>}/>
                        <Route path="/myschedule" element={<PupilSchedule/>}/>
                        <Route path="/marks" element={<TeacherMarks/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/employee" element={<Employees/>}/>
                        <Route path="/plans" element={<StudyPlans/>}/>
                        <Route path="/subjects/:subjectId" element={<SubjectTeacher/>}/>
                        <Route path="/development" element={<InDevelopment/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>
                <RightSidebar/>
            </Layout>
        )
    } else if (isAuth && role === 'headteacher') { //role === 2 - teacher
        return (
            <Layout hasSider>
                <LeftSidebarHeadTeacher/>
                <Layout style={{minHeight: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<DashboardContainer/>}/>
                        <Route path="/myclass" element={<MyClass/>}/>
                        <Route path="/myschedule" element={<PupilSchedule/>}/>
                        <Route path="/schoolschedule" element={<Schedule/>}/>
                        <Route path="/marks" element={<TeacherMarks/>}/>
                        <Route path="/school-grade-book" element={<SchoolGradeBook />}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/employee" element={<Employees/>}/>
                        <Route path="/subjects/:subjectId" element={<SubjectTeacher/>}/>
                        <Route path="/development" element={<InDevelopment/>}/>
                        <Route path="/plans" element={<StudyPlans/>}/>
                        <Route path="/appointment" element={<AppointmentTabs/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>
                <RightSidebar/>
            </Layout>
        )
    } else if (isAuth && role === 'admin') { //role === admin
        return (
            <Layout style={{minHeight: '100vh'}}>
                <LeftSidebarAdmin/>
                <Layout style={{minHeight: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<DashboardContainer/>}/>
                        <Route path="/employee" element={<Employees/>}/>
                        <Route path="/appointment" element={<AppointmentTabs/>}/>
                        <Route path="/marks" element={<TeacherMarks/>}/>
                        {/*<Route path="/school-grade-book" element={<TeacherMarks/>}/>*/}
                        <Route path="/myschedule" element={<PupilSchedule/>}/>
                        <Route path="/schoolschedule" element={<Schedule/>}/>
                        <Route path="/classes" element={<Classes/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/subjects/:subjectId" element={<SubjectTeacher/>}/>
                        <Route path="/development" element={<InDevelopment/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>
                <RightSidebar/>
            </Layout>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route
                path="*"
                element={<Navigate to="/"/>}
            />
        </Routes>
    )
}
