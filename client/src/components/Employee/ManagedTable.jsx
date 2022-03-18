import React, {useState} from "react";
import {useDispatch} from "react-redux";
import styles from "./Employee.module.css";
import {Button, Table} from "antd";
import {changeState, changeRole} from "../../redux/adminReducer";

export const ManagedTable = ({type, dataSource, columns}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeRadio, setActiveRadio] = useState(false);
    const [canChange, setCanChange] = useState({increase: false, decrease: false});

    const dispatch = useDispatch();

    const changeStateEmployee = (newState) => {
        setLoading(true);
        dispatch(changeState(selectedRowKeys, newState));
        setSelectedRowKeys([]);
        setLoading(false);
        clearSelectedRowKeys();
    };
    const checkEmployee = (employeeRole, myRole) => {
        switch (employeeRole) {
            case 'teacher':
                if (myRole === 'admin' || myRole === 'owner' || myRole === 'headmaster') {
                    return {increase: 'headteacher', decrease: false}
                }
                break;
            case 'headteacher':
                if (myRole === 'admin' || myRole === 'owner') {
                    return {increase: 'headmaster', decrease: 'teacher'}
                } else if (myRole === 'headmaster') {
                    return {increase: false, decrease: 'teacher'}
                }
                break;
            case 'headmaster':
                if (myRole === 'owner' || myRole === 'admin') {
                    return {increase: false, decrease: 'headteacher'}
                }
                break;
            default:
                return {increase: false, decrease: false}
        }
    }
    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = type === 'employees'
        ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
                const btnState = checkEmployee(selectedRows[0].role, 'admin');
                setCanChange(btnState);
                setActiveRadio({key: selectedRowKeys[0], role: selectedRows[0].role});
            },
            type: 'radio'
        }
        : {
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
            }
        };
    const clearSelectedRowKeys = () => {
        setSelectedRowKeys([]);
        setCanChange({increase: false, decrease: false});
        setActiveRadio(false);
    }
    const increaseRoleHandler = () => {
        dispatch(changeRole(activeRadio.key, canChange.increase));
        clearSelectedRowKeys();
    }
    const decreaseRoleHandler = () => {
        dispatch(changeRole(activeRadio.key, canChange.decrease));
        clearSelectedRowKeys();
    }
    const selectButtons = type => {
        if (type === 'employees') {
            return <div className={styles.btn_wrap}>
                <Button primary onClick={increaseRoleHandler}
                        disabled={!canChange.increase}
                        loading={loading}
                        type='primary'>
                    Підвищити
                </Button>
                <Button danger onClick={decreaseRoleHandler}
                        disabled={!canChange.decrease}
                        loading={loading}
                        style={{margin: '0 5px'}}>
                    Понизити
                </Button>
                <Button type="danger"
                        onClick={() => changeStateEmployee('excluded')}
                        disabled={!activeRadio}
                        loading={loading}>
                    Виключити
                </Button>
            </div>
        }
        if (type === 'requests') {
            return (
                <div className={styles.btn_wrap}>
                    <span style={{marginLeft: 8}}>
                        {hasSelected ? `Виділено: ${selectedRowKeys.length}` : ''}
                    </span>
                    <Button type="primary" style={{margin: '0 5px'}}
                            onClick={() => changeStateEmployee('confirmed')}
                            disabled={!hasSelected}
                            loading={loading}>
                        Прийняти
                    </Button>
                    <Button type="danger"
                            onClick={() => changeStateEmployee('excluded')}
                            disabled={!hasSelected}
                            loading={loading}>
                        Відхилити
                    </Button>
                </div>)
        }
        if (type === 'pupils') {
            return (
                <div className={styles.btn_wrap}>
                    <span style={{marginRight: 8}}>
                        {hasSelected ? `Виділено: ${selectedRowKeys.length}` : ''}
                    </span>
                    <Button onClick={() => changeStateEmployee('excluded')}
                            disabled={!hasSelected}
                            loading={loading}
                            type="danger">
                        Відрахувати
                    </Button>
                </div>
            )
        }
        if (type === 'excluded') {
            return (
                <div className={styles.btn_wrap}>
                    <span style={{marginRight: 8}}>
                        {hasSelected ? `Виділено: ${selectedRowKeys.length}` : ''}
                    </span>
                    <Button type='primary'
                            onClick={() => changeStateEmployee('confirmed')}
                            disabled={!hasSelected}
                            loading={loading}>
                        Поновити
                    </Button>
                </div>
            )
        }
    }
    const buttons = selectButtons(type);

    return <>
        <Table rowSelection={rowSelection}
               columns={columns}
               dataSource={dataSource}
               pagination={false}/>
        {buttons}
    </>
}
