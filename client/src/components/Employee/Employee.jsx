import {connect, useDispatch, useSelector} from "react-redux";
import styles from "./Employee.module.css";
import {Layout, Tabs, Table, Space, Select} from "antd";
import {useEffect, useState} from "react";
import {useFetching} from "../../hooks/useFetching.hook";
import {getEmployees} from "../../redux/adminReducer";


const {TabPane} = Tabs;
const {Option} = Select;

function callback(key) {
    console.log(key);
}

const sortRowBySurname = (a, b) => {
    if (a.surname < b.surname) {
        return -1
    } else if (a.surname > b.surname)
        return 1
    else {
        return 0
    }
}
const columns = [
    {
        title: 'Номер',
        dataIndex: 'id',
        key: 'id',
    },
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
    {
        title: 'Роль',
        key: 'role',
        dataIndex: 'role',
        render: (text, record) => (
            <Select defaultValue={text} style={{width: 120}}>
                <Option value="teacher">Вчитель</Option>
                <Option value="headteacher">Завуч</Option>
                <Option value="headmaster">Директор</Option>
            </Select>
            // <Select defaultValue={text} style={{ width: 120 }} >
            //     <Option value="waiting">Очікуючий</Option>
            //     <Option value="confirmed">Прийнятий</Option>
            //     <Option value="excluded">Виключений</Option>
            // </Select>
            // <Space size="middle">
            //     <a data-value={record.id} onClick={deletePupilHandler}>Видалити</a>
            //     <a>Delete</a>
            // </Space>
        ),
    },

    {
        title: 'Телефон',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    }
];
const data2 = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    }
];
const {Header, Content} = Layout;

const Employees = ({role, employees, getEmployees}) => {
    const filteredEmployees = employees.filter(employee => employee.role === 'teacher' || employee.role === 'headteacher' || employee.role === 'headmaster');
    const filteredPupils = employees.filter(employee => employee.role === 'pupil');
    const selectAccessLevel = role => {
        if (role === 'admin') return <AdminTable filteredPupils={filteredPupils} filteredEmployees={filteredEmployees} employees={employees}/>;
        if (role === 'teacher') return 2;
        if (role === 'headteacher') return 3;
        if (role === 'headmaster') return 4;
        if (role === 'owner') return 5;
    }
    const Tables = selectAccessLevel(role);
    const [confirmedEmployees, setConfirmedEmployees] = useState(employees);
    const [waitingEmployees, setWaitingEmployees] = useState(employees);
    // const [waitingEmployees, setWaitingEmployees] = useState(employees);


    useEffect(() => {
        getEmployees();
    }, [])
    const deletePupilHandler = event => {
        // Here must be async deleting pupil
        //console.log(event.target.dataset.value);
    }
    if (role === 'admin') {
        columns.push({
            title: 'Дія',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a data-value={record.id} onClick={deletePupilHandler}>Видалити</a>
                    <a>Delete</a>
                </Space>
            ),
        });
    }

    return (
        <Layout>
            <Header style={{}}>
                Мій 10 клас
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

const AdminTable = ({ filteredEmployees, filteredPupils}) => {
    const [selectedTab, setSelectedTab] = useState('1');
    const dispatch = useDispatch();
    const confirmedEmployees = useSelector(state => state.admin.employees.filter(employee => employee.role === 'pupil'));
    const employees = useSelector(state => state.admin.employees);
    useEffect(() => {
        // getAdminEmployee
    })
    const changeTabs = key => {
        setSelectedTab(key);
    }
    const columns = [
        // {
        //     title: 'Номер',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
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
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }
    ];
    if (selectedTab === '1') {
        columns.push( {
            title: 'Роль',
            key: 'role',
            dataIndex: 'role',
            render: (text, record) => (
                <Select defaultValue={text} style={{width: 120}}>
                    <Option value="teacher">Вчитель</Option>
                    <Option value="headteacher">Завуч</Option>
                    <Option value="headmaster">Директор</Option>
                </Select>
            ),
        })
    }
    return <Tabs defaultActiveKey="1" onChange={changeTabs}>
        <TabPane tab="Працівники" key="1">
            <Table columns={columns} dataSource={employees}/>
        </TabPane>

        <TabPane tab="Заявки працівників" key="2">
            <Table columns={columns} dataSource={confirmedEmployees}/>
        </TabPane>

        <TabPane tab="Учні" key="3">
            <Table columns={columns} dataSource={confirmedEmployees}/>
        </TabPane>

        <TabPane tab="Заявки учнів" key="4">
            <Table columns={columns} dataSource={data2}/>
        </TabPane>
    </Tabs>
    // <Table columns={columns} dataSource={employees}/>
}

const mapState = state => ({
    role: state.user.profile.role,
    employees: state.admin.employees
})

export default connect(mapState, {getEmployees})(Employees);
