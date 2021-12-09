import styles from './Dashboard.module.css';
import React, {useState} from "react";
import {Layout, Menu, Calendar, Divider, Avatar, Card, Button, Steps} from 'antd';

const { Step } = Steps;
const { Meta } = Card;
const {SubMenu} = Menu;
const {Header, Sider, Content} = Layout;

export const Dashboard = () => {
    let [current, setCurrent] = useState(-1);
    const onChange = currentStep => {
        console.log('onChange:', current);
        setCurrent(currentStep);
    };
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
                    <h3>Уроки сьогодні:</h3>
                    <Steps current={current} onChange={onChange}>
                        <Step title="1 урок" description="Математика" />
                        <Step title="2 урок" description="Історія України" />
                        <Step title="3 урок" description="Географія" />
                        <Step title="4 урок" description="Фізкультура" />
                        <Step title="5 урок" description="Англійська мова" />
                        <Step title="6 урок" description="Фізика" />
                    </Steps>
                    <h2>Останні події:</h2>
                    <div className='cardwrapper'>
                        <Card
                            style={{ width: 235  }}
                            >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Математика"
                                description="Додано оцінки за контрольну"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                        <Card
                            style={{ width: 235  }}
                            >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Географія"
                                description="Додано оцінки за домашню роботу"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                        <Card
                            style={{ width: 235  }}
                            >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title="Економіка"
                                description="Тоже дуже класний предмет"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                    </div>
                </div>



                
            </Content>
        </Layout>
    );
}

