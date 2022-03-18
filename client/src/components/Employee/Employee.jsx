import {connect, useSelector} from "react-redux";
import styles from "./Employee.module.css";
import {Layout, Tabs, Table, Select} from "antd";
import React, {useState} from "react";
// import {useFetching} from "../../hooks/useFetching.hook";
import {getEmployees} from "../../redux/adminReducer";
import Loader from "../Loader";
import {ManagedTable} from "./ManagedTable";


const {TabPane} = Tabs;
// const {Option} = Select;

// function callback(key) {
//     console.log(key);
// }

const sortRowBySurname = (a, b) => {
    if (a.surname < b.surname) {
        return -1
    } else if (a.surname > b.surname)
        return 1
    else {
        return 0
    }
}
// const columns = [
//     {
//         title: 'Номер',
//         dataIndex: 'id',
//         key: 'id',
//     },
//     {
//         title: 'Прізвище',
//         dataIndex: 'surname',
//         key: 'surname',
//         // defaultSortOrder: 'ascend',
//         sorter: sortRowBySurname,
//         render: text => <a>{text}</a>,
//     },
//     {
//         title: 'Ім\'я',
//         dataIndex: 'name',
//         key: 'name',
//     },
//     {
//         title: 'По-батькові',
//         dataIndex: 'patronymic',
//         key: 'patronymic',
//     },
//     {
//         title: 'Роль',
//         key: 'role',
//         dataIndex: 'role',
//         render: (text, record) => (
//             <Select defaultValue={text} style={{width: 120}}>
//                 <Option value="teacher">Вчитель</Option>
//                 <Option value="headteacher">Завуч</Option>
//                 <Option value="headmaster">Директор</Option>
//             </Select>
//         ),
//     },
//
//     {
//         title: 'Телефон',
//         dataIndex: 'phone',
//         key: 'phone',
//     },
//     {
//         title: 'Email',
//         dataIndex: 'email',
//         key: 'email',
//     }
// ];
const {Header, Content} = Layout;

const Employees = ({getEmployees}) => {
    const [selectedTab, setSelectedTab] = useState('1');

    // useEffect(() => {
    //     getEmployees();
    // }, []);
    const changeTabs = key => {
        setSelectedTab(key);
    }

    const role = useSelector(state => state.user.profile.role);

    const employees = useSelector(state => state.admin.employees);
    const confirmedPupils = employees.filter(employee => employee.state === 'confirmed' && employee.role === 'pupil');
    const confirmedEmployees = employees.filter(employee => employee.state === 'confirmed' && employee.role !== 'pupil');
    const waitingEmployees = employees.filter(employee => employee.state === 'waiting');
    const excludedEmployees = employees.filter(employee => employee.state === 'excluded');
    const filteredEmployees = {
        confirmedPupils, confirmedEmployees, waitingEmployees, excludedEmployees
    }
    const columns = [
        {
            title: 'Прізвище',
            dataIndex: 'surname',
            key: 'surname',
            // defaultSortOrder: 'ascend',
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
        // {
        //     title: 'Роль',
        //     key: 'role',
        //     dataIndex: 'role',
        //     render: (text, record) => (
        //         <Select defaultValue={text} style={{width: 120}}>
        //             <Option value="teacher">Вчитель</Option>
        //             <Option value="headteacher">Завуч</Option>
        //             <Option value="headmaster">Директор</Option>
        //         </Select>
        //         // <Select defaultValue={text} style={{ width: 120 }} >
        //         //     <Option value="waiting">Очікуючий</Option>
        //         //     <Option value="confirmed">Прийнятий</Option>
        //         //     <Option value="excluded">Виключений</Option>
        //         // </Select>
        //         // <Space size="middle">
        //         //     <a data-value={record.id} onClick={deletePupilHandler}>Видалити</a>
        //         //     <a>Delete</a>
        //         // </Space>
        //     ),
        // },
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
    const selectAccessLevel = role => {
        if (role === 'admin' || role === 'owner' || role === 'headmaster' || role == 'headteacher') {
            return <AdminTable columns={columns} changeTabs={changeTabs} filteredEmployees={filteredEmployees}/>;
        } else {
            return <UserTable columns={columns} changeTabs={changeTabs} filteredEmployees={filteredEmployees}/>
        }
    }
    const Tables = selectAccessLevel(role);

    if (selectedTab === '1') {
        columns.push({
            title: 'Роль',
            key: 'role',
            dataIndex: 'role',
            width: 250,
            render: (text, record) => {
                if (record.role === 'teacher') {
                    return 'Вчитель'
                } else if (record.role === 'headteacher') {
                    return 'Завуч'
                } else if (record.role === 'headmaster') {
                    return 'Зам. директора'
                } else {
                    return 'Не вказаний'
                }
            }
        })
    }
    if (selectedTab === '2' && !(role === 'teacher' || role === 'pupil')) {
        columns.push(
            {
                title: 'Роль',
                key: 'role',
                dataIndex: 'role',
                render: text => {
                    switch (text) {
                        case 'teacher':
                            return 'Вчитель';
                        case 'pupil':
                            return 'Учень';
                    }
                },
                filters: [
                    {
                        text: 'Учні',
                        value: 'pupil',
                    },
                    {
                        text: 'Вчителі',
                        value: 'teacher',
                    },
                ],
                onFilter: (value, record) => record.role.indexOf(value) === 0,
            },
            // {
            //     title: 'Дія',
            //     key: 'action',
            //     render: (text, record) => (
            //         <Space size="middle">
            //             <a data-value={record.id}>Прийняти</a>
            //             {/*onClick={deletePupilHandler}*/}
            //             <a>Відхилити</a>
            //         </Space>
            //     ),
            // },

        );
    }
    ;
    if (!employees) {
        return <Loader/>
    }

    // }, [employees]);

    return (
        <Layout>
            <Header>
            </Header>
            <Content
                className={styles.siteLayoutBackground}
                style={{
                    // margin: '24px 16px',
                    // padding: 24,
                    minHeight: 280,
                }}>
                <div className={styles.tabsContainer}>
                    {Tables}
                </div>
            </Content>
        </Layout>
    );
}
const UserTable = ({columns, filteredEmployees, changeTabs}) => {
    return (
        <Tabs defaultActiveKey="1" onChange={changeTabs}>
            <TabPane tab="Працівники" key="1">
                <Table columns={columns}
                       dataSource={filteredEmployees.confirmedEmployees}/>
            </TabPane>

            <TabPane tab="Учні" key="2">
                <Table
                    dataSource={filteredEmployees.confirmedPupils}
                    columns={columns}/>
            </TabPane>
        </Tabs>
    )
}
const AdminTable = ({columns,changeTabs, filteredEmployees}) => {
    return (
        <Tabs defaultActiveKey="1" onChange={changeTabs}>
            <TabPane tab="Працівники" key="1">
                <ManagedTable
                    type='employees'
                    dataSource={filteredEmployees.confirmedEmployees}
                    columns={columns}/>
            </TabPane>

            <TabPane tab="Учні" key="2">
                <ManagedTable
                    type='pupils'
                    dataSource={filteredEmployees.confirmedPupils}
                    columns={columns}/>
            </TabPane>
            <TabPane tab="Заявки" key="3">
                <ManagedTable
                    type='requests'
                    dataSource={filteredEmployees.waitingEmployees}
                    columns={columns}/>
            </TabPane>
            <TabPane tab="Виключені" key="4">
                <ManagedTable
                    type='excluded'
                    dataSource={filteredEmployees.excludedEmployees}
                    columns={columns}/>
            </TabPane>
        </Tabs>
    )
}
const mapState = state => ({
    role: state.user.profile.role,
    employees: state.admin.employees
})


export default connect(mapState, {getEmployees})(Employees);
