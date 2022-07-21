import {Cabinet, LessonContainer, SubjectContainer, TeacherContainer, WindowContainer} from "./src2/task";
import React from "react";
import styles from "./Schedule.module.css"

export const Lesson = ({lesson, index}) => {
    return (
        <LessonContainer>
            <div style={{marginRight: 5}}>{index}</div>
            <div className={styles.lessonInfo}>
                {!lesson
                    ? <WindowContainer/>
                    : <>
                        <SubjectContainer>{lesson.name}</SubjectContainer>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <TeacherContainer>{lesson.variable}</TeacherContainer>
                            <Cabinet>Каб. {lesson.cabinet}</Cabinet>
                        </div>
                      </>
                }
            </div>
        </LessonContainer>
    );
}
