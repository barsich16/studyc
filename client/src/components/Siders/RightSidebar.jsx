import styles from "./RightSidebar.module.css";
import {Avatar, Calendar, Card, Layout} from "antd";
import React from "react";
import {Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {getClassTeacherSelector, getProfileSelector} from "../../redux/userSelector";

const {Sider} = Layout;
export const RightSidebar = () => {
    const profile = useSelector(getProfileSelector);
    return (
        <Routes>
            <Route path="/" element={<SidebarDashboard profile={profile}/>}/>
            <Route path="/settings" element={<SidebarDashboard profile={profile}/>}/>
            <Route path="/myclass" element={<SidebarClass profile={profile}/>}/>
        </Routes>
    )
}

const SidebarDashboard = ({profile}) => {
    const name = profile ? `${profile.name} ${profile.surname}` : '';
    return (
        <Sider trigger={null} theme="light" width="300px" className={styles.rightSider}>
            <div className={styles.authProfile}>
                <Avatar size={35} src="https://joeschmoe.io/api/v1/random"/>
                <span className={styles.name}>{`${name}`}</span>
            </div>
            <div className={styles.wrapper}>
                <Calendar fullscreen={false}/>
            </div>
        </Sider>
    )
}

const SidebarClass = ({profile}) => {
    const classTeacher = useSelector(getClassTeacherSelector);
    const dataSource = classTeacher ? classTeacher : profile;
    const teacherData = {
        name: `${dataSource.surname} ${dataSource.name} ${dataSource.patronymic}`,
        phone: `+${dataSource.phone}`,
        birthdate: new Date(dataSource.birthdate).toLocaleDateString("sq-AL", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
        email: dataSource.email,
    }

    return (
        <Sider trigger={null}
               theme="light"
               width={"300px"}
               className={styles.rightSider}>

            <div className={styles.authProfile}>
                <Avatar size={35} src="https://joeschmoe.io/api/v1/random"/>
                <span className={styles.name}>{`${profile.name} ${profile.surname}`}</span>
            </div>

            <div className={styles.eventCard}>
                <Avatar size={120} src="https://joeschmoe.io/api/v1/jess"/>
                <span className={styles.teacherName}>{teacherData.name}</span>
                <span className={styles.classTeacher}>Класний керівник</span>
                <div className={styles.info}>
                    <div className={styles.about}>
                        <span>Мобільний телефон</span>
                        <p>{teacherData.phone}</p>
                    </div>
                    <div className={styles.about}>
                        <span>Email</span>
                        <p>{teacherData.email}</p>
                    </div>
                    <div className={styles.about}>
                        <span>День народження</span>
                        <p>{teacherData.birthdate}</p>
                    </div>
                </div>
            </div>
        </Sider>
    )
}
