import {Form, Modal, Select, Space} from "antd";
import styles from "./StudyPlans.module.css";
import React, {useState} from "react";
const {Option} = Select;

export const CopyPlanModal = React.memo(({isModalVisible, confirmChoose, closeModal, generateOptions, allPlans}) => {
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [studyPlans, setStudyPlans] = useState(allPlans);
    const func = generateOptions(studyPlans);

    const onSelectPlanChange = value => {
        setSelectedPlanId(value);
    }

    const onYearChange = value => {
        const filteredStudyPlans = allPlans.filter(plan => plan.year === value);
        setStudyPlans(filteredStudyPlans);
    }

    const onFinish = () => {
        if (selectedPlanId) {
            confirmChoose(selectedPlanId);
        }
        closeModal();
    }

    return (
        <Modal title="Оберіть існуючий навчальний план"
               visible={isModalVisible}
               onOk={onFinish}
               onCancel={closeModal}>
            <Form
                name="modalPlans"
                autoComplete="off"
                className={styles.modalForm}
            >
                <Space style={{display: 'flex'}} align="baseline">
                <Form.Item
                    label="Рік:" name="year"
                >
                    <Select
                        placeholder="Оберіть рік..."
                        style={{minWidth: 130}}
                        onChange={onYearChange}
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
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Оберіть навчальний план..."
                        style={{minWidth: 300}}
                        onChange={onSelectPlanChange}
                    >
                        {func}
                    </Select>
                </Form.Item>
                </Space>
            </Form>
        </Modal>
    );
})
