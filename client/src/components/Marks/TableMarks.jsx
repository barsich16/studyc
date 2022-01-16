import React, {useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Form, Button} from 'antd';
import styles from './TeacherMarks.module.css'
import {useFetching} from "../../hooks/useFetching.hook";

const EditableContext = React.createContext(null);
const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false} size={"small"}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                className="marks-wrapper"
                style={{
                    margin: '0 auto'
                }}
                name={dataIndex}
                // rules={[
                //     {
                //         required: true,
                //         message: ``,
                //     },
                // ]}
            >
                <Input className={styles.input} ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    minHeight: 20, minWidth: 30
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}  className={editing ? styles.pad0 : styles.cells}>{childNode}</td>;
};
export const TableMarks = ({dataClass, dataClassName, updateMarks, statusMessage, setStatusMessage}) => {
    const columnsTemplate = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        },
        {
            title: 'Прізвище Ім\'я По-батькові',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: text => <a>{text}</a>,
            // defaultSortOrder: 'ascend',
            // sorter: sortRowBySurname,
            align: 'center'
        },
        // {
        //     title: 'Результат',
        //     dataIndex: 'address',
        //     key: '8',
        //     fixed: 'right',
        //     align: 'center'
        // },
    ];

    const firstElement = dataClass[0];
    const neededKeys = Object.keys(firstElement).slice(3);
    const dynamicColumns = neededKeys.map((item, index) => {
        return {
            title: item,
            key: index+'',
            dataIndex: item,
            editable: true,
            align: 'center'
        }
    });

    columnsTemplate.push(...dynamicColumns);

    const [localState, setLocalState] = useState(dataClass);
    const {fetching, loading} = useFetching();

    const handleSave = row => {
        const newData = [...localState];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setLocalState(newData);
    };

    const updateHandler = () => {
        const newMarks = localState;
        fetching(updateMarks, dataClassName, newMarks);
    }
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = columnsTemplate.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    return (
        <>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                scroll={{x : 'max-content'}}
                size='small'
                pagination = {false}
                dataSource={localState}
                columns={columns}
            />
            <div className={styles.btn_wrap}>
                <Button type="primary" onClick={updateHandler} loading={loading}>
                    Зберегти
                </Button>
            </div>
        </>
    );
}
