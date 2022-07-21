import React from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Column, {MainColumn} from './column';
import {Button} from "antd";

export const ScheduleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class Board extends React.Component {
    initialData = this.props.initialData;
    state = this.initialData;

    onDragStart = start => {
        const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
        this.setState({
            homeIndex,
        });
    };

    onDragEnd = result => {
        this.setState({
            homeIndex: null,
        });

        let { destination, source, draggableId } = result;
        console.log(result);
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const home = this.state.columns[source.droppableId];
        const foreign = this.state.columns[destination.droppableId];

        if (home === foreign) {  // moving among one list
            const newTaskIds = Array.from(home.taskIds);
            const newSubjectIds = Array.from(home.subjectIds);

            newTaskIds.splice(source.index, 1);
            const deletedSubjectId = newSubjectIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            newSubjectIds.splice(destination.index, 0, ...deletedSubjectId);

            const newHome = {
                ...home,
                taskIds: newTaskIds,
                subjectIds: newSubjectIds
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newHome.id]: newHome,
                },
            };

            this.setState(newState);
            return;
        }

        // moving from one list to another
        const homeTaskIds = Array.from(home.taskIds);
        const initialLength = +Object.keys(this.initialData.tasks).length + 1;

        this.initialData.tasks['task-' + initialLength] = {...this.initialData.tasks[draggableId], id: 'task-' + initialLength};
        const subj = this.initialData.tasks[draggableId].subjectId;

        homeTaskIds.splice(source.index, 1, 'task-' + initialLength);
        const newHome = {
            ...home,
            taskIds: homeTaskIds,
        };

        const foreignTaskIds = Array.from(foreign.taskIds);
        const foreignSubjectIds = Array.from(foreign.subjectIds);
        if (foreign.id !== 'column-6') {
            foreignTaskIds.splice(destination.index, 0, draggableId);
            foreignSubjectIds.splice(destination.index, 0, typeof subj === 'string' ? +subj : subj);
        }

        const newForeign = {
            ...foreign,
            taskIds: foreignTaskIds,
            subjectIds: foreignSubjectIds
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newHome.id]: newHome,
                [newForeign.id]: newForeign,
            },
        };
        this.setState(newState);
    };

    deleteTask = (column, itemIndex) => {
        column.taskIds.splice(itemIndex, 1);
        const filteredSubjectId = column.subjectIds.filter((item, index) => index !== itemIndex);

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [column.id]: {...column, subjectIds: filteredSubjectId},
            },
        };

        this.setState(newState);
    }

    render() {
        return (
            <>
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <ScheduleContainer>
                        {this.state.columnOrder.map(columnId => {
                            const column = this.state.columns[columnId];
                            const tasks = column.taskIds.map(
                                taskId => this.state.tasks[taskId],
                            );

                            const isDropDisabled = false;

                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks}
                                    deleteElement={this.deleteTask}
                                    isDropDisabled={isDropDisabled}
                                />
                            );
                        })}
                    </ScheduleContainer>
                    <div>
                        {this.state.mainColumn.map(columnId => {
                            const column = this.state.columns[columnId];
                            const tasks = column.taskIds.map(
                                taskId => this.state.tasks[taskId],
                            );

                            const isDropDisabled = false;

                            return (
                                <MainColumn
                                    key={column.id}
                                    column={column}
                                    tasks={tasks}
                                    isDropDisabled={isDropDisabled}
                                />
                            );
                        })}
                    </div>
                </DragDropContext>
                <div style={{display: 'flex', justifyContent: 'end', marginTop: 20}}>
                    <Button
                        type='primary'
                        onClick={() => this.props.updateSchedule(this.state.columns)}>Зберегти</Button>
                </div>
            </>
        );
    }
}
