import React from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';
import {Button} from "antd";
import deleteSign from './icon.png'
import styles from "../Schedule.module.css";

export const LessonContainer = styled.div`
    border-bottom: 1px solid lightgrey;
    :last-child { //проти подвійної лінії на останньому уроці
        margin-bottom: -1px;
    }
    border-radius: 2px;
    padding: 12px 12px 8px 3px;
    display: flex;
    align-items: center;
    background-color: ${props =>
          props.isDragDisabled
                  ? 'lightgrey'
                  : props.isDragging
                  ? 'lightgreen'
                  : 'transparent'};
`;
const MainContainer = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    width: 19%;
    background-color: ${props =>
          props.isDragDisabled
                  ? 'lightgrey'
                  : props.isDragging
                  ? 'lightgreen'
                  : 'transparent'};
`;

export const WindowContainer = styled.div`
    font-size: 13px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    width: 100%;
`;

export const Cabinet = styled.div`
    font-size: 13px;
    color: #042d53;
`;

export const TeacherContainer = styled.div`
    font-size: 13px;
    color: rgba(9, 30, 66, 0.75);
`;

export const SubjectContainer = styled.div`
    display: inline-block;
    padding: 0 10px;
    border-radius: 3px;
    border: 1px solid #030303;
    font-size: 14px;
    color: #062440;
    margin-bottom: 4px;
`;

export default class Task extends React.Component {
    render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                subjectID={this.props.task.id}
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <LessonContainer
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        <div style={{marginRight: 5}}>{this.props.index + 1}</div>
                        <div className={styles.lessonInfo}>
                            {this.props.task.window
                                ? <WindowContainer>
                                    <Button type='link' style={{padding: 0}}
                                            onClick={() => this.props.deleteElement(this.props.column, this.props.index)}>
                                        <img src={deleteSign}/>
                                    </Button>
                                </WindowContainer>
                                : <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}>
                                        <SubjectContainer>{this.props.task.content}</SubjectContainer>
                                        <Button type='link' style={{padding: 0}}
                                                onClick={() => this.props.deleteElement(this.props.column, this.props.index)}>
                                            <img src={deleteSign}/>
                                        </Button>
                                    </div>

                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <TeacherContainer>{this.props.task.teacher}</TeacherContainer>
                                        <Cabinet>Каб. {this.props.task.cabinet}</Cabinet>
                                    </div>
                                </>
                            }
                        </div>
                    </LessonContainer>
                )}
            </Draggable>
        );
    }
}

export class MainTask extends React.Component {
    render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                subjectID={this.props.task.id}
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <MainContainer
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        {this.props.task.window
                            ? <WindowContainer><span></span></WindowContainer>
                            : <>
                                <SubjectContainer>{this.props.task.content}</SubjectContainer>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <TeacherContainer>{this.props.task.teacher}</TeacherContainer>
                                    <Cabinet>Каб. {this.props.task.cabinet}</Cabinet>
                                </div>
                            </>
                        }
                    </MainContainer>
                )}
            </Draggable>
        );
    }
}
