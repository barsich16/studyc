import React, {useState} from 'react';
import {Avatar, Layout} from 'antd';
import {UserOutlined} from "@ant-design/icons";
import styles from "./Settings.module.css"
import {Form, Input, Select, Button,} from 'antd';
import {connect} from "react-redux";
import {updateProfile} from "../../redux/userReducer";
import {useFetching} from "../../hooks/useFetching.hook";

const {Header, Content} = Layout
const {Option} = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 15 },
        sm: { span: 6},
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
};


const Settings = ({updateProfile, profile}) => {
    const [form] = Form.useForm();
    const {fetching} = useFetching();
    console.log("Profile:", profile);
    const initialValues = {
        surname: profile.surname || '',
        name: profile.name || '',
        email: profile.email,
        patronymic: profile.patronymic || '',
        phone: profile.phone || '',
        gender: profile.gender || ''
    }
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);


    const onFinish = (values) => {
        values.phone = '+380' + values.phone;
        fetching(updateProfile, values);
    };

    const changePass = (password) => {
        password.target.value.length > 0 ? setIsPasswordEntered(true) : setIsPasswordEntered(false);
    }

    return (
        <Layout>
            <Header></Header>
            <Content>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="profileForm"
                    onFinish={onFinish}
                    initialValues={initialValues}
                    scrollToFirstError
                    className={styles.form}
                >
                    {/*<Avatar size={64} icon={<UserOutlined/>}/>*/}
                    {/*<Form.Item label="Клас">*/}
                    {/*    <span className="ant-form-text">10-A</span>*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        name="surname"
                        label="Прізвище"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Ім'я"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="patronymic"
                        label="По батькові"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Стать"
                    >
                        <Select placeholder="оберіть свою стать">
                            <Option value="male">Чоловіча</Option>
                            <Option value="female">Жіноча</Option>
                            <Option value="other">Інша</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            { type: 'email', message: 'Некоректний E-mail!' },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        onChange={changePass}
                        name="password"
                        label="Новий пароль"
                        rules={[
                            { min: 6, message: 'Пароль повинен мати більше 5 символів' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Підтвердити пароль"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: isPasswordEntered,
                                message: 'Введіть пароль ще раз',
                            },

                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error('Паролі не співпадають!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Номер телефону"
                    >
                        <Input
                            addonBefore="+380"
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="intro"
                        label="Додаткова інформація"
                    >
                        <Input.TextArea maxLength={100}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Зберегти
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

const mapState = state => ({
    profile: state.user.profile
});

export default connect(mapState, {updateProfile})(Settings);
