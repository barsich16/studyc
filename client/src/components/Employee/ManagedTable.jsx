import React, {useState} from "react";
import {useSelector} from "react-redux";
import styles from "./Employee.module.css";
import {Button, Select, Table} from "antd";

export const ManagedTable = React.memo(({tab, dataSource, columns, changeRoleHandler, changeStateHandler, translateRole}) => {
    const role = useSelector(state => state.user.profile.role);
    const newColumns = [
        newColumn(role, 1),
        newColumn(role, 2),
        newColumn(role, 3),
        newColumn(role, 4)
    ];
    const [specificColumns, setSpecificColumns] = useState(newColumns);

    function newColumn(role, tab) {
        if (tab === 2) {
            return (
                {
                    title: 'Дія',
                    key: 'action',
                    render: (text, record) => (
                        <Button
                            type="text"
                            danger
                            className={styles.btn}
                            onClick={() => changeStateHandler(record.key, 'excluded')}
                        >
                            Відрахувати
                        </Button>
                    ),
                })
        }
        if (tab === 4) {
            return (
                {
                    title: 'Дія',
                    key: 'action',
                    render: (text, record) => (
                        <Button
                            type="link"
                            className={styles.btn}
                            onClick={() => changeStateHandler(record.key, 'confirmed')}
                        >Поновити
                        </Button>
                    ),
                })
        }

        const chooseAvailableRoles = role => {
            const availableRoles = [];
            if (role === 'teacher' || role === 'pupil') return availableRoles;
            availableRoles.push({name: 'Вчитель', value: 'teacher'});
            if (role === 'headteacher') return availableRoles;

            availableRoles.push({name: 'Завуч', value: 'headteacher'});
            if (role === 'headmaster' || role === 'admin') return availableRoles;
        }

        return (
            {
                title: 'Роль',
                key: 'role',
                dataIndex: 'role',
                render: (text, record) => {
                    const isRoleHigher = chooseAvailableRoles(text).find(item => item.value === role);
                    if (text === role || isRoleHigher) {
                        return translateRole(text)
                    }
                    const selectProps = {
                        key: record.key,
                        style: {minWidth: 130}
                    };
                    if (tab === 1) {
                        selectProps.defaultValue = translateRole(text);
                    }

                    if (tab === 3) {
                        selectProps.placeholder = 'Оберіть роль';
                    }
                    return (
                        <Select
                            {...selectProps}
                        >
                            {chooseAvailableRoles(role).map((item, index) => (
                                <Select.Option key={index} value={item.value} className="center-div">
                                    <Button
                                        disabled={tab === 1 && item.value === text}
                                        type="link" block
                                        onClick={() => changeRoleHandler(record.key, item.value, tab)}
                                    >
                                        {item.name}
                                    </Button>
                                </Select.Option>
                            ))}
                            <Select.Option className="center-div">
                                <Button type="link"
                                        danger block
                                        onClick={() => changeStateHandler(record.key, 'excluded')}
                                >
                                    Видалити
                                </Button>
                            </Select.Option>
                        </Select>
                    )
                }
            }
        )
    }

    const tableProps = {
        dataSource,
        pagination: false,
        columns: [...columns, specificColumns[tab-1]],
    }
    return <Table {...tableProps} />
})
