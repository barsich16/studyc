import styles from "./TeacherMarks.module.css";
import {Layout, Tabs} from "antd";
import {TableMarks} from "./TableMarks";
import {getMarks, updateMarks} from "../../redux/teacherReducer";
import {connect} from "react-redux";
import Loader from "../Loader";
import React, {useEffect} from "react";
const {Header, Content} = Layout;
const {TabPane} = Tabs;

const TeacherMarks = ({globalMarksArray, getMarks, updateMarks, statusMessage}) => {
    function callback(key) {
        console.log(key);
    }
    useEffect(() => {
        getMarks();
    }, [])

    if (!globalMarksArray) {
        return <Layout>
            <Loader />
        </Layout>
    } else {
        const keysArray = Object.keys(globalMarksArray);
        console.log(keysArray);
        const tabPanes = keysArray.map((item, index) =>
            <TabPane tab={item} key={index}>
                <TableMarks dataClass={globalMarksArray[item]}
                            dataClassName={item} updateMarks={updateMarks}
                            statusMessage={statusMessage}
                />
            </TabPane>
        )
        return (
            <Layout>
                <Header style={{}}>
                    Мій 10 клас
                </Header>
                <Content
                    className={styles.siteLayoutBackground}
                    style={{minHeight: 280}}>
                    <div className={styles.tabsContainer}>
                        <Tabs defaultActiveKey="0" onChange={callback}>
                            {tabPanes}
                        </Tabs>
                    </div>
                </Content>
            </Layout>
        );
    }
}
const mapState = state => ({
    globalMarksArray: state.teacher.marks,
    statusMessage: state.teacher.statusMessage
})
export default connect(mapState, {getMarks, updateMarks})(TeacherMarks)

