import {useDispatch, useSelector} from "react-redux";
import {Layout, Tabs} from "antd";
import Loader from "../Loader";
import styles from "./TeacherMarks.module.css";
import React, {useEffect} from "react";
import {PupilMarks} from "./PupilMarks";
import {getAllMarks} from "../../redux/userReducer";

const {TabPane} = Tabs;
const {Header, Content} = Layout;

export const PupilMarksTabs = ({pupilId}) => {
    const marks = useSelector(state => state.user.marks.find(item => item.pupilId === pupilId));
    const dispatch = useDispatch();

    useEffect(() => {
        if (!marks) {
            dispatch(getAllMarks(pupilId));
        }
    }, [marks]);

    if (!marks) {
        return <Layout>
            <Loader/>
        </Layout>
    } else {
        const tabPanes = marks.subjects.map(item =>
            <TabPane tab={item.name} key={item.id}>
                <PupilMarks pupilId={pupilId} subjectId={item.id}/>
            </TabPane>
        );

        return (
            <Tabs defaultActiveKey="0">
                {tabPanes}
            </Tabs>
        );
    }
}

export const PupilMarksContainer = () => {
    const pupilId = useSelector(state => state.user.userId);

    return <>
        <Header/>
        <Content
            className={styles.siteLayoutBackground}
            style={{minHeight: 280}}>
            <div className={styles.tabsContainer}>
                <PupilMarksTabs pupilId={pupilId}/>
            </div>
        </Content>
    </>
}
