import React from 'react';
import {Table} from 'antd';
import styles from "./TeacherMarks.module.css";

export const TablePupilMarks = ({data}) => {
    // const obj = {name: 'Борисенко Богдан Сергійович', ...data};
    // const dataInArray = [];
    // dataInArray.push(obj);
    // console.log(obj);
    // const dynamicColumns = Object.keys(obj).map((item, index) => {
    //
    //     if (item === 'name') {
    //         console.log('asasdadads');
    //         return {
    //             title: 'Прізвище Ім\'я По-батькові',
    //             dataIndex: 'name',
    //             key: 'id',
    //             fixed: 'left',
    //             align: 'center',
    //         }
    //     }
    //     return {
    //         title: item,
    //         key: index + '',
    //         dataIndex: item,
    //         align: 'center'
    //     }
    // });
    // return (
    //     <Table
    //         columns={dynamicColumns}
    //         scroll={{x: 'max-content'}}
    //         pagination={false}
    //         size={"small"}
    //         dataSource={dataInArray}
    //     />
    // );
    const dynamicRows = Object.keys(data).map((item, index) => {
        return {
            key: index,
            name: item,
            mark: data[item],
        }
    });
    const dynamicColumns = [
        {
            title: 'Вид роботи',
            key: '0',
            dataIndex: 'name',
            // align: 'center'
        },
        {
            title: 'Оцінка',
            key: '1',
            dataIndex: 'mark',
            align: 'center'
        }
    ]
    console.log(dynamicColumns);
    return (
        <div className={styles.tableWrapper}>
            <Table
                columns={dynamicColumns}
                pagination={false}
                size={"small"}
                dataSource={dynamicRows}
            />
        </div>
    );
}
