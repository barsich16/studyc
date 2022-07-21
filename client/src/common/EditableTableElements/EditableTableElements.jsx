import React, {useContext, useEffect, useRef, useState} from "react";
import {Form, InputNumber} from "antd";
import styles from "./EditableTableElements.module.css";

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
                          semester,
                          allowEditing,
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
                style={{ margin: '0 auto', width: 50 }}
                name={dataIndex}
            >
                <InputNumber
                    className={styles.input}
                    controls={false}
                    min={0} max={12}
                    ref={inputRef}
                    onPressEnter={save}
                    onBlur={save}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ minHeight: 20, cursor: allowEditing ? 'pointer' : 'auto', }}
                onClick={allowEditing ? toggleEdit : () => {}}
            >
                {children}
            </div>
        );
    }
    const bg = semester === 1 ? styles.firstSemester : styles.secondSemester;

    return <td {...restProps} className={`${editing ? styles.pad0 : styles.cells} ${bg}`}>{childNode}</td>;
};

export const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};
