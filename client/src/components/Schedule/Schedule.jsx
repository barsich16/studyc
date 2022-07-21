import React, {useEffect} from "react";
import styles from "./Schedule.module.css";
import {Layout, Tabs} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getClasses} from "../../redux/adminReducer";
import Loader from "../Loader";
import {BoardContainer} from "./src2/BoardContainer";
const {Content} = Layout;
const { TabPane } = Tabs;

const Schedule = () => {
    const dispatch = useDispatch();
    const allClasses = useSelector(state => state.admin.classes);

    useEffect(() => {
        if(!allClasses) {
            dispatch(getClasses());
        }
    }, []);

    if (!allClasses) {
        return <Loader />
    }

    const classesGroup = {};
    for (const classItem of allClasses) {
        if (Object.keys(classesGroup).includes(classItem.number+'')) {
            classesGroup[classItem.number] = [...classesGroup[classItem.number], classItem];
        } else {
            classesGroup[+classItem.number] = [classItem];
        }
    }

    return (
        <Layout>
            <Content
                style={{minHeight: 280}}>
                <div className={styles.tabsContainer}>
                    <Tabs defaultActiveKey="0" tabPosition={'top'} >
                        {Object.keys(classesGroup).map((item, index) => (
                            <TabPane tab={`${item} клас`} key={index} >
                                {classesGroup[item].length > 1
                                    ? <Tabs defaultActiveKey="0" tabPosition={'top'} >
                                        {classesGroup[item].map(classItem => {
                                            const letter = classItem.letter ? `-${classItem.letter}` : '';
                                            return(
                                                <TabPane tab={`${classItem.number}${letter} клас`} key={classItem.key} >
                                                    <BoardContainer classId={classItem.key} />
                                                </TabPane>
                                            )
                                        })}
                                        )}
                                      </Tabs>
                                    : <BoardContainer classId={classesGroup[item][0].key}/>
                                }
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </Content>
        </Layout>
    );
}
export default Schedule;
