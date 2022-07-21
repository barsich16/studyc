import {Layout} from "antd";
import styles from "./Classes.module.css";
import {
    Form,
    Input,
    Button,
    InputNumber,
    message
} from 'antd';
import AppointmentTable from "../Appointment/AppointmentTable";
import {useEffect} from "react";
import {appointClassTeacher, createClass, getClasses} from "../../redux/adminReducer";
import {useDispatch, useSelector} from "react-redux";
import SearchedSelect from "../common/SearchedSelect";
import Loader from "../Loader";
import {useFetching} from '../../hooks/useFetchingDispatch.hook'

const {Header, Content} = Layout;

const Classes = () => {
    const dispatch = useDispatch();
    const {fetching} = useFetching();

    const classes = useSelector(state => state.admin.classes);
    const employees = useSelector(state => state.admin.employees.filter(item => item.role !== 'pupil'));

    const [formClass] = Form.useForm();

    useEffect(() => {
        if(!classes) {
            dispatch(getClasses());
        }
    }, []);

    if (!classes) {
        return <Loader />
    }
    const employeesWithoutClass = employees.filter(employee => !employee.class_id);
    const employeesWithClass = employees.filter(employee => employee.class_id);
    const classesIdWithTeacher = employeesWithClass.map(employee => employee.class_id);
    const classesWithoutTeacher = classes.filter(item => !classesIdWithTeacher.includes(item.key));

    const teachers = employeesWithoutClass.map(employee => {
        return {key: `${employee.surname} ${employee.name} ${employee.patronymic}`, value: employee.key}
    })

    const classesForTable = classes.map(item => {
        const newItem = {...item, number: item.letter ? item.number + '-' + item.letter : item.number+''};
        delete newItem.letter;
        return newItem;
    })

    const onClassTeacherSelected = classId => {
        return teacherId => {
            fetching(appointClassTeacher, classId, teacherId);
        }
    }

    const columns = [
        {
            title: 'Назва класу',
            dataIndex: 'number',
            key: 'number',
            addSearch: true,
            width: 180,
        },
        {
            title: 'Класний керівник',
            dataIndex: 'class_teacher',
            key: 'class_teacher',
            render: (text, record) => {
                return (
                        <SearchedSelect children={[{key: 'Немає', value: null}, ...teachers]}
                                        onChange={onClassTeacherSelected(record.key)}
                                        defaultValue={text}
                                        style={{minWidth: 350}}
                                        placeholder={'Оберіть вчителя...    '}/>
                        )
            },
        },
        {
            title: 'Кількість учнів',
            dataIndex: 'pupil_count',
            key: 'pupil_count',
            addSearch: false,
        },
        {
            title: 'Дата створення',
            dataIndex: 'creation_date',
            key: 'creation_date',
            align: 'center',
            addSearch: false
        },
        {
            title: 'Код класу',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            addSearch: true
        },

    ];


    const onFinishClass = ({classNumber, classLetter = null, teacher}) => {
        const sameClasses = classes.filter(item => {
            if (item.number === classNumber) {
                if ((!item.letter && !classLetter) || (item.letter && classLetter && item.letter.toLowerCase() === classLetter.toLowerCase())) {
                    return true;
                }
                return false
            }
        });

        const isClassAlreadyExists = sameClasses.length > 0;
        isClassAlreadyExists
            ? message.error('Такий клас вже існує')
            : fetching(createClass, classNumber, classLetter, teacher);

        formClass.resetFields();
    };

    return (
        <Layout>
            <Header />
            <Content
                className={styles.siteLayoutBackground}
                style={{ minHeight: 280 }}>
                <div className={styles.tabsContainer}>
                    <Form
                        style={{marginBottom: 20}}
                        layout="inline"
                        onFinish={onFinishClass}
                        form={formClass}
                        className={styles.form}
                    >
                        <Form.Item
                            label="Номер класу"
                            name='classNumber'
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                },
                            ]}
                        >
                            <InputNumber placeholder={10}  min={1} max={12}/>
                        </Form.Item>

                        <Form.Item
                            label="Буква класу"
                            name='classLetter'
                        >
                            <Input maxLength={2} placeholder={'A'} style={{maxWidth: 60}}/>
                        </Form.Item>

                        <Form.Item label="Класний керівник" name='teacher'>
                            <SearchedSelect children={teachers}  style={{minWidth: 350}} placeholder={'Оберіть вчителя...    '}/>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Створити новий клас
                            </Button>
                        </Form.Item>
                    </Form>

                    <AppointmentTable columns={columns} data={classesForTable}/>
                </div>
            </Content>
        </Layout>
    );
}

export default Classes;
