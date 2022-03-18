import styles from "./MyClass.module.css";
import {Layout, Tabs, Table} from "antd";
import {useEffect} from "react";
import {connect} from "react-redux";
import {getClass} from "../../redux/userReducer";

const {TabPane} = Tabs;

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
const MyClass = ({getClass, classmates, role}) => {
    // const {fetching, loading} = useFetching();
    // const dispatch = useDispatch();
    // const classmates = useSelector(getClassmatesSelector);
    // const role = useSelector(state => state.user.profile.role);
    const deletePupilHandler = event => {
        // Here must be async deleting pupil
        //console.log(event.target.dataset.value);
    }
    if (role === 2) {
        columns.push({
                title: 'Дія',
                key: 'action',
                render: (text, record) => (
                    <a data-value={record.id} onClick={deletePupilHandler}>Видалити</a>
                ),
            });
    }
    useEffect(() => {
        getClass();
    }, [])
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
                    Мій 10 клас
                    <Tabs defaultActiveKey="1" onChange={callback}>

                        <TabPane tab="Учні" key="1">
                            <Table columns={columns} dataSource={classmates}/>
                        </TabPane>

                        <TabPane tab="Вчителі" key="2">
                            <Table columns={columns} dataSource={data2}/>
                        </TabPane>
                    </Tabs>
                </div>
            </Content>
        </Layout>
    );
}

const mapState = state => ({
    role: state.user.profile.role,
    classmates: state.user.classmates
})
export default connect(mapState, {getClass})(MyClass);
