import {ColumnContainer, TaskList, Title} from "./src2/column";
import React from "react";
import {Lesson} from "./Lesson";
export const Weekday = ({data}) => {
    return (
        <ColumnContainer>
            <Title>{data.day}</Title>
            <TaskList>
                {data.lessons.map((lesson, index) => <Lesson lesson={lesson} index={index + 1}/>)}
            </TaskList>
        </ColumnContainer>
    );
}
