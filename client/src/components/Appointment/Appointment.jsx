import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Input, Space} from "antd";
import styles from "./Appointment.module.css";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../../hooks/useFetchingDispatch.hook";
import {getChangedEvents} from "../../common/sortFunctions";
import Loader from "../Loader";
import usePrompt from "../../hooks/usePrompt.hook";
import {message} from "antd";
import {getAppointment, updateAppointment} from "../../redux/adminReducer";
import SearchedSelect from "../common/SearchedSelect";

const Appointment = ({appointment, teachers, classId}) => {
    const [form] = Form.useForm();
    const {fetching} = useFetching();
    const isUnsavedChanges = useRef(false);
    usePrompt("Ви дійсно хочете піти? Всі незбережені дані буде утрачено", isUnsavedChanges.current);

    const [subjects, setSubjects] = useState(appointment);

    const example = teachers.map(employee => {
        return {key: `${employee.surname} ${employee.name} ${employee.patronymic}`, value: employee.key}
    })

    useEffect(() => {
        form.setFieldsValue({
            subjects: subjects
        });
    }, []);

    const onFinish = (newValues) => {
        const changedSubjects = getChangedEvents(appointment, newValues.subjects);
        fetching(updateAppointment, {classId, changedSubjects});
        isUnsavedChanges.current = false;
    };

    return (
        <>
            <Form
                name="appointment"
                form={form}
                onFinish={onFinish}
                onFinishFailed={() => message.error('Форма заповнена некоректно!')}
                autoComplete="off"
            >
                <Form.List name="subjects">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map(({key, name, ...restField}) => (

                                <Space key={key} style={{display: 'flex', justifyContent: 'start'}} align="baseline">
                                    <Form.Item
                                        label="Назва предмету"
                                        {...restField}
                                        name={[name, 'name']}
                                        rules={[{required: true, message: 'Missing first name'}]}
                                    >
                                        <Input style={{width: 250}} placeholder='Вкажіть назву предмету...'/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Вчитель"
                                        {...restField}
                                        name={[name, 'teacher_id']}
                                        rules={[{required: true, message: 'Missing last name'}]}
                                        className={styles.teacher}
                                    >
                                        <SearchedSelect children={example}
                                                        style={{minWidth: 350}}
                                                        placeholder={'Оберіть вчителя...    '}/>
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block
                                        icon={<PlusOutlined/>}>
                                    Додати предмет
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Зберегти
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export const AppointmentContainer = React.memo(({classId}) => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.admin.employees.filter(item => item.role !== 'pupil'));
    const classInfo = useSelector(state => state.admin.appointment.find(item => item.classId === classId));

    useEffect(() => {
        if (!classInfo) {
            dispatch(getAppointment(classId));
        }
    }, []);

    if (!classInfo || !employees) {
        return <>
            <Loader/>
        </>
    }
    return <Appointment appointment={classInfo.subjects} teachers={employees} classId={classId}/>
})
