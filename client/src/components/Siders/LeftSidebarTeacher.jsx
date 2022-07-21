import styles from "./LeftSidebar.module.css";
import React, {useState} from "react";
import {Menu, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../../redux/userReducer";

const {Sider} = Layout;

export const LeftSidebarTeacher = () => {
    let [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
        >
            <div className={styles.logo}>Logo</div>
            <Menu theme="dark" mode="inline">
                {collapsed
                    ? <MenuUnfoldOutlined className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                    : <MenuFoldOutlined className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                }
                <Menu.Item key="1" icon={<UserOutlined/>}>
                    <Link to="/">Профіль</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined/>}>
                    <Link to="/marks">Оцінки</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined/>}>
                    <Link to="/myclass">Мій Клас</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UploadOutlined/>}>
                    <Link to="/myschedule">Розклад</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UploadOutlined/>}>
                    <Link to="/settings">Налаштування</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<UserOutlined/>}>
                    <Link to="/employee">Працівники</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<UserOutlined/>}>
                    <Link to="/plans">Навчальні плани</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="8" icon={<UploadOutlined/>}>
                    <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
