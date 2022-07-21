import styles from "./Schedule.module.css";
import {Layout} from "antd";
import React, {useEffect} from "react";
import {ScheduleContainer} from "./src2";
import {useDispatch, useSelector} from "react-redux";
import {getMySchedule, getSchedule} from "../../redux/userReducer";
import {Weekday} from "./Weekday"
import Loader from "../Loader";
const {Content, Header} = Layout;

export const PupilSchedule = () => {

    const dispatch = useDispatch();
    const schedule = useSelector(state => state.user.schedule.find(item => item.userId === state.user.userId));
    const weekdays = useSelector(state => state.user.weekdays);

    useEffect(() => {
        if (!schedule) {
            dispatch(getMySchedule());
        }
    });

    if (!schedule || !weekdays) {
        return <Loader />;
    }

    const studyDays = {};
    weekdays.forEach(item => {
        studyDays[item.id] = {
            day: item.day,
            lessons: schedule.currentSchedule[item.id]
                .map(subjectId => {
                    return subjectId ? schedule.subjects.find(subject => subject.id === subjectId) : subjectId
                })}
    })

    return (
        <Layout>
            <Header />
            <Content
                className={styles.siteLayoutBackground}
                style={{minHeight: 280, padding: 20}}>
                <ScheduleContainer>
                    {weekdays.map(weekday => <Weekday data={studyDays[weekday.id]}/>)}
                </ScheduleContainer>
            </Content>
        </Layout>
    );
}
