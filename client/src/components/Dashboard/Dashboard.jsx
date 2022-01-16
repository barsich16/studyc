import {Avatar, Card, Layout, Steps} from "antd";
import styles from "./Dashboard.module.css";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {getProfileSelector} from "../../redux/userSelector";
const {Step} = Steps;
const {Meta} = Card;
const {Header, Content} = Layout;

export const Dashboard = ({role}) => {
    const [current, setCurrent] = useState(-1);
    const profile = useSelector(getProfileSelector);
    const onChange = currentStep => {
        setCurrent(currentStep);
    };
    const followLink = () => {
        const link = 'https://us04web.zoom.us/j/79803888099?pwd=M2vFdatul-sqo0E_cFkSSRbxFD3k1m.1'
        window.open(link);
    }

    return (
        <Layout className={styles.siteLayout}>
            <Header className={styles.siteLayoutBackground} style={{padding: 0}}>
            </Header>

            <Content
                className={styles.siteLayoutBackground}
                style={{minHeight: 280,}}>
                <div className="animwrap">
                    Привіт, {profile.name}
                    {role === 1
                        ? <h1>Що вивчатимемо сьогодні?</h1>
                        : <h1>Чого навчатимемо сьогодні?</h1>
                    }

                    <h3>Уроки сьогодні:</h3>
                    {role === 1
                        ? <Steps current={current} onChange={onChange}>
                            <Step title="1 урок" onClick={followLink} description="Математика"/>
                            <Step title="2 урок" onClick={followLink} description="Історія України"/>
                            <Step title="3 урок" onClick={followLink} description="Географія"/>
                            <Step title="4 урок" onClick={followLink} description="Фізкультура"/>
                            <Step title="5 урок" onClick={followLink} description="Англійська мова"/>
                            <Step title="6 урок" onClick={followLink} description="Фізика"/>
                        </Steps>
                        : <Steps current={current} onChange={onChange}>
                            <Step title="5 клас" onClick={followLink} description="Математика"/>
                            <Step title="7 клас" onClick={followLink} description="Алгебра"/>
                            <Step title="3 клас" onClick={followLink} description="Математика"/>
                            <Step title="1 клас" onClick={followLink} description="Математика"/>
                            <Step title="9 клас" onClick={followLink} description="Алгебра"/>
                            <Step title="10 клас" onClick={followLink} description="Геометрія"/>
                        </Steps>}

                    <h2>Останні події:</h2>
                    <div className='cardwrapper'>
                        <Card
                            style={{width: 235}}>
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                title="Математика"
                                description="Додано оцінки за контрольну"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                        <Card
                            style={{width: 235}}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                title="Географія"
                                description="Додано оцінки за домашню роботу"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                        <Card
                            style={{width: 235}}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                title="Економіка"
                                description="Тоже дуже класний предмет"
                            />
                            <button className='btn first'>Перейти</button>
                        </Card>
                    </div>
                </div>
            </Content>
        </Layout>
    )
}
