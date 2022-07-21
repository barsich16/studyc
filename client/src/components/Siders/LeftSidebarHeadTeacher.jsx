import styles from "./LeftSidebar.module.css";
import React, {useEffect, useState} from "react";
import {Menu, Layout} from "antd";
import {
    CalendarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OrderedListOutlined, ScheduleOutlined, SettingOutlined, SolutionOutlined, TableOutlined, TeamOutlined,
    UploadOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../../redux/userReducer";

const {Sider} = Layout;

const SidebarHeadTeacher = ({logout,}) => {
    let [collapsed, setCollapsed] = useState(false);

    const logoutHandler = () => {
        logout();
    };

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className={styles.logo}>Studyc</div>
            <Menu theme="dark" mode="inline">
                {collapsed
                    ? <MenuUnfoldOutlined key='16' className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                    : <MenuFoldOutlined key='15' className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                }
                <Menu.Item key="1" icon={<UserOutlined/>}>
                    <Link to="/">Профіль</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<OrderedListOutlined/>}>
                    <Link to="/school-grade-book">Шкільний журнал</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<OrderedListOutlined/>}>
                    <Link to="/marks">Оцінки</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<SolutionOutlined/>}>
                    <Link to="/employee">Працівники</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<TeamOutlined/>}>
                    <Link to="/myclass">Мій Клас</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<TableOutlined/>}>
                    <Link to="/appointment">Навантаження</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<CalendarOutlined/>}>
                    <Link to="/myschedule">Мій розклад</Link>
                </Menu.Item>
                <Menu.Item key="8" icon={<CalendarOutlined/>}>
                    <Link to="/schoolschedule">Розклад школи</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<ScheduleOutlined/>}>
                    <Link to="/plans">Навчальні плани</Link>
                </Menu.Item>
                <Menu.Item key="10" icon={<SettingOutlined/>}>
                    <Link to="/settings">Налаштування</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="11" icon={<UploadOutlined/>}>
                    <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

const mapState = state => ({
    // subjects: state.teacher.subjects,
})
export const LeftSidebarHeadTeacher = connect(mapState, {logout})(SidebarHeadTeacher)
