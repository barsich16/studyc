import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import Loader from "../Loader";
import {Layout, Form, Input, Button, Checkbox, Space, Tooltip, Select} from 'antd';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    QuestionOutlined
} from '@ant-design/icons';
import styles from "./Subjects.module.css";
import React, {useEffect, useState} from "react";
import {updateSubject} from "../../redux/teacherReducer";
import {useFetching} from "../../hooks/useFetching.hook";
const {Header, Content} = Layout;
const { Option } = Select;


// class: {id: 2, name: "10-А", teacherId: 1}
// events: [{id: 1, name: "Контрольна 1", shortName: "КР1", typeId}, {id: 2, name: "Контрольна 2", shortName: "КР2"},…]
// id: 1
// link: ""
// name: "Математика"
// studyPlan: {id: 1, name: "Основний", teacherId: 2, classNumber: 10}

const Subject = ({subject, typesEvents, updateSubject}) => {
    const [form] = Form.useForm();
    const {fetching, loading} = useFetching();
    //const [form, setForm] = useState({...subject});
    //console.log(subject);
    useEffect(() => {
        form.setFieldsValue({
            link: subject.link,
            events: subject.events
        });
    }, [subject]);
    const onFinish = (values) => {
        const request = {...values, id: subject.id};
        fetching(updateSubject, request);
        // console.log(subject);
        // console.log('Success:', request);
        //updateSubject(request);
    };

    //const {events} = form;
    const selects = typesEvents.map(type => {
        return <Option value={type.id}>{type.type}</Option>

    })
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // const changeLoginHandler = event => {   // при написанні тексту в форму реєстрації
    //     setForm({...form, [event.target.name]: event.target.value});
    // };
    return (
        <Layout>
            <Header></Header>
            <Content>
                <h1 className={styles.title}>{`${subject.class.name} ${subject.name}`}</h1>
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className={styles.form}
                >
                    <Form.Item
                        label="Посилання на заняття:" name="link"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Посилання на додаткові матеріали:" name="info"
                        rules={[ { message: 'Please input your username!', }, ]}
                    >
                        <Input />
                    </Form.Item>
                    <h3>План заходів: </h3>
                    <Form.List  name="events" >
                        {(fields, { add, remove, move }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (

                                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                                        <Form.Item
                                            label="Тема"
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Missing first name' }]}
                                        >
                                            <Input placeholder="Назва заходу" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Скорочення"
                                            {...restField}
                                            name={[name, 'shortName']}
                                            tooltip="Для відображення в журналі оцінок"
                                            rules={[{ message: 'Missing last name' }]}
                                        >
                                            <Input style={{maxWidth: '80px'}} />

                                        </Form.Item>
                                        {/*<Tooltip title="Для відображення в журналі оцінок">*/}
                                        {/*    <QuestionOutlined />*/}
                                        {/*</Tooltip>*/}
                                        <Form.Item
                                            label="Тип"
                                            {...restField}
                                            name={[name, 'typeId']}
                                            rules={[{ required: true, message: 'Missing last name' }]}
                                        >
                                            <Select placeholder={'Оберіть тип роботи:'} style={{ width: 190 }}>
                                                {selects}
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                            label="Примітки"
                                            {...restField}
                                            name={[name, 'other']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                        {/*<MinusCircleOutlined onClick={() => move(index, ++index)} />*/}
                                        <ArrowUpOutlined onClick={() => move(index, --index)}/>
                                        <ArrowDownOutlined onClick={() => move(index, ++index)}/>
                                    </Space>
                                ))}
                                <Form.Item >
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Додати захід
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item
                        wrapperCol={{
                            span: 12,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Зберегти
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

// const mapState = state => ({
//     subjects: state.teacher.subjects,
// })
const SubjectTeacherContainer = ({subjects, typesEvents, updateSubject}) => {
    const id = useParams().subjectId;
    if (!subjects) {
        return <Loader />
    }
    const subject = subjects.find(item => item.id == id);
    return <Subject subject = {subject} typesEvents={typesEvents} updateSubject={ updateSubject}/>
}


const mapState = state => ({
    subjects: state.teacher.subjects,
    typesEvents: state.teacher.typesEvents
})
export const SubjectTeacher = connect(mapState, {updateSubject})(SubjectTeacherContainer);


