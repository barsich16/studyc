import styles from './Dashboard.module.css';
import React, {useState} from "react";
import {Layout, Menu, Calendar, Divider, Avatar, Card} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {RightSidebar} from "../Siders/RightSidebar";

const {SubMenu} = Menu;
const {Header, Sider, Content} = Layout;

export const Dashboard = () => {
    return (
            <Layout className={styles.siteLayout}>
            <Header className={styles.siteLayoutBackground} style={{padding: 0}}>
            </Header>
            <Content
                className={styles.siteLayoutBackground}
                style={{
                    // margin: '24px 16px',
                    // padding: 24,
                    minHeight: 280,
                }}>
                <div className="animwrap">
                    Привіт, Богдан
                    <h1>Що вивчатимемо сьогодні?</h1>
                </div>


                
            </Content>
        </Layout>
    );
}

