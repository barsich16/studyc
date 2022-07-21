import {Button, Form, Input, Layout, Modal, Radio} from "antd";
import {useState} from 'react';
import styles from './MainPage.module.css'
import {connect} from "react-redux";
import {fullLogin} from "../redux/userReducer";
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useFetching} from "../hooks/useFetching.hook";
import {register} from "../redux/userReducer";
import {createSchool} from "../redux/adminReducer";

const {Header, Footer, Content} = Layout;

const Intro = ({register, fullLogin, createSchool}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelectedLogin, setIsSelectedLogin] = useState(false);
    const [isSelectedCreating, setIsSelectedCreating] = useState(false);

    const showModalFromLogin = () => {
        setIsSelectedLogin(true);
        setIsModalVisible(true);
    };
    const showModalFromRegister = () => {
        setIsSelectedLogin(false)
        setIsModalVisible(true);
        setIsSelectedCreating(false);
    };
    const showModalFromCreatingSchool = () => {
        setIsSelectedLogin(false)
        setIsModalVisible(true);
        setIsSelectedCreating(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <span className={styles.logo}>
                    Studyc
                </span>
                <div className="loginButtons">
                    <Button type="primary" size={'large'} onClick={showModalFromLogin} className={styles.headerButton}>
                        Вхід
                    </Button>
                    <Button type="primary" size={'large'} onClick={showModalFromRegister}
                            className={styles.headerButton}>
                        Реєстрація
                    </Button>
                    <Button type="primary" size={'large'} onClick={showModalFromCreatingSchool} className={styles.headerButton}>
                        Створити школу
                    </Button>
                </div>
            </Header>
            <Content className={styles.content} />
            <Footer className={styles.footer}>footer</Footer>
            <Modal onCancel={handleCancel}
                   bodyStyle={{padding: 0}}
                   style={{}}
                   width={768}
                   footer={null}
                   className= 'mainpage-modal'
                   visible={isModalVisible}>
                <div className={`${styles.container} ${isSelectedLogin ? "" : styles.rightPanelActive}`} id="container">
                    {/*реєстрація*/}
                    <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                        {isSelectedCreating
                        ? <SchoolForm createSchool={createSchool}/>
                        : <RegistrationForm register={register} />}

                    </div>
                    {/*вхід*/}
                    <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                        <LoginForm login={fullLogin}/>
                    </div>

                    <div className={styles.overlayContainer}>
                        <div className={styles.overlay}>
                            {/*бокова при реєстрації*/}
                            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                                <h1>З поверненням!</h1>
                                <p>Увійди в свій персональний аккаунт щоб отримати доступ до платформи</p>
                                <button className={styles.ghost} onClick={() => {
                                    setIsSelectedLogin(true)
                                }}>Увійти
                                </button>
                            </div>
                            {/*бокова при логіні*/}
                            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                                <h1>Привіт!</h1>
                                <p>Зареєструйся щоб почати використовувати платформу</p>
                                <button className={styles.ghost} onClick={() => {
                                    setIsSelectedLogin(false);
                                    setIsSelectedCreating(false);
                                }}>Зареєструватися
                                </button>
                                <button className={styles.ghost} onClick={() => {
                                    setIsSelectedLogin(false);
                                    setIsSelectedCreating(true);
                                }}>Створити школу
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}

const SchoolForm = ({createSchool}) => {
    const {fetching} = useFetching();

    const creatingSchoolHandler = (values) => {
        fetching(createSchool, values);
    };

    return <div className={styles.formInner}>
        <h1>Створити школу</h1>
        <Form
            name="creatingSchool"
            className={`${styles.registerForm} formreg`}
            labelCol={{
                span: 10,
            }}
            wrapperCol={{
                span: 25,
            }}
            onFinish={creatingSchoolHandler}
        >
            <Form.Item
                name="email"
                rules={[
                    {required: true, message: 'Введіть ваш email'},
                    {type: 'email', message: 'Некоректний email'},
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Email"/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {required: true, message: 'Введіть пароль'},
                    {min: 6, message: 'Пароль повинен мати більше 5 символів'},
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    placeholder="Пароль"
                    iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                />
            </Form.Item>

            <Form.Item
                name="surname"
                rules={[ {required: true, message: 'Введіть ваш email'} ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Прізвище"/>
            </Form.Item>

            <Form.Item
                name="name"
                rules={[ {required: true, message: 'Введіть ваш email'} ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Ім'я"/>
            </Form.Item>

            <Form.Item
                name="schoolName"
                rules={[ {required: true, message: 'Введіть назву школи'} ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Назва школи"/>
            </Form.Item>

            <Form.Item
                name="schoolRegion"
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Населений пункт"/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Створити
                </Button>
            </Form.Item>
        </Form>
    </div>
}

const RegistrationForm = ({register}) => {
    const {fetching} = useFetching();
    const [radioValue, setRadioValue] = useState('pupil');

    const onRadioChange = e => {
        setRadioValue(e.target.value);
    };

    const registerHandler = (values) => {
        fetching(register, values);
    };

    return <div className={styles.formInner}>
        <h1>Створити аккаунт</h1>
        <Form
            name="registration"
            className={`${styles.registerForm} formreg`}
            labelCol={{
                span: 10,
            }}
            wrapperCol={{
                span: 25,
            }}
            onFinish={registerHandler}
            initialValues={{
                role: 'pupil'
            }}
        >
            <Form.Item
                name="email"
                rules={[
                    {required: true, message: 'Введіть ваш email'},
                    {type: 'email', message: 'Некоректний email'},
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Username"/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {required: true, message: 'Введіть пароль'},
                    {min: 6, message: 'Пароль повинен мати більше 5 символів'},
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    placeholder="input password"
                    iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                />
            </Form.Item>

            <Form.Item
                name="surname"
                rules={[
                    {required: true, message: 'Введіть ваш email'},
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Прізвище"/>
            </Form.Item>

            <Form.Item
                name="name"
                rules={[
                    {required: true, message: 'Введіть ваш email'},
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Ім'я"/>
            </Form.Item>

            <Form.Item name="role">
                <Radio.Group onChange={onRadioChange} value={radioValue}>
                    <Radio value={'pupil'}>Учень</Radio>
                    <Radio value={'teacher'}>Вчитель</Radio>
                    <Radio value={'headteacher'}>Завуч</Radio>
                </Radio.Group>
            </Form.Item>
            {radioValue === 'pupil'
                ? <Form.Item
                    name="code"
                    rules={[
                        {required: true, message: 'Введіть код отриманий у вчителя'}
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder= 'Код класу'/>
                </Form.Item>
                : <Form.Item
                    name="code"
                    rules={[
                        {required: true, message: 'Введіть код отриманий у керівництва школи'}
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder='Код школи'/>
                </Form.Item>}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Зареєструватися
                </Button>
            </Form.Item>
        </Form>

    </div>
}

const LoginForm = ({login}) => {
    const {fetching} = useFetching();
    const loginHandler = (values) => {
        fetching(login, values);
    };

    return <div className={styles.formInner}>
        <h1>Увійти в аккаунт</h1>

        <Form
            name="login"
            className={styles.registerForm}
            size='large'
            labelCol={{
                span: 10,
            }}
            wrapperCol={{
                span: 25,
            }}
            onFinish={loginHandler}
        >
            <Form.Item
                name="email"
                rules={[
                    {required: true, message: 'Введіть ваш email'},
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Username"/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {required: true, message: 'Введіть пароль'},
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    placeholder="input password"
                    iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Увійти
                </Button>
            </Form.Item>
        </Form>
    </div>
}
export const MainPage = connect(null, {register, fullLogin, createSchool})(Intro)
