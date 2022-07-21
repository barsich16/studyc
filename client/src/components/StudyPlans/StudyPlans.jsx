import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, Layout, Select, Space, Divider, Typography, Radio} from "antd";
import styles from "./StudyPlans.module.css";
import {ArrowDownOutlined, ArrowUpOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {useFetching} from "../../hooks/useFetching.hook";
import {getChangedEvents, sortPlansBySemester} from "../../common/sortFunctions";
import {useActions} from "../../hooks/useActions";
import {CopyPlanModal} from "./CopyPlanModal";
import Loader from "../Loader";
import usePrompt from "../../hooks/usePrompt.hook";
import {message} from "antd";
import {InputWithTooltip} from "../common/InputWithTooltip";

const {Header, Content} = Layout;
const {Option, OptGroup} = Select;

const StudyPlans = ({plans, typesEvents}) => {
    const [form] = Form.useForm();
    const {fetching} = useFetching();
    const {updatePlans, deletePlan} = useActions();
    const isUnsavedChanges = useRef(false);
    usePrompt("Ви дійсно хочете піти? Всі незбережені дані буде утрачено", isUnsavedChanges.current);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activePlan, setActivePlan] = useState(null);
    const [studyPlans, setStudyPlans] = useState(plans);
    const [nameNewPlan, setNameNewPlan] = useState('');

    const generateStudyPlansOptions = (studyPlans) => {
        let options = [];

        const arrayForMaping = studyPlans.slice();
        arrayForMaping.sort((a, b) => {
            return a.class_number - b.class_number
        });

        while (arrayForMaping.length > 0) {
            const elements = arrayForMaping.filter(elem => elem.class_number === arrayForMaping[0].class_number);
            const newOpt = elements.map(plan => {
                return <Option key={plan.id} value={plan.id}>{plan.name}</Option>
            });

            const groupLabel = arrayForMaping[0].class_number
                ? `${arrayForMaping[0].class_number} клас`
                : 'Не збережені'
            options.push(
                <OptGroup key={groupLabel} label={groupLabel}>
                    {newOpt}
                </OptGroup>
            )
            arrayForMaping.splice(0, elements.length);
        }
        return options;
    };

    const generatedOptions = React.useMemo(() => generateStudyPlansOptions(studyPlans), [plans, studyPlans]);
    const selects = typesEvents.map(type => {
        return <Option key={type.id} value={type.id}>{type.type}</Option>
    })

    //Props for CopyPlanModal
    const closeModal = React.useCallback(() => setIsModalVisible(false), []);
    const confirmChoose = React.useCallback(copyPlanId => {
        const plan = studyPlans.find(item => item.id === copyPlanId);
        form.setFieldsValue({events: plan.events});
    }, []);
    const filterStudyPlans = React.useCallback(studyPlan => generateStudyPlansOptions(studyPlan), []);

    //Handlers
    const handleYearChange = event => {
        const filteredStudyPlans = plans.filter(plan => plan.year === event);
        setStudyPlans(filteredStudyPlans);
    }

    const defaultAutoIncrement = useRef(0);
    const addItem = e => {
        e.preventDefault();
        const today = new Date();
        setStudyPlans([...studyPlans, {
            id: nameNewPlan,
            isPlanNew: true,
            name: nameNewPlan || `Навчальний план ${defaultAutoIncrement.current++}`,
            year: today.getFullYear(),
        }]);
        setNameNewPlan('');
        isUnsavedChanges.current = true;
    };

    const onFinish = (values) => {
        if (values.events) {
            values.events.sort(sortPlansBySemester);
            values.events
                .forEach((item, index) => {
                item.order_number = index += 1;
            });
            if (activePlan.isPlanNew || !activePlan.events) { // якщо план новий або пустий, то можуть бути лише додані події
                values.events = {addedEvents: values.events}
            } else {
                values.events = getChangedEvents(activePlan.events, values.events);
            }
        }
        const requestData = {
            ...values,
            id: activePlan.id,
            year: activePlan.year,
            isPlanNew: activePlan.isPlanNew,
            study_plan_id: activePlan.study_plan_id,
        }
        isUnsavedChanges.current = false;
    };

    const deletePlanHandler = () => {
        const newStudyPlans = studyPlans.filter(plan => plan.id !== activePlan.id);
        setStudyPlans(newStudyPlans);
        fetching(deletePlan, activePlan.id);

        form.setFieldsValue({
            name: null,
            class_number: null,
            events: null,
            cabinet: null,
        });
        isUnsavedChanges.current = false;
    }

    const selectStudyPlanChange = value => {
        const plan = studyPlans.find(item => item.id === value);
        setActivePlan(plan);
        form.setFieldsValue({
            name: plan.name,
            class_number: plan.class_number,
            events: plan.events,
            cabinet: plan.cabinet,
        });
    }

    return (
        <>
            <Header/>
            <Content>
                <h1 className={styles.title}>Навчальні плани</h1>
                <Form
                    name="plans"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={() => message.error('Форма заповнена некоректно!')}
                    autoComplete="off"
                    className={styles.form}
                >
                    <Space style={{display: 'flex'}} align="baseline">
                        <Form.Item label="Рік:" name="year">
                            <Select
                                placeholder="Оберіть рік..."
                                style={{minWidth: 130}}
                                onChange={handleYearChange}
                            >
                                <Option value={2021}>2021</Option>
                                <Option value={2022}>2022</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Назва:" name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Оберіть навчальний план!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Оберіть навчальний план..."
                                style={{minWidth: 300}}
                                onChange={selectStudyPlanChange}
                                dropdownRender={menu => (
                                    <>
                                        {menu}
                                        <Divider style={{margin: '8px 0'}}/>
                                        <Space align="center" style={{padding: '0 8px 4px'}}>
                                            <Input placeholder="Введіть назву навчального плану" value={nameNewPlan}
                                                   onChange={event => setNameNewPlan(event.target.value)}/>
                                            <Typography.Link onClick={addItem} style={{whiteSpace: 'nowrap'}}>
                                                <PlusOutlined/> Додати
                                            </Typography.Link>
                                        </Space>
                                    </>
                                )}>
                                {studyPlans && generatedOptions}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Клас:" name="class_number"
                            rules={[{required: true, message: 'Клас є обов\'язковим!'},]}
                        >
                            <InputNumber min={1} max={12}/>
                        </Form.Item>

                        <Form.Item label="Кабінет:" name="cabinet">
                            <Input placeholder="438-A"/>
                        </Form.Item>
                    </Space>

                    <h3>План заходів: </h3>
                    <Form.List name="events">
                        {(fields, {add, remove, move}) => (
                            <>
                                {fields.map(({key, name, ...restField}, index) => (
                                    <Space key={key} style={{display: 'flex', justifyContent: 'space-between'}} align="baseline">
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
                                            <Input style={{maxWidth: '70px'}}/>
                                        </Form.Item>

                                        <Form.Item
                                            label="Тип"
                                            {...restField}
                                            name={[name, 'id_type_event']}
                                            rules={[{required: true, message: 'Missing last name'}]}
                                        >
                                            <Select placeholder={'Оберіть тип роботи:'} style={{width: 190}}>
                                                {selects}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Примітки"
                                            {...restField}
                                            name={[name, 'notes']}
                                        >
                                            <InputWithTooltip />
                                        </Form.Item>

                                        <Form.Item
                                            name={[name, 'semester']}
                                            label="Семестр"
                                            {...restField}
                                        >
                                            <Radio.Group style={{display: 'flex'}}>
                                                <Radio value={1}>1</Radio>
                                                <Radio value={2}>2</Radio>
                                            </Radio.Group>
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                        <ArrowUpOutlined onClick={() => move(index, --index)}/>
                                        <ArrowDownOutlined onClick={() => move(index, ++index)}/>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button disabled={!activePlan} type="dashed" onClick={() => add()} block
                                            icon={<PlusOutlined/>}>
                                        Додати захід
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={!activePlan}>
                            Зберегти поточний план
                        </Button>
                        <Button
                            type="primary"
                            style={{marginLeft: 3}}
                            disabled={!activePlan}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Скопіювати існуючий план
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
                <CopyPlanModal
                    isModalVisible={isModalVisible}
                    confirmChoose={confirmChoose}
                    closeModal={closeModal}
                    generateOptions={filterStudyPlans}
                    allPlans={plans}
                />
            </Content>
        </>
    );
}

const StudyPlansContainer = () => {
    const {getPlans, getTypesEvents} = useActions();
    const plans = useSelector(state => state.teacher.studyPlans);
    const typesEvents = useSelector(state => state.teacher.typesEvents);

    useEffect(() => {
        if (!Array.isArray(plans)) {
            console.log("Dispatch")
            getPlans();
        }
    }, []);

    useEffect(() => {
        if (!typesEvents) {
            console.log("Запросили типи");
            getTypesEvents();
        }
    }, []);

    if (!plans || !typesEvents) {
        return <>
            <Loader/>
        </>
    }

    return <StudyPlans plans={plans} typesEvents={typesEvents}/>
}
export default StudyPlansContainer;
