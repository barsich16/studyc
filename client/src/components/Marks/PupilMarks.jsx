import {connect} from "react-redux";
import {Layout, Tabs} from "antd";
import Loader from "../Loader";
import styles from "./TeacherMarks.module.css";
import React, {useEffect} from "react";
import {TablePupilMarks} from "./TablePupilMarks";
import {getMarks} from "../../redux/userReducer";
const {TabPane} = Tabs;
const {Header, Content} = Layout;

const PupilMarks = ({marks, getMarks}) => {

    useEffect(() => {
        getMarks();
    }, [])

    if (!marks) {
        return <Layout>
            <Loader />
        </Layout>
    } else {
        const keysArray = Object.keys(marks);
        const tabPanes = keysArray.map((item, index) =>
            <TabPane tab={item} key={index}>
                <TablePupilMarks data={marks[item]} />
            </TabPane>
        );

        return (
            <Layout>
                <Header style={{}}>
                    Мій 10 клас
                </Header>
                <Content
                    className={styles.siteLayoutBackground}
                    style={{minHeight: 280}}>
                    <div className={styles.tabsContainer}>
                        <Tabs defaultActiveKey="0">
                            {tabPanes}
                        </Tabs>
                    </div>
                </Content>
            </Layout>
        );
    }
}

const mapState = state => ({
    marks: state.user.marks,
})

export default connect(mapState, {getMarks})(PupilMarks);
