import {Layout} from "antd";
import styles from "./Classes.module.css";
import {
    Form,
    Input,
    Button,
    InputNumber,
} from 'antd';
import AppointmentTable from "../Appointment/AppointmentTable";
import {useEffect} from "react";
import {createClass, getClasses} from "../../redux/adminReducer";
import {useDispatch, useSelector} from "react-redux";
import SearchedSelect from "../common/SearchedSelect";

const {Header, Content} = Layout;
// const data = [
//     {
//         key: '1',
//         classTeacher: 'Teacherenko Teacher Teacherovych',
//         className: '10-A',
//         pupilCount: 25,
//         creationDate: '12.12.2012',
//         code: '34r3r1'
//     },
//     {
//         key: '2',
//         classTeacher: 'Teacherenko Teacher Teacherovych',
//         className: '10',
//         pupilCount: 5,
//         creationDate: '12.12.2012',
//         code: '34r3r1'
//     },
//     {
//         key: '3',
//         classTeacher: 'Teacherenko Teacher Teacherovych',
//         className: '8',
//         pupilCount: 15,
//         creationDate: '12.12.2012',
//         code: '34r3r1'
//     },
//     {
//         key: '4',
//         classTeacher: 'Teacherenko Teacher Teacherovych',
//         className: '9-A',
//         pupilCount: 22,
//         creationDate: '12.12.2012',
//         code: '34r3r1'
//     },
// ];

const Classes = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getClasses());
    }, []);
    const classes = useSelector(state => state.admin.classes);
    const employees = useSelector(state => state.admin.employees.filter(item => item.role !== 'pupil'));
    const employeesWithoutClass = employees.filter(employee => !employee.class_id);
    const employeesWithClass = employees.filter(employee => employee.class_id);
    const classesIdWithTeacher = employeesWithClass.map(employee => employee.class_id);
    const classesWithoutTeacher = classes.filter(item => !classesIdWithTeacher.includes(item.key));
    // console.log(classesWithoutTeacher);
    const teachers = employeesWithoutClass.map(employee => {
        // return {[`${employee.key}`]: `${employee.surname} ${employee.name} ${employee.patronymic}`}
        return {key: `${employee.surname} ${employee.name} ${employee.patronymic}`,
                value: `${employee.key}`}
    })
    const filteredClasses = classesWithoutTeacher.map(item => {
        return {key: item.number, value: item.key}
    })
    console.log(teachers);
    const columns = [
        {
            title: 'Назва класу',
            dataIndex: 'number',
            key: 'number',
            // width: '20%',
            addSearch: true
        },
        {
            title: 'Класний керівник',
            dataIndex: 'class_teacher',
            key: 'class_teacher',
            addSearch: true
        },
        {
            title: 'Кількість учнів',
            dataIndex: 'pupil_count',
            key: 'pupil_count',
            // width: '20%',
            addSearch: false
        },
        {
            title: 'Дата створення',
            dataIndex: 'creation_date',
            key: 'creation_date',
            // width: '20%',
            addSearch: false
        },
        {
            title: 'Код класу',
            dataIndex: 'code',
            key: 'code',
            // width: '20%',
            addSearch: true
        },

    ];

    const [formClass] = Form.useForm();
    const onFinishClass = ({classNumber, classLetter, teacher}) => {
        // console.log('Success:', values);
        dispatch(createClass(classNumber, classLetter, teacher));
        formClass.resetFields();
    };
    const [formTeacher] = Form.useForm();
    const onFinishTeacher = (values) => {
        console.log('Success:', values);
        formTeacher.resetFields();
    };
    return (
        <Layout>
            <Header>
            </Header>

            <Content
                className={styles.siteLayoutBackground}
                style={{
                    minHeight: 280,
                }}>
                <div className={styles.tabsContainer}>
                    <Form
                        style={{marginBottom: 20}}
                        layout="inline"
                        onFinish={onFinishClass}
                        form={formClass}
                    >
                        <Form.Item label="Номер класу" name='classNumber'>
                            <InputNumber placeholder={10} style={{maxWidth: 70}} min={1} max={12}/>
                        </Form.Item>

                        <Form.Item label="Буква класу" name='classLetter'>
                            <Input maxLength={2} placeholder={'A'} style={{maxWidth: 60}}/>
                        </Form.Item>

                        <Form.Item label="Класний керівник" name='teacher'>
                            <SearchedSelect children={teachers}  style={{minWidth: 350}} placeholder={'Оберіть вчителя...    '}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">Створити новий клас</Button>
                        </Form.Item>
                    </Form>

                    <Form
                        style={{marginBottom: 20}}
                        name={'newClassTeacher'}
                        onFinish={onFinishTeacher}
                        layout="inline"
                        form={formTeacher}
                    >
                        <Form.Item label="Клас" name='class'>
                            <SearchedSelect children={filteredClasses}
                                            style={{minWidth: 100}}
                                            placeholder={'Оберіть клас...    '}
                            />
                        </Form.Item>

                        <Form.Item label="Класний керівник" name='teacher'>
                            <SearchedSelect children={teachers}  style={{minWidth: 350}} placeholder={'Оберіть вчителя...    '}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">Призначити класного керівника</Button>
                        </Form.Item>
                    </Form>

                    <AppointmentTable columns={columns} data={classes}/>
                </div>
            </Content>
        </Layout>
    );
}

export default Classes;
