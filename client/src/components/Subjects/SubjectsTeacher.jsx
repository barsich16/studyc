import {useSelector} from "react-redux";
import Loader from "../Loader";
import {Form, Input, Button, Select, Table} from 'antd';
import styles from "./Subjects.module.css";
import React, {useEffect, useState} from "react";
import {useFetching} from "../../hooks/useFetching.hook";
import {useActions} from "../../hooks/useActions";
const {Option} = Select;

const Subject = ({subject, studyPlans = []}) => {
    const [form] = Form.useForm();
    const {fetching} = useFetching();
    const {updateSubject, getTypesEvents} = useActions();
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

    useEffect(() => {
        if (!typesEvents) {
            getTypesEvents();
        }
    }, []);

    if (!typesEvents) return <Loader />;

    const onFinish = (values) => {
        fetching(updateSubject, {...values, id: subject.id});
    };
    const studyPlansSelect = studyPlans.map(plan => <Option key={plan.id} value={plan.id}>{plan.name}</Option>);

    const onSelectChange = value => {
        const studyPlan = studyPlans.find(plan => plan.id === value);
        setActiveEvents(studyPlan.events);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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

    return (
            <div className={styles.form}>
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 15 }}
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
                        rules={[{ type: "url", message: 'Введене значення не є посиланням'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Посилання на матеріали:" name="other_materials">
                        <Input/>
                    </Form.Item>

                    <Form.Item>
                        <Button className={styles.btn_wrap} type="primary" htmlType="submit">
                            Зберегти
                        </Button>
                    </Form.Item>
                </Form>

                <div className={styles.table}>
                    <h2>План заходів: </h2>
                    <Table columns={columns}
                           size={'middle'}
                           dataSource={activeEvents}
                           locale={{filterReset: 'Скинути', emptyText: 'Немає даних'}}
                    />
                </div>
            </div>
    );
}

export const SubjectTeacher = ({subject}) => {
    const {getPlans} = useActions();
    const studyPlans = useSelector(state => state.teacher.studyPlans);
    useEffect(() => {
        if (!Array.isArray(studyPlans)) {
            getPlans();
        }
    }, []);

    if (!studyPlans) {
        return <Loader/>
    }

    const studyPlanForClass = studyPlans
        .filter(plan => plan.class_number === subject.class_number)
        .map(plan => {
            return {
                ...plan, events: plan.events
                    .map(item => {
                        return {...item, key: item.id}
                    })
            }
        });
    return <Subject subject={subject} studyPlans={studyPlanForClass}/>
}
