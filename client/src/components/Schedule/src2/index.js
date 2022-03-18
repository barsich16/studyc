import React from 'react';
import ReactDOM from 'react-dom';
//import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column, {MainColumn} from './column';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class Board extends React.Component {
    state = initialData;

    onDragStart = start => {
        const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
        // console.log('newState: ', this.state)
        this.setState({
            homeIndex,
        });
    };

    onDragEnd = result => {
        this.setState({
            homeIndex: null,
        });

        const { destination, source, draggableId } = result;
        console.log(this.state);

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
        //console.log(home);
        //console.log(foreign);

        if (home === foreign) {
            const newTaskIds = Array.from(home.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newHome = {
                ...home,
                taskIds: newTaskIds,
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
        // console.log(Object.keys(initialData.tasks));
        const initialLength = +Object.keys(initialData.tasks).length + 1;
        //console.log(initialLength);
        const newItem = 'task-' + initialLength;
        //console.log(initialLength);
        initialData.tasks[newItem] = {...initialData.tasks[draggableId], id: newItem};
        // initialData.tasks['task-' + initialLength] = {...initialData.tasks[draggableId], id: 'task-' + initialLength};

        //initialData.tasks;

        homeTaskIds.splice(source.index, 1, newItem);
        //console.log(homeTaskIds);
        const newHome = {
            ...home,
            taskIds: homeTaskIds,
        };

        const foreignTaskIds = Array.from(foreign.taskIds);
        foreignTaskIds.splice(destination.index, 0, draggableId);
        const newForeign = {
            ...foreign,
            taskIds: foreignTaskIds,
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

    render() {
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                <Container>
                    {this.state.columnOrder.map((columnId, index) => {
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
                                isDropDisabled={isDropDisabled}
                            />
                        );
                    })}
                </Container>
                <div>
                    {this.state.mainColumn.map((columnId, index) => {
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
        );
    }
}