import styles from "./TeacherMarks.module.css";
import {Layout, Tabs, Select, Button} from "antd";
import {TableMarks} from "./TableMarks";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../Loader";
import React, {useEffect, useState} from "react";
import {getAllClassSubjects, getClasses, getClassMarks, moveToNextYear} from "../../redux/adminReducer";

const {Content} = Layout;
const {TabPane} = Tabs;

export const SchoolGradeBook = () => {
    const dispatch = useDispatch();
    const allClasses = useSelector(state => state.admin.classes);

    useEffect(() => {
        if (!allClasses) {
            dispatch(getClasses());
        }
    }, []);

    if (!allClasses) {
        return <Loader/>
    }

    const classesGroup = {};
    for (const classItem of allClasses.filter(item => item.creation_year)) {
        if (Object.keys(classesGroup).includes(classItem.number + '')) {
            classesGroup[classItem.number] = [...classesGroup[classItem.number], classItem];
        } else {
            classesGroup[+classItem.number] = [classItem];
        }
    }
    const changeYear = withSubjects => {
        dispatch(moveToNextYear(withSubjects));
    }

    return (
        <Content
            className={styles.siteLayoutBackground}
            style={{minHeight: 280}}>

            <div style={{padding: '20px 20px', position: 'relative'}}>
                <Button onClick={() => changeYear(true)} style={{ position: 'absolute', right: 0, zIndex: 1 }}>
                    Перейти до наступного навчального року
                </Button>
                <Tabs defaultActiveKey="0" tabPosition={'top'}>
                    {Object.keys(classesGroup).map((item, index) => (
                        <TabPane tab={`${item} клас`} key={index} >
                            {classesGroup[item].length > 1
                                ? <Tabs defaultActiveKey="0" tabPosition={'top'}>
                                    {classesGroup[item].map(classItem => {
                                        const letter = classItem.letter ? `-${classItem.letter}` : '';
                                        return (
                                            <TabPane tab={`${classItem.number}${letter} клас`} key={classItem.key}>
                                                {classItem.study_years.length > 0 && <AllClassSubjects classId={classItem.key} studyYears={classItem.study_years}/>}
                                            </TabPane>
                                        )
                                    })}
                                    )}
                                </Tabs>
                                : classesGroup[item][0].study_years.length > 0 && <AllClassSubjects classId={classesGroup[item][0].key} studyYears={classesGroup[item][0].study_years}/>
                            }
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        </Content>
    )
}

const AllClassSubjects = ({classId, studyYears}) => {   //tab з назвами предметів
    const dispatch = useDispatch();

    const [year, setYear] = useState(studyYears[studyYears.length - 1]);
    const classInfo = useSelector(state => state.admin.gradeBook.find(item => item.classId === classId && item.year === year));

    useEffect(() => {
        if (!classInfo) {
            dispatch(getAllClassSubjects(classId, year));
        }
    }, [year]);

    if (!classInfo) {
        return <Loader/>
    }
    const tabPanes = classInfo.subjects.map((item) => {
        return (
            <TabPane tab={item.name} key={item.id} className={styles.marksTab}>
                        <TableMarksContainer
                            classId={classId}
                            year={year}
                            subjectId={item.id}
                            />
            </TabPane>
        )
    });

    const yearsOptions = studyYears.map(item => <Select.Option key={item} value={item}>{item}</Select.Option>);

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'end', position: 'relative'}}>
                <Select value={year} onChange={value => setYear(value)} style={{position: 'absolute', zIndex: 10}}>
                    {yearsOptions}
                </Select>
            </div>

            <Tabs defaultActiveKey="0">
                {tabPanes}
            </Tabs>
        </>
    )
}

const TableMarksContainer = ({subjectId, classId, year}) => { //tab з таблицею оцінок
    const dispatch = useDispatch();
    const subjects = useSelector(state => state.admin.gradeBook.find(item => item.classId === classId && item.year === year));
    const marks = subjects.subjects.find(item => item.id === subjectId);

    useEffect(() => {
        if (!marks) {
            dispatch(getClassMarks(classId, year, subjectId));
        }
    }, []);

    if (!marks) {
        return <Loader/>
    }

    return <TableMarks subjectId={marks.id} titleTab={marks.name} allowEditing={false}/>
}
