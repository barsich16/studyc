import styles from "./LeftSidebar.module.css";
import React, {useState} from "react";
import {Menu, Layout} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, OrderedListOutlined, SettingOutlined, TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../../redux/userReducer";

const {Sider} = Layout;
export const LeftSidebar = () => {
    const dispatch = useDispatch();
    let [collapsed, setCollapsed] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
    }
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
        >
            <div className={styles.logo}>Studyc</div>
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
                <Menu.Item key="2" icon={<OrderedListOutlined />}>
                    <Link to="/marks">Предмети</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<TeamOutlined />}>
                    <Link to="/myclass">Мій Клас</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<CalendarOutlined />}>
                    <Link to="/myschedule">Розклад</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<SettingOutlined />}>
                    <Link to="/settings">Налаштування</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="6" icon={<ArrowLeftOutlined />}>
                    <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
