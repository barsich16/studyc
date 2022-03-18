import React, {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Layout, Select, Space, Divider, Typography} from "antd";
import styles from "./StudyPlans.module.css";
import {ArrowDownOutlined, ArrowUpOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deletePlan, getPlans, updatePlans} from "../../redux/teacherReducer";
import {useFetching} from "../../hooks/useFetchingDispatch.hook";

const {Header, Content} = Layout;
const {Option, OptGroup} = Select;

const StudyPlans = () => {

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {fetching, loading} = useFetching();
    const [activePlan, setActivePlan] = useState(null);
    const plans = useSelector(state => state.teacher.studyPlans);
    const [studyPlans, setStudyPlans] = useState(null);
    useEffect(() => {
        setStudyPlans(plans)
    }, [plans]);
    const typesEvents = useSelector(state => state.teacher.typesEvents);

    let options = [];
    const newOptions = [];
    if (studyPlans) {
        const arrayForMaping = studyPlans.slice();
        arrayForMaping.sort((a,b) => {return a.class_number - b.class_number});
        while(arrayForMaping.length > 0) {
            const elements = arrayForMaping.filter(elem => elem.class_number === arrayForMaping[0].class_number);
            const newOpt = elements.map(plan => {
                return <Option key={plan.id} value={plan.id}>{plan.name}</Option>
            });
            const groupLabel = arrayForMaping[0].class_number
                ? `${arrayForMaping[0].class_number} клас`
                : 'Не збережені'
            newOptions.push(
                <OptGroup key={groupLabel} label={groupLabel}>
                    {newOpt}
                </OptGroup>
            )
            arrayForMaping.splice(0, elements.length);
        }
        // for (const arrayForMapingElement of arrayForMaping) {
        //     const elements = arrayForMaping.filter(elem => elem.class_number === arrayForMapingElement.class_number);
        //
        // }
        // options = studyPlans.map(plan => {
        //     return <Option key={plan.id} value={plan.id}>{plan.name}</Option>
        // })
    }


    const [nameNewPlan, setNameNewPlan] = useState('');
    const onNameChange = event => {
        setNameNewPlan(event.target.value);
    };
    let index = 0;

    const addItem = e => {
        e.preventDefault();
        setStudyPlans([...studyPlans, {id: nameNewPlan, isPlanNew: true, name: nameNewPlan || `Навчальний план ${index++}`}]);
        setNameNewPlan('');
    };

    useEffect(() => {
        if (!studyPlans) {
            dispatch(getPlans());
        }
    }, [])
    const onFinish = (values) => {
        values.id = activePlan.id;
        if (activePlan.isPlanNew) {
            values.isPlanNew = true;
        }
        if (!values.events) {
            values.events = null;
        } else {
            values.events.forEach((item, index) => {
                item.order_number = index+= 1;
            });
        }

        fetching(updatePlans, values);
    };
    const deletePlanHandler = () => {
        if (activePlan.isPlanNew) {
            const newStudyPlans = studyPlans.filter(plan => plan.id !== activePlan.id);
            setStudyPlans(newStudyPlans);
        } else {
            fetching(deletePlan, activePlan.id);
        }
        form.setFieldsValue({
            name: null,
            class_number: null,
            events: null
        });
    }
    //TODO: видалення навчального плану, форматувати вивід подій в предметах, рефактор планів

    const selects = typesEvents.map(type => {
        return <Option key={type.id} value={type.id}>{type.type}</Option>
    })
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleChange = value => {
        const plan = studyPlans.find(item => item.id === value);
        setActivePlan(plan);
        form.setFieldsValue({
            name: plan.name,
            class_number: plan.class_number,
            events: plan.events
        });
    }

    return (
        <Layout>
            <Header></Header>
            <Content>
                <h1 className={styles.title}>Навчальні плани</h1>
                <Form
                    name="plans"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className={styles.form}
                    // labelCol={{
                    //     span: 6,
                    // }}
                    // wrapperCol={{
                    //     span: 15,
                    // }}
                >
                    <Space style={{display: 'flex'}} align="baseline">
                        <Form.Item
                            label="Назва:" name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Оберіть навчальний план..."
                                style={{minWidth: 300}}
                                onChange={handleChange}
                                dropdownRender={menu => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space align="center" style={{ padding: '0 8px 4px' }}>
                                            <Input placeholder="Введіть назву навчального плану" value={nameNewPlan} onChange={onNameChange} />
                                            <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                                                <PlusOutlined /> Додати
                                            </Typography.Link>
                                        </Space>
                                    </>
                                )}>
                                {studyPlans && newOptions}
                                {/*<Option value='1'>Скорочений</Option>*/}
                                {/*<Option value='2'>Повний загальний</Option>*/}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Клас:" name="class_number"
                            rules={[{required: true, message: 'Клас є обов\'язковим!'},]}
                        >
                            <InputNumber min={1} max={12}/>
                        </Form.Item>
                    </Space>


                    <h3>План заходів: </h3>
                    <Form.List name="events">
                        {(fields, {add, remove, move}) => (
                            <>
                                {fields.map(({key, name, ...restField}, index) => (

                                    <Space key={key} style={{display: 'flex'}} align="baseline">
                                        <Form.Item
                                            label="Тема"
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{required: true, message: 'Missing first name'}]}
                                        >
                                            <Input placeholder="Назва заходу"/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Скорочення"
                                            {...restField}
                                            name={[name, 'short_name']}
                                            tooltip="Для відображення в журналі оцінок"
                                            rules={[{message: 'Missing last name'}]}
                                        >
                                            <Input style={{maxWidth: '80px'}}/>

                                        </Form.Item>
                                        {/*<Tooltip title="Для відображення в журналі оцінок">*/}
                                        {/*    <QuestionOutlined />*/}
                                        {/*</Tooltip>*/}
                                        <Form.Item
                                            label="Тип"
                                            {...restField}
                                            name={[name, 'id_type_event']}
                                            rules={[{ required: true, message: 'Missing last name' }]}
                                        >
                                            <Select placeholder={'Оберіть тип роботи:'} style={{ width: 190 }}>
                                                {selects}
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                            label="Примітки"
                                            {...restField}
                                            name={[name, 'notes']}
                                        >
                                            <Input/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                        {/*<MinusCircleOutlined onClick={() => move(index, ++index)} />*/}
                                        <ArrowUpOutlined onClick={() => move(index, --index)}/>
                                        <ArrowDownOutlined onClick={() => move(index, ++index)}/>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button disabled={!activePlan} type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
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
                        <Button type="primary" htmlType="submit" disabled={!activePlan}>
                            Зберегти поточний план
                        </Button>
                        <Button
                            type="primary"
                            style={{marginLeft: 3}}
                            danger
                            disabled={!activePlan}
                            onClick={deletePlanHandler}>
                            Видалити поточний план
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

export default StudyPlans;
