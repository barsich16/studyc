import React from "react";
import styles from "./Schedule.module.css";
import {Layout, Tabs} from "antd";

import Board from "./src2";
// import Board from "./src";
const {Content} = Layout;
const { TabPane } = Tabs;

const Schedule = () => {

    return (
        <Layout>
            {/*<Header>*/}
            {/*</Header>*/}

            <Content
                className={styles.siteLayoutBackground}
                style={{
                    // margin: '24px 16px',
                    // padding: 24,
                    minHeight: 280,
                }}>
                <div className={styles.tabsContainer}>
                    <Tabs defaultActiveKey="1" tabPosition={'top'} >
                        {[...Array.from({ length: 30 }, (v, i) => i)].map(i => (
                            <TabPane tab={`${i} клас`} key={i} disabled={i === 28}>
                                <Board  />
                            </TabPane>
                        ))}
                    </Tabs>

                </div>
            </Content>
        </Layout>
    );
}

export default Schedule;
