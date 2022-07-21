import styles from "./TeacherMarks.module.css";
import {Layout, Tabs} from "antd";
import {TableMarks} from "./TableMarks";
import {useSelector} from "react-redux";
import Loader from "../Loader";
import React, {useEffect} from "react";
import {useActions} from "../../hooks/useActions";
import {SubjectTeacher} from "../Subjects/SubjectsTeacher";

const {Header, Content} = Layout;
const {TabPane} = Tabs;

export const TeacherMarks = () => {
    const {getSubjects} = useActions();
    const subjects = useSelector(state => state.teacher.subjects);

    useEffect(() => {
        if (!Array.isArray(subjects)) {
            getSubjects();
        }
    }, []);

    if (!subjects) {
        return <Loader/>
    }

    const tabPanes = subjects.map((item, index) => {
        console.log(item);
        const letter = item.class_letter ? `-${item.class_letter}` : ''; //якщо клас з буквою (напр. 10-А)  то формуємо рядок типу '-А'
        const tabPaneTitle = `${item.class_number}${letter} ${item.name}`;
        return (
            <TabPane tab={tabPaneTitle} key={index}>
                <Tabs defaultActiveKey="0">
                    <TabPane tab="Журнал" key={`register${index}`} className={styles.marksTab}>
                        <TableMarks subjectId={item.id} titleTab={tabPaneTitle} allowEditing={true}/>
                    </TabPane>
                    <TabPane tab="Загальне" key={`general${index}`}>
                        <SubjectTeacher subject={item} />
                    </TabPane>
                </Tabs>
            </TabPane>
        )
    })

    return (
        <>
            <Header/>
            <Content
                style={{minHeight: 280}}>
                <div className={styles.tabsContainer}>
                    <Tabs defaultActiveKey="0">
                        {tabPanes}
                    </Tabs>
                </div>
            </Content>
        </>
    );
}
