import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import Loader from "../Loader";
import { Layout, Form, Input, Button, Checkbox, Space} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from "./Subjects.module.css";
import React from "react";
const {Header, Content} = Layout;


// class: {id: 2, name: "10-А", teacherId: 1}
// events: [{id: 1, name: "Контрольна 1", shortName: "КР1"}, {id: 2, name: "Контрольна 2", shortName: "КР2"},…]
// id: 1
// link: ""
// name: "Математика"
// studyPlan: {id: 1, name: "Основний", teacherId: 2, classNumber: 10}

const Subject = ({subjects}) => {
    const id = useParams().subjectId;
    if (!subjects) {
        return <Loader />
    }
    const subject = subjects.find(item => item.id == id);

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Layout>
            <Content>
                <h1 className={styles.title}>{`${subject.class.name} ${subject.name}`}</h1>
                <Form
                    name="basic"
                    // labelCol={{
                    //     span: 5,
                    // }}
                    // wrapperCol={{
                    //     span: 10,
                    // }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className={styles.form}
                >
                    <Form.Item
                        label="Посилання на заняття:"
                        // wrapperCol={{
                        //     span: 10,
                        // }}
                        name="link"
                        rules={[
                            {
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Посилання на додаткові матеріали:"
                        // wrapperCol={{
                        //     span: 10,
                        // }}
                        name="link"
                        rules={[
                            {
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <h4>План заходів: </h4>
                    <Form.List  name="users">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            label="Назва"
                                            {...restField}
                                            name={[name, 'first']}
                                            rules={[{ required: true, message: 'Missing first name' }]}
                                        >
                                            <Input placeholder="Назва заходу" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Скорочення"
                                            {...restField}
                                            name={[name, 'last']}
                                            rules={[{ message: 'Missing last name' }]}
                                        >
                                            <Input placeholder="Скорочення заходу" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
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
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

const mapState = state => ({
    subjects: state.teacher.subjects,
})

export const SubjectTeacher = connect(mapState, {})(Subject);
