import styles from "./RightSidebar.module.css";
import {Avatar, Calendar, Card, Layout} from "antd";
import React, {useState} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

const {Sider} = Layout;

function onPanelChange(value, mode) {
    console.log(value, mode);
}

export const RightSidebar = () => {
    //let [collapsed, setCollapsed] = useState(false);
    // якщо робити collaps то в sider добавить collapsible collapsed={collapsed}
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
                <Card style={{ width: 300, marginTop: 0 }}>
                    <Card.Meta
                        avatar={<Avatar shape="square" size={47} src="https://joeschmoe.io/api/v1/random" />}
                        title="Some new event"
                        description="This is the description"
                    />
                </Card>
            </div>
        </Sider>
    );
}
