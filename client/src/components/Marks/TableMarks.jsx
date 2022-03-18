import React, {useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Form, Button, Checkbox, Modal} from 'antd';
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

const sortRowBySurname = (a, b) => {
    if (a.name < b.name) {
        return -1
    } else if (a.name > b.name)
        return 1
    else {
        return 0
    }
}

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
                    minHeight: 20,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps} className={editing ? styles.pad0 : styles.cells}>{childNode}</td>;
};
export const TableMarks = ({dataClass, dataClassName, updateMarks}) => {
    const columnsTemplate = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
            width: 30,
        },
        {
            title: 'ПІБ учня',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            sorter: sortRowBySurname,
            render: text => <a>{text}</a>,
            defaultSortOrder: 'ascend',
            // sorter: sortRowBySurname,
            align: 'left',
            width: 250,
            // ellipsis: {
            //     showTitle: false,
            // },
        },
        // {
        //     title: 'Результат',
        //     dataIndex: 'address',
        //     key: '8',
        //     fixed: 'right',
        //     align: 'center'
        // },
    ];
    const [isHighlightMarksActive, setIsHighlightMarksActive] = useState(false);
    const [visible, setVisible] = useState(false);

    const firstElement = dataClass[0];
    const neededKeys = Object.keys(firstElement).slice(3);
    const dynamicColumns = neededKeys.map((item, index) => {
        return {
            title: item,
            key: index + '',
            dataIndex: item,
            editable: true,
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            // textWrap: 'word-break',
            width: 80,

            render: (text) => {
                if (text !== '' && isHighlightMarksActive) {
                    return <div className={styles.highligtedMarks}>{text}</div>
                } else {
                    return <div>{text}</div>
                }

            },
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
    const highlightGivenMarks = e => {
        setIsHighlightMarksActive(e.target.checked)
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
            <Checkbox onChange={highlightGivenMarks}>Виставлені оцінки</Checkbox>
            <Button type="primary" onClick={() => setVisible(true)}>
                Повноекранний режим
            </Button>
            <Table
                components={components}
                rowClassName={styles.rows}
                bordered={true}
                // scroll={{x : 'max-content'}}
                scroll={{x: 1000}}
                size='small'
                pagination={false}
                dataSource={localState}
                columns={columns}
                tableLayout={'fixed'}
            />
            <Modal
                title="Fullscreen"
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={'100%'}
                className={styles.modal}
                bodyStyle={{padding: '10px 10px'}}
            >
                <Checkbox onChange={highlightGivenMarks}>Виставлені оцінки</Checkbox>
                <Table
                    components={components}
                    rowClassName={styles.rows}
                    bordered={true}
                    // scroll={{x : 'max-content'}}
                    scroll={{x: 1000}}
                    // size='middle'
                    pagination={false}
                    dataSource={localState}
                    columns={columns}
                    tableLayout={'fixed'}
                />
            </Modal>
            <div className={styles.btn_wrap}>
                <Button type="primary" onClick={updateHandler} loading={loading}>
                    Зберегти
                </Button>
            </div>
        </>
    );
}
