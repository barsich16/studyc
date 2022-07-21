import styles from "./LeftSidebar.module.css";
import React, {useState} from "react";
import {Menu, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../../redux/userReducer";

const {Sider} = Layout;

const SidebarTeacher = ({logout,}) => {
    let [collapsed, setCollapsed] = useState(false);

    const logoutHandler = () => {
        logout();
    };

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className={styles.logo}>Logo</div>
            <Menu theme="dark" mode="inline">
                {collapsed
                    ? <MenuUnfoldOutlined key='15' className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                    : <MenuFoldOutlined key='16' className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                }
                <Menu.Item key="1" icon={<UserOutlined/>}>
                    <Link to="/">Профіль</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined/>}>
                    <Link to="/marks">Оцінки</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined/>}>
                    <Link to="/employee">Працівники</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UserOutlined/>}>
                    <Link to="/classes">Класи</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<UserOutlined/>}>
                    <Link to="/appointment">Навантаження</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<UploadOutlined/>}>
                    <Link to="/myschedule">Мій розклад</Link>
                </Menu.Item>
                <Menu.Item key="8" icon={<UploadOutlined/>}>
                    <Link to="/schoolschedule">Розклад школи</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<UploadOutlined/>}>
                    <Link to="/settings">Налаштування</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="10" icon={<UploadOutlined/>}>
                    <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

const mapState = state => ({
    // subjects: state.teacher.subjects,
})
export const LeftSidebarAdmin = connect(mapState, {logout})(SidebarTeacher)
