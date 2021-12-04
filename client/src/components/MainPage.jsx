import styles from './MainPage.module.css';
import React, {useState} from "react";
import {Layout, Menu} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;
const {Header, Sider, Content} = Layout;
const MainPage = () => {
    let [collapsed, setCollapsed] = useState(false);
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={styles.logo}/>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined/>}>
                        Профіль
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
                    <Menu.Item key="4" icon={<UploadOutlined/>}>
                        Розклад
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UploadOutlined/>}>
                        Чат
                    </Menu.Item>
                    <Menu.Item danger key="6" icon={<UploadOutlined/>}>
                        Вихід
                    </Menu.Item>
                </Menu>
                {collapsed
                    ? <MenuUnfoldOutlined className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                    : <MenuFoldOutlined className={styles.trigger} onClick={() => {
                        setCollapsed(!collapsed)
                    }}/>
                }
            </Sider>
            <Layout className={styles.siteLayout}>
                <Header className={styles.siteLayoutBackground} style={{padding: 0}}>

                </Header>
                <Content
                    className={styles.siteLayoutBackground}
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
}

export default MainPage;
