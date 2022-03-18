import {connect, useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import Loader from "../Loader";
import {Layout, Form, Input, Button, Space, Select, Table} from 'antd';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import styles from "./Subjects.module.css";
import React, {useEffect, useState} from "react";
import {getPlans, updateSubject} from "../../redux/teacherReducer";
import {useFetching} from "../../hooks/useFetchingDispatch.hook";

const {Header, Content} = Layout;
const {Option} = Select;

const Subject = ({subject, studyPlans = []}) => {
    const [form] = Form.useForm();
    const {fetching, loading} = useFetching();
    const typesEvents = useSelector(state => state.teacher.typesEvents);
    const [activeEvents, setActiveEvents] = useState([]);

    useEffect(() => {
        const studyPlan = studyPlans.find(plan => plan.id === subject.study_plan_id);
        form.setFieldsValue({
            study_plan: subject.study_plan_id,
            link: subject.link,
            other_materials: subject.other_materials,
            other: subject.other,
        });
        if (studyPlan) setActiveEvents(studyPlan.events);
    }, [subject]);

    const onFinish = (values) => {
        console.log("Цілий предмет: ", subject);
        fetching(updateSubject, {...values, id: subject.id});
    };
    console.log(typesEvents);
    const studyPlansSelect = studyPlans.map(plan => <Option key={plan.id} value={plan.id}>{plan.name}</Option>);

    const onSelectChange = value => {
        const studyPlan = studyPlans.find(plan => plan.id === value);
        console.log(studyPlan.events);
        setActiveEvents(studyPlan.events);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const title = `${subject.class_name}-${subject.class_letter} ${subject.name}`;

    const typeEventsFilter = typesEvents.map(type => {
        return {
            text: type.type,
            value: type.id
        }
    });
    //Table
    const columns = [
        { title: '№', dataIndex: 'order_number' },
        { title: 'Тема', dataIndex: 'name' },
        { title: 'Скорочення', dataIndex: 'short_name'},
        {
            title: 'Тип',
            dataIndex: 'id_type_event',
            render: (text) => {
                return typesEvents.find(item => item.id === text).type
            },
            filters: typeEventsFilter,
            onFilter: (value, record) => record.id_type_event === value,
        },
        { title: 'Примітки', dataIndex: 'age' },
    ];
    /*  id: 74
        id_type_event: 13
        name: "Тест"
        notes: null
        order_number: 1
        short_name: "Тест"*/
    // const data = [
    //     {
    //         key: '1',
    //         name: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //     },
    //     {
    //         key: '2',
    //         name: 'Jim Green',
    //         age: 42,
    //         address: 'London No. 1 Lake Park',
    //     },
    //     {
    //         key: '3',
    //         name: 'Joe Black',
    //         age: 32,
    //         address: 'Sidney No. 1 Lake Park',
    //     },
    //     {
    //         key: '4',
    //         name: 'Jim Red',
    //         age: 32,
    //         address: 'London No. 2 Lake Park',
    //     },
    // ];
    console.log(studyPlans);

    return (
        <Layout>
            <Header></Header>
            <Content className={styles.form}>
                <h1 className={styles.title}>{title}</h1>
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 15,
                    }}
                >
                    <Form.Item label="Опис дисципліни" name="other">
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Навчальний план" name="study_plan">
                        <Select placeholder="Натисніть щоб обрати навчальний план..." onChange={onSelectChange}>
                            {studyPlansSelect}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Посилання на заняття:" name="link"
                        rules={[
                            {
                                type: "url",
                                message: 'Введене значення не є посиланням',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Посилання на матеріали:" name="other_materials">
                        <Input/>
                    </Form.Item>

                    <Form.Item


                    >
                        <Button className={styles.btn_wrap} type="primary" htmlType="submit">
                            Зберегти
                        </Button>

                    </Form.Item>


                    {/*<Form.List name="events">*/}
                    {/*    {(fields, {add, remove, move}) => (*/}
                    {/*        <>*/}
                    {/*            {fields.map(({key, name, ...restField}, index) => (*/}

                    {/*                <Space key={key} style={{display: 'flex'}} align="baseline">*/}
                    {/*                    <Form.Item*/}
                    {/*                        label="Тема"*/}
                    {/*                        {...restField}*/}
                    {/*                        name={[name, 'name']}*/}
                    {/*                        rules={[{required: true, message: 'Missing first name'}]}*/}
                    {/*                    >*/}
                    {/*                    </Form.Item>*/}

                    {/*                    <Form.Item*/}
                    {/*                        label="Скорочення"*/}
                    {/*                        {...restField}*/}
                    {/*                        name={[name, 'short_name']}*/}
                    {/*                        tooltip="Для відображення в журналі оцінок"*/}
                    {/*                        rules={[{message: 'Missing last name'}]}*/}
                    {/*                    >*/}
                    {/*                        <Input style={{maxWidth: '80px'}}/>*/}

                    {/*                    </Form.Item>*/}
                    {/*                    /!*<Tooltip title="Для відображення в журналі оцінок">*!/*/}
                    {/*                    /!*    <QuestionOutlined />*!/*/}
                    {/*                    /!*</Tooltip>*!/*/}
                    {/*                    <Form.Item*/}
                    {/*                        label="Тип"*/}
                    {/*                        {...restField}*/}
                    {/*                        name={[name, 'id_type_event']}*/}
                    {/*                        rules={[{required: true, message: 'Missing last name'}]}*/}
                    {/*                    >*/}
                    {/*                        <Select placeholder={'Оберіть тип роботи:'} style={{width: 190}}>*/}
                    {/*                            {typeEventsSelect}*/}
                    {/*                        </Select>*/}

                    {/*                    </Form.Item>*/}
                    {/*                    <Form.Item*/}
                    {/*                        label="Примітки"*/}
                    {/*                        {...restField}*/}
                    {/*                        name={[name, 'notes']}*/}
                    {/*                    >*/}
                    {/*                        <Input/>*/}
                    {/*                    </Form.Item>*/}
                    {/*                    <MinusCircleOutlined onClick={() => remove(name)}/>*/}
                    {/*                    /!*<MinusCircleOutlined onClick={() => move(index, ++index)} />*!/*/}
                    {/*                    <ArrowUpOutlined onClick={() => move(index, --index)}/>*/}
                    {/*                    <ArrowDownOutlined onClick={() => move(index, ++index)}/>*/}
                    {/*                </Space>*/}
                    {/*            ))}*/}
                    {/*            /!*<Form.Item>*!/*/}
                    {/*            /!*    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>*!/*/}
                    {/*            /!*        Додати захід*!/*/}
                    {/*            /!*    </Button>*!/*/}
                    {/*            /!*</Form.Item>*!/*/}
                    {/*        </>*/}
                    {/*    )}*/}
                    {/*</Form.List>*/}

                </Form>
                <div className={styles.table}>
                    <h2>План заходів: </h2>
                    <Table columns={columns}
                           size={'middle'}
                           dataSource={activeEvents}
                           locale={{filterReset: 'Скинути', emptyText: 'Немає даних'}}
                    />
                </div>

            </Content>
        </Layout>
    );
}

export const SubjectTeacher = () => {
    const dispatch = useDispatch();
    const id = useParams().subjectId;
    const subjects = useSelector(state => state.teacher.subjects);
    const studyPlans = useSelector(state => state.teacher.studyPlans);
    useEffect(() => {
        if (!studyPlans) {
            dispatch(getPlans());
        }
    }, [])
    if (!subjects || !studyPlans) {
        return <Loader/>
    }
    const subject = subjects.find(item => item.id == id);
    const studyPlanForClass = studyPlans
        .filter(plan => plan.class_number === subject.class_name)
        .map(plan => {
            return {
                ...plan, events: plan.events
                    .map(item => {
                        return {...item, key: item.id}
                    })
            }
        });
    console.log(studyPlanForClass);
    return <Subject subject={subject} studyPlans={studyPlanForClass}/>
}


