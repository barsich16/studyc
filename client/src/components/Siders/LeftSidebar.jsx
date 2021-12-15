import styles from "./LeftSidebar.module.css";
import React, {useState, useContext} from "react";
import {Menu, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";

const {Sider} = Layout;
const { SubMenu } = Menu;
//https://stackoverflow.com/questions/58026188/set-antds-menu-defaultselectedkeys-value-using-react-and-redux
//добавить фокус на поточний menu.item
export const LeftSidebar = () => {
    const auth = useContext(AuthContext);
    let [collapsed, setCollapsed] = useState(false);

    const logoutHandler = () => {
        auth.logout();
    }

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className={styles.logo}/>
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
                <SubMenu key="2" icon={<UserOutlined />} title="Предмети">
                    <Menu.Item key="sub1">Математика</Menu.Item>
                    <Menu.Item key="sub2">Історія України</Menu.Item>
                    <Menu.Item key="sub3">Географія</Menu.Item>
                    <Menu.Item key="sub4">Українська мова</Menu.Item>
                </SubMenu>
                <Menu.Item key="3" icon={<UserOutlined/>}>
                    Оцінки
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined/>}>
                    <Link to="/myclass">Мій Клас</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UploadOutlined/>}>
                    Розклад
                </Menu.Item>
                <Menu.Item key="6" icon={<UploadOutlined/>}>
                    Чат
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="7" icon={<UploadOutlined/>}>
                    Вихід
                </Menu.Item>
            </Menu>

        </Sider>
    );
}

