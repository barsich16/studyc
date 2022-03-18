import styles from "./LeftSidebar.module.css";
import React, {useEffect, useState} from "react";
import {Menu, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../../redux/userReducer";
import {getSubjects} from "../../redux/teacherReducer";
import Loader from "../Loader";

const {Sider} = Layout;
const { SubMenu } = Menu;
//https://stackoverflow.com/questions/58026188/set-antds-menu-defaultselectedkeys-value-using-react-and-redux
//добавить фокус на поточний menu.item
const SidebarTeacher = ({logout, getSubjects, subjects}) => {
    let [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        console.log(subjects);
        if (!subjects) {
            getSubjects()
        }
    }, []);

    const logoutHandler = () => {
        logout();
    };

    if(!subjects) {
        return <Loader />
    } else {
        const subjectItems = subjects.map((item, index) => {
            const letter = item.class_letter ? `-${item.class_letter}` : '';
            const title = `${item.class_name}${letter} ${item.name}`;
            return <Menu.Item key={`sub ${index}`}>
                <Link to={`/subjects/${item.id}`}>{title}</Link>
            </Menu.Item>
        });
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
                        {subjectItems}
                        {/*<Menu.Item key="sub1">*/}
                        {/*    <Link to="/settings">Математика</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="sub2">*/}
                        {/*    <Link to="/settings">Історія України</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="sub3">*/}
                        {/*    <Link to="/settings">Географія</Link>*/}
                        {/*</Menu.Item>*/}
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
                    <Menu.Item key="7" icon={<UserOutlined/>}>
                        <Link to="/employee">Працівники</Link>
                    </Menu.Item>
                    <Menu.Item key="8" icon={<UserOutlined/>}>
                        <Link to="/plans">Навчальні плани</Link>
                    </Menu.Item>
                    <Menu.Item onClick={logoutHandler} danger key="9" icon={<UploadOutlined/>}>
                        <Link style={{color: '#ff4d4f'}} to="/">Вихід</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }

}

const mapState = state => ({
    subjects: state.teacher.subjects,
})
export const LeftSidebarTeacher = connect(mapState, {logout, getSubjects})(SidebarTeacher)

