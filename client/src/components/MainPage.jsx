import {Button, Layout, Modal} from "antd";
import {useState, useEffect} from 'react';
import styles from './MainPage.module.css'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/messages.hook";
import {useDispatch} from "react-redux";
import {login} from "../redux/userReducer";
const { Header, Footer, Content } = Layout;

export const MainPage = () => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [registrationForm, setRegistrationForm] = useState({email: '', password: '', name: ''});
    const [loginForm, setLoginForm] = useState({email: '', password: ''});

    const [isSelectedLogin, setIsSelectedLogin] = useState(false);
    const {request, status, clearStatus} = useHttp();
    const message = useMessage();
    const [onRequest, setOnRequest] = useState(false);

    useEffect(() => {      //показуємо статус повідомлення реєстрації
        message(status);
        clearStatus();
    }, [status, message, clearStatus]);

    const registerHandler = async () => {  //запит на реєстрацію
        try {
            const data = await request('/api/auth/register', 'POST', {...registrationForm});
            console.log('Data: ', data);
        } catch (e) {
        }
    };
    const loginHandler = async () => {  //запит на логін
        try {
            setOnRequest(true)
            console.log(loginForm);
            const data = await request('/api/auth/login', 'POST', {...loginForm});
            dispatch(login(data.userId, data.token, data.role));
            setOnRequest(false)
            // auth.login(data.token, data.userId);
        } catch (e) {
        }
    }

    const changeRegistrationHandler = event => {   // при написанні тексту в форму реєстрації
        setRegistrationForm({...registrationForm, [event.target.name]: event.target.value});
    };
    const changeLoginHandler = event => {   // при написанні тексту в форму реєстрації
        setLoginForm({...loginForm, [event.target.name]: event.target.value});
    };
    const showModalFromLogin = () => {
        setIsSelectedLogin(true);
        setIsModalVisible(true);
    };
    const showModalFromRegister = () => {
        setIsSelectedLogin(false)
        setIsModalVisible(true);
    };
    // const handleOk = () => {
    //     setIsModalVisible(false);
    // };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <span className={styles.logo}>Logo</span>
                <div className="loginButtons">
                    <Button type="primary" size={'large'} onClick={showModalFromLogin} className={styles.headerButton}>
                        Вхід
                    </Button>
                    <Button type="primary" size={'large'} onClick={showModalFromRegister} className={styles.headerButton}>
                        Реєстрація
                    </Button>
                </div>

            </Header>
            <Content className={styles.content}>
                {/*<div className={styles.title}>Оцініть справжні переваги дистанційного навчання</div>*/}
            </Content>
            <Footer className={styles.footer}>footer</Footer>
            <Modal onCancel={handleCancel} bodyStyle={{padding: 0}} width={768} footer={null} visible={isModalVisible}>
                <div className={`${styles.container} ${isSelectedLogin ? "" : styles.rightPanelActive}`} id="container">
                    <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                        <div className={styles.formInner}>
                            <h1>Створити аккаунт</h1>
                            <input type="text" onChange={changeRegistrationHandler} name='name' placeholder="Ім'я"/>
                            <input type="email"  name='email' onChange={changeRegistrationHandler} placeholder="Email"/>
                            <input type="password" name='password' onChange={changeRegistrationHandler} placeholder="Пароль"/>
                            <button onClick={registerHandler} disabled={onRequest}>Зареєструватися</button>
                        </div>
                    </div>
                    <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                        <div className={styles.formInner}>
                            <h1>Увійти</h1>
                            <input type="email" onChange={changeLoginHandler} name='email' placeholder="Email"/>
                            <input type="password" onChange={changeLoginHandler} name='password' placeholder="Пароль"/>
                            <button onClick={loginHandler} disabled={onRequest}>Увійти</button>
                        </div>
                    </div>
                    <div className={styles.overlayContainer}>
                        <div className={styles.overlay}>
                            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                                <h1>З поверненням!</h1>
                                <p>Увійди в свій персональний аккаунт щоб отримати доступ до платформи</p>
                                <button className={styles.ghost} onClick={() => {setIsSelectedLogin(true)}}>Увійти</button>
                            </div>
                            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                                <h1>Привіт!</h1>
                                <p>Зареєструйся щоб почати використовувати платформу</p>
                                <button className={styles.ghost} onClick={() => {setIsSelectedLogin(false)}}>Зареєструватися</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}

