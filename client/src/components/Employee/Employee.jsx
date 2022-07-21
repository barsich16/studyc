import {useSelector} from "react-redux";
import styles from "./Employee.module.css";
import {Layout, Tabs, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useFetching} from "../../hooks/useFetchingDispatch.hook";
import Loader from "../Loader";
import {ManagedTable} from "./ManagedTable";
import {sortRowBySurname} from "../../common/sortFunctions";
import {changeRole, changeState} from "../../redux/adminReducer";

const {TabPane} = Tabs;
const {Header, Content} = Layout;

export const Employees = React.memo(() => {
    const {fetching} = useFetching();
    const columns = [
        {
            title: 'Прізвище',
            dataIndex: 'surname',
            key: 'surname',
            sorter: sortRowBySurname,
            render: text => <a>{text}</a>,
        },
        {
            title: 'Ім\'я',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'По-батькові',
            dataIndex: 'patronymic',
            key: 'patronymic',
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            render: text => (
                '+' + text
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }
    ];
    const [baseColumns, setBaseColumns] = useState(columns);

    const [selectedTab, setSelectedTab] = useState('1');
    const optimizedChangeTab = React.useCallback(key => setSelectedTab(key), [])
    const role = useSelector(state => state.user.profile.role);

    const employees = useSelector(state => state.admin.employees);
    const filteredEmployees = {
        confirmedPupils: employees.filter(employee => employee.state === 'confirmed' && employee.role === 'pupil'),
        confirmedEmployees: employees.filter(employee => employee.state === 'confirmed' && employee.role !== 'pupil'),
        waitingEmployees: employees.filter(employee => employee.state === 'waiting' && employee.role !== 'pupil'),
        excludedEmployees: employees.filter(employee => employee.state === 'excluded'),
    }

    const [data, setData] = useState(filteredEmployees);
    useEffect(() => {
        setData(filteredEmployees);
    }, [employees])

    const translateRole = role => {
        if (role === 'teacher') {
            return 'Вчитель'
        } else if (role === 'headteacher') {
            return 'Завуч'
        } else {
            return 'Не вказаний'
        }
    }

    const changeRoleHandler = React.useCallback((key, newRole, tab) => {
        fetching(changeRole, key, newRole);
        if (tab === 3) {
            changeStateHandler(key, 'confirmed');
        }
    }, []);

    const changeStateHandler = React.useCallback((key, newState) => {
        fetching(changeState, key, newState);
    }, []);

    const selectAccessLevel = role => {
        const generalProps = {
            columns: baseColumns,
            changeTabs: optimizedChangeTab,
            changeRoleHandler,
            changeStateHandler,
            translateRole
        };
        if (role === 'admin' || role === 'owner' || role === 'headmaster' || role == 'headteacher') {
            return <AdminTable
                filteredEmployees={data}
                generalProps={generalProps}
            />
        } else {
            const newColumn = {
                title: 'Роль',
                key: 'role',
                dataIndex: 'role',
                width: 250,
                render: text => {
                    translateRole(text)
                }
            };
            return <Table
                columns={[...columns, newColumn]}
                dataSource={filteredEmployees.confirmedEmployees}
            />
        }
    }

    if (!employees) {
        return <Loader/>
    }

    const Tables = selectAccessLevel(role);
    return (
        <>
            <Header></Header>
            <Content
                className={styles.siteLayoutBackground}
                style={{ minHeight: 280 }}>
                <div className={styles.tabsContainer}>
                    {Tables}
                </div>
            </Content>
        </>
    );
})

const AdminTable = React.memo(({filteredEmployees, generalProps}) => {
    const {changeTabs, ...tableProps} = generalProps;
    return (
        <Tabs defaultActiveKey="1" onChange={changeTabs}>
            <TabPane tab="Працівники" key="1">
                <ManagedTable
                    tab={1}
                    dataSource={filteredEmployees.confirmedEmployees}
                    {...tableProps}
                />
            </TabPane>
            <TabPane tab="Учні" key="2">
                <ManagedTable
                    tab={2}
                    dataSource={filteredEmployees.confirmedPupils}
                    {...tableProps}
                />
            </TabPane>
            <TabPane tab="Заявки" key="3">
                <ManagedTable
                    tab={3}
                    dataSource={filteredEmployees.waitingEmployees}
                    {...tableProps}
                />
            </TabPane>
            <TabPane tab="Виключені" key="4">
                <ManagedTable
                    tab={4}
                    dataSource={filteredEmployees.excludedEmployees}
                    {...tableProps}
                />
            </TabPane>
        </Tabs>
    )
})
