import React, {useEffect} from 'react';
import {Button, Card, Table} from 'antd';
import styles from "./TeacherMarks.module.css";
import {useDispatch, useSelector} from "react-redux";
import {getMarks} from "../../redux/userReducer";
import Loader from "../Loader";

export const PupilMarks = ({pupilId, subjectId}) => {
    const subject = useSelector(state => state.user.marks.find(item => item.pupilId === pupilId).subjects.find(item => item.id === subjectId));
    const dispatch = useDispatch();

    useEffect(() => {
        if (!subject.marks) {
            console.log("Запрос за конкретними...");
            dispatch(getMarks(pupilId, subjectId));
        }
    }, [subjectId]);

    if (!subject || !subject.marks) {
        return <Loader/>
    }

    const {other, link, other_materials, teacher_name, email} = subject;
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'creation_date',
            render: (text) => {
                if (text) {
                    const newDate = new Date(text);
                    const month = newDate.getMonth() + 1;
                    return `${newDate.getDate()}.${month < 10 && '0' + month}.${newDate.getFullYear()}`
                }
            }
        },
        {
            title: 'Тема роботи',
            dataIndex: 'name',
        },
        {
            title: 'Тип роботи',
            dataIndex: 'type',
        },
        {
            title: 'Оцінка',
            dataIndex: 'mark',
            align: 'center'
        }
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    pagination={false}
                    size={"small"}
                    dataSource={subject.marks}
                />
            </div>

            <Card title={'Вчитель: ' + teacher_name ?? 'Вчитель не призначений'} style={{ minWidth: 350 }}>
                <p><b>Email: </b> {email ?? "Не вказаний"} </p>
                <p><b>Посилання на заняття: </b>
                    {link
                        ? <Button
                            type="link"
                            style={{padding: 0}}
                            onClick={() => window.open(link)}>
                                Перейти
                          </Button>
                        : "Ще не додано"}
                </p>
                <p><b>Додаткові матеріали: </b>
                    {other_materials
                        ? <Button
                            type="link"
                            style={{padding: 0}}
                            onClick={() => window.open(other_materials)}>
                            Перейти
                        </Button>
                        : "Ще не додано"}
                </p>
                <p><b>Опис дисципліни: </b> {other ?? "Не вказаний"}</p>
            </Card>
        </div>
    );
}
