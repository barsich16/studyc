import React, {useState, useEffect} from 'react';
import {Table, Button, Checkbox, Modal} from 'antd';
import styles from './TeacherMarks.module.css'
import {useFetching} from "../../hooks/useFetching.hook";
import {getChangedMarks} from "../../common/sortFunctions";
import {useSelector} from "react-redux";
import Loader from "../Loader";
import {components} from "../../common/EditableTableElements/EditableTableElements";
import {useActions} from "../../hooks/useActions";
import {Drop} from "../Employee/Employee";


export const TableMarks = ({subjectId, titleTab, allowEditing, subjectInfo}) => {
    const {fetching, loading} = useFetching();
    const {getMarks, updateMarks} = useActions();

    let subject = useSelector(state => state.teacher.marks.find(item => item.id === subjectId));
    const [isHighlightMarksActive, setIsHighlightMarksActive] = useState(false);
    const [visible, setVisible] = useState(false);
    const [localState, setLocalState] = useState([]);
    if (subjectInfo) {
        subject = subjectInfo;
    }

    useEffect(() => {
        if(!subject) {
            getMarks(subjectId);
        } else {
            setLocalState(subject.pupilsMarks)
        }
    }, [subject]);

    if (!subject) {
        return <> <Loader/> </>
    }
    const handleSave = row => {
        const newData = [...localState];
        let rowWithoutDeletedElements = {};

        for (let key in row) {
            if (row[key] !== '') {
                rowWithoutDeletedElements[key] = row[key];
            }
        }
        const index = newData.findIndex((item) => rowWithoutDeletedElements.key === item.key);
        newData.splice(index, 1, rowWithoutDeletedElements);
        console.log(subject);

        setLocalState(newData);
    };

    const generateColumns = isForModal => {
        const columnsTemplate = [
            {
                title: '№',
                fixed: 'left',
                align: 'center',
                width: 25,
                render: (text, record, index) => <span>{++index}</span>
            },
            {
                title: 'ПІБ учня',
                dataIndex: 'pupil_name',
                key: 'pupil_name',
                fixed: 'left',
                // sorter: sortRowBySurname,
                render: text => <a>{text}</a>,
                // defaultSortOrder: 'ascend',
                // sorter: sortRowBySurname,
                align: 'left',
                width: isForModal ? 250 : 80,
            },
        ];
        const dynamicColumns = subject.events.map((item, index) => {
            const fixedCells = {};
            if (index < 3) {
                fixedCells.fixed = 'left';
            }
            return {
                title: isForModal ? item.name : item.short_name ?? item.name,
                semester: item.semester,
                key: item.id,
                dataIndex: item.id,
                editable: true,
                allowEditing: allowEditing,
                className: styles.mainTab,
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                ...fixedCells,
                width: !isForModal && 90,

                render: (text) => {
                    if (text && text !== '' && isHighlightMarksActive) {
                        //від червоного до зеленого
                        // const koef = 256 / 12;
                        // const red = koef * (12 - text);
                        // const green = koef * text;
                        // return <div style={{backgroundColor:  `rgb(${red},${green},0)`,
                        //     margin: '-2px'}}>{text}</div>

                        // //прозорість зеленого
                        const koef = 1 / 12;
                        const alpha = koef * text;
                        return <div style={{backgroundColor:  `rgba(0, 255, 0, ${alpha})`,
                            margin: '-2px'}}>{text}</div>

                        //тон зеленого
                        // const koef = 256 / 12;
                        // const green = koef * text;
                        // return <div style={{backgroundColor:  `rgb(0, ${green}, 0)`,
                        //     margin: '-2px'}}>{text}</div>
                    } else {
                        return <div>{text}</div>
                    }

                },
            }
        });

        columnsTemplate.push(...dynamicColumns);
        const columns = columnsTemplate.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    allowEditing: col.allowEditing,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: handleSave,
                    semester: col.semester,
                }),
            };
        });
        return columns;
    }

    const updateHandler = () => {
        const newMarks = localState;
        console.log(newMarks);
        const changedMarks = getChangedMarks(subject.pupilsMarks, newMarks);
        changedMarks.subjectId = subject.id;
        console.log(changedMarks);
        fetching(updateMarks, changedMarks, newMarks);
    }

    const highlightGivenMarks = e => {
        setIsHighlightMarksActive(e.target.checked)
    }

    const generateAverageMarks = () => {
        const oldMarks = localState;
        const mainEventsId = subject.events
            .filter((item, index) => index < 3) //беремо перших 3 події, тобто річну, і 2 семестрових
            .map(item => item.id);   // беремо тільки id
        const newMarks = oldMarks.map(item => {
            if (!item[mainEventsId[1]] || !item[mainEventsId[2]]) {
                return item;
            }
            const averageMark = Math.round((item[mainEventsId[1]] + item[mainEventsId[2]]) / 2);
            return {...item, [mainEventsId[0]]: averageMark}
        })
        setLocalState(newMarks);
        console.log(oldMarks);
    }

    const tableProps = {
        scroll: {x: 1000},
        components,
        dataSource: localState,
        pagination: false,
        tableLayout: 'fixed',
        rowClassName: styles.rows,
        bordered: true,
        size: 'small'
    }
    const modalFooter = [
        <Button key="back" onClick={() => setVisible(false)}>
            Повернутися
        </Button>];

    allowEditing && modalFooter.push(
        <Button key="submit" type="primary" onClick={updateHandler} loading={loading}>
            Зберегти
        </Button>
    );


    return (
        <>
            <div className={styles.header}>
                <Checkbox onChange={highlightGivenMarks}>Виставлені оцінки</Checkbox>
                <div>
                    {allowEditing &&
                        <Button
                            type="primary"
                            onClick={generateAverageMarks}
                            style={{marginRight: 5}}
                        >
                            Згенерувати річні оцінки
                        </Button>
                    }
                    <Button type="primary" onClick={() => setVisible(true)}>
                        Повноекранний режим
                    </Button>
                </div>

            </div>

            <Table {...tableProps} columns={generateColumns(false)}/>

            <Modal
                title={titleTab}
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={'100%'}
                className={styles.modal}
                bodyStyle={{padding: '10px 10px'}}
                footer={modalFooter}
            >
                <div className={styles.header}>
                    <Checkbox onChange={highlightGivenMarks}>Виставлені оцінки</Checkbox>
                </div>
                <Table {...tableProps} columns={generateColumns(true)} />
            </Modal>

            {allowEditing &&
                <div className={styles.btn_wrap}>
                    <Button type="primary" onClick={updateHandler} loading={loading}>
                        Зберегти
                    </Button>
                </div>
            }
        </>
    );
}
