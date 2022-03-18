import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';
import {MainTask} from "./task";

const Container = styled.div`
  //margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 19.5%;

  display: flex;
  flex-direction: column;
`;
const MainContainer = styled.div`
  margin-top: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  //width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 3px 8px;
  margin-bottom: 0;
  border-bottom: 1px solid lightgrey;
`;
const TaskList = styled.div`
  //padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : '#ebecf0')};
  flex-grow: 1;
  min-height: 100px;
`;
const MainTaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : '#ebecf0')};
  //flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
  //min-height: 100px;
`;

export default class Column extends React.Component {
    render() {
        return (
            <Container>
                <Title>{this.props.column.title}</Title>
                <Droppable
                    droppableId={this.props.column.id}
                    isDropDisabled={this.props.isDropDisabled}
                >
                    {(provided, snapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task, index) => (
                                <Task key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>
        );
    }
}
export class MainColumn extends React.Component {
    render() {
        return (
            <MainContainer>
                <Title>{this.props.column.title}</Title>
                <Droppable
                    droppableId={this.props.column.id}
                    isDropDisabled={this.props.isDropDisabled}
                    direction="horizontal"
                >
                    {(provided, snapshot) => (
                        <MainTaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task, index) => (
                                <MainTask key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                        </MainTaskList>
                    )}
                </Droppable>
            </MainContainer>
        );
    }
}
