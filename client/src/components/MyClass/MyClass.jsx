import styles from "./MyClass.module.css";
import {Layout, Table, Modal, Button} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getClass} from "../../redux/userReducer";
import {sortRowBySurname} from "../../common/sortFunctions";
import Loader from "../Loader";
import {PupilMarksTabs} from "../Marks/PupilMarksTabs";

const {Header, Content} = Layout;

export const MyClass = () => {
    const dispatch = useDispatch();
    const classPupils = useSelector(state => state.user.classPupils);
    const profile = useSelector(state => state.user.profile);
    const [activePupilId, setActivePupilId] = useState(null);

    const columns = [
        {
            title: '№',
            render: (text, record, index) => <span>{++index}</span>
        },
        {
            title: 'Прізвище',
            dataIndex: 'surname',
            sorter: sortRowBySurname,
            render: (text, record) => <Button onClick={() => setActivePupilId(record.id)} type="link">{text}</Button>
        },
        {
            title: 'Ім\'я',
            dataIndex: 'name',
        },
        {
            title: 'По-батькові',
            dataIndex: 'patronymic',
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            render: text => `+${text}`
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'День народження',
            dataIndex: 'birthdate',
            render: text => new Date(text).toLocaleDateString("sq-AL", {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }
    ];

    useEffect(() => {
        if (profile.class_number && !Array.isArray(classPupils)) {
            dispatch(getClass());
        }
    }, []);

    const handleCancel = () => {
        setActivePupilId(null);
    };

    if (!profile.class_number) {
        return <div>Ви не являєтесь класним керівником</div>
    }

    const letter = profile.class_letter
        ? `-${profile.class_letter}`
        : '';
    const title = `${profile.class_number}${letter} Клас`;

    return (
        <>
            <Header/>
            <Content className={styles.layout}>
                <h1 className={styles.title}>{title}</h1>
                {classPupils
                    ? <Table size={'middle'}
                             columns={columns}
                             dataSource={classPupils}
                             pagination={false}
                    />
                    : <Loader/>
                }
                <Modal
                    className={styles.modal}
                    bodyStyle={{padding: '10px 24px'}}
                    visible={activePupilId}
                    width={1200}
                    centered
                    onCancel={handleCancel}>
                    <PupilMarksTabs pupilId={activePupilId}/>
                </Modal>
            </Content>
        </>
    );
}
