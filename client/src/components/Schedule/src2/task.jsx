import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-top: 0;
  border-radius: 2px;
  padding: 8px 8px 8px 3px;
  display: flex;
  align-items: center;
  //margin-left: -10px;
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
const TeacherContainer = styled.div`
  //display: inline-block;
  font-size: 13px;
  //color: #1890ff;
  color: rgba(9, 30, 66, 0.75);
  //background-color: rgb(227, 252, 239);
`;
const SubjectContainer = styled.div`
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
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        <div style={{marginRight: 5}}>{this.props.index+1}</div>
                        <div>
                            <SubjectContainer>{this.props.task.content}</SubjectContainer>

                            <TeacherContainer>{this.props.task.teacher}</TeacherContainer>
                        </div>

                    </Container>
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
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <MainContainer
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        <SubjectContainer>{this.props.task.content}</SubjectContainer>
                        <TeacherContainer>{this.props.task.teacher}</TeacherContainer>
                    </MainContainer>
                )}
            </Draggable>
        );
    }
}
