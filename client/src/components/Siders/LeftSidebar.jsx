import styles from "./LeftSidebar.module.css";
import React, {useState} from "react";
import {Menu, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../../redux/userReducer";

const {Sider} = Layout;
const { SubMenu } = Menu;
//https://stackoverflow.com/questions/58026188/set-antds-menu-defaultselectedkeys-value-using-react-and-redux
//добавить фокус на поточний menu.item
export const LeftSidebar = () => {
    const dispatch = useDispatch();
    let [collapsed, setCollapsed] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
    }
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className={styles.logo}>Logo</div>
            <Menu  theme="dark" mode="inline">
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
                {}
                <SubMenu key="2" icon={<UserOutlined />} title="Предмети">
                    <Menu.Item key="sub1">
                        <Link to="/development">Математика</Link>
                    </Menu.Item>
                    <Menu.Item key="sub2">
                        <Link to="/development">Історія України</Link>
                    </Menu.Item>
                    <Menu.Item key="sub3">
                        <Link to="/development">Географія</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="3" icon={<UserOutlined/>}>
                    <Link to="/marks">Оцінки</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined/>}>
                    <Link to="/myclass">Мій Клас</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UploadOutlined/>}>
                    <Link to="/development">Розклад</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<UploadOutlined/>}>
                    <Link to="/settings">Налаштування</Link>
                </Menu.Item>
                <Menu.Item onClick={logoutHandler} danger key="7" icon={<UploadOutlined/>}>
                    <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

