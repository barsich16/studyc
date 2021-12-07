import styles from "./RightSidebar.module.css";
import {Avatar, Calendar, Card, Layout} from "antd";
import React, {useState} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {LeftSidebar} from "./LeftSidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "../Dashboard/Dashboard";
import MyClass from "../MyClass/MyClass";

const {Sider} = Layout;

function onPanelChange(value, mode) {
    console.log(value, mode);
}

export const RightSidebar = () => {
    //let [collapsed, setCollapsed] = useState(false);
    // якщо робити collaps то в sider добавить collapsible collapsed={collapsed}
    return (
        <Routes>
            <Route path="/" element={<SidebarDashboard/>}/>
            <Route path="/myclass" element={<SidebarClass />}/>
        </Routes>
    )
}

const SidebarDashboard = () => {
    return (
        <Sider trigger={null}  theme="light" width="295px" className={styles.rightSider}>
            <div className={styles.authProfile}>
                {/*{collapsed*/}
                {/*    ? <MenuUnfoldOutlined className={styles.trigger} onClick={() => {*/}
                {/*        setCollapsed(!collapsed)*/}
                {/*    }}/>*/}
                {/*    : <MenuFoldOutlined className={styles.trigger} onClick={() => {*/}
                {/*        setCollapsed(!collapsed)*/}
                {/*    }}/>*/}
                {/*}*/}
                <Avatar size={35} src="https://joeschmoe.io/api/v1/random" />
                <span className={styles.name}>Bohdan Borysenko</span>
            </div>
            <div className={styles.wrapper}>
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
            </div>
            <div className={styles.eventCards}>
                <Card style={{ width: 300, marginTop: 0}}>
                    <Card.Meta
                        avatar={<Avatar shape="square" size={47} src="https://joeschmoe.io/api/v1/random" />}
                        title="Some new event"
                        description="This is the description"
                    />
                </Card>
                <Card style={{ width: 300, marginTop: 0 }}>
                    <Card.Meta
                        avatar={<Avatar shape="square" size={47} src="https://joeschmoe.io/api/v1/random" />}
                        title="Some new event"
                        description="This is the description"
                    />
                </Card>
                <Card style={{ width: 300, marginTop: 0 }}>
                    <Card.Meta
                        avatar={<Avatar shape="square" size={47} src="https://joeschmoe.io/api/v1/random" />}
                        title="Some new event"
                        description="This is the description"
                    />
                </Card>
            </div>
        </Sider>
    )
}

const SidebarClass = () => {
    return (
        <Sider trigger={null}  theme="light" width="295px" className={styles.rightSider}>
            <div className={styles.authProfile}>
                {/*{collapsed*/}
                {/*    ? <MenuUnfoldOutlined className={styles.trigger} onClick={() => {*/}
                {/*        setCollapsed(!collapsed)*/}
                {/*    }}/>*/}
                {/*    : <MenuFoldOutlined className={styles.trigger} onClick={() => {*/}
                {/*        setCollapsed(!collapsed)*/}
                {/*    }}/>*/}
                {/*}*/}
                <Avatar size={35} src="https://joeschmoe.io/api/v1/random" />
                <span className={styles.name}>Bohdan Borysenko</span>
            </div>
            <div className={styles.eventCard}>
                <Avatar size={120} src="https://joeschmoe.io/api/v1/random" />
                <span className={styles.teacherName}>Teacher Name</span>
                <span className={styles.classTeacher}>Класний керівник</span>
                <div className={styles.info}>
                    <div className={styles.about}>
                        <span>Інформація</span>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem distinctio, libero magni nulla officiis ut velit. Excepturi incidunt maxime natus!</p>
                    </div>
                    <div className={styles.about}>
                        <span>Мобільний телефон</span>
                        <p>+38 (099) 99 99</p>
                    </div>
                    <div className={styles.about}>
                        <span>Email</span>
                        <p>teacher@gmail.com</p>
                    </div>
                </div>
            </div>
        </Sider>
    )
}
