import React, {useEffect} from "react";
import styles from "./Appointment.module.css";
import {Button, Layout, Tabs} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {getClasses} from "../../redux/adminReducer";
import Loader from "../Loader";
import {AppointmentContainer} from "./Appointment";
const {Content} = Layout;
const { TabPane } = Tabs;

export const AppointmentTabs = () => {
    const dispatch = useDispatch();
    const allClasses = useSelector(state => state.admin.classes);

    useEffect(() => {
        if(!allClasses) {
            dispatch(getClasses());
        }
    }, []);

    if (!allClasses) {
        return <Loader />
    }

    const classesGroup = {};
    for (const classItem of allClasses) {
        if (Object.keys(classesGroup).includes(classItem.number+'')) {
            classesGroup[classItem.number] = [...classesGroup[classItem.number], classItem];
        } else {
            classesGroup[+classItem.number] = [classItem];
        }
    }

    return (
        <Layout>
            <Content
                className={styles.siteLayoutBackground}
                style={{minHeight: 280}}>
                <div className={styles.tabsContainer} style={{position: 'relative'}}>
                    <Button style={{ position: 'absolute', right: 0, zIndex: 1 }}>
                        Скопіювати предмети минулого навчального року
                    </Button>
                    <Tabs defaultActiveKey="0" tabPosition={'top'} >
                        {Object.keys(classesGroup).map((item, index) => (
                            <TabPane tab={`${item} клас`} key={index} >
                                {classesGroup[item].length > 1
                                    ? <Tabs defaultActiveKey="0" tabPosition={'top'} >
                                        {classesGroup[item].map(classItem => {
                                            const letter = classItem.letter ? `-${classItem.letter}` : '';
                                            return(
                                                <TabPane tab={`${classItem.number}${letter} клас`} key={classItem.key} >
                                                    <AppointmentContainer classId={classItem.key} />
                                                </TabPane>
                                            )
                                        })}
                                        )}
                                    </Tabs>
                                    : <AppointmentContainer classId={classesGroup[item][0].key} />
                                }
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </Content>
        </Layout>
    );
}















































// import styles from "./Appointment.module.css";
// import {Button, Cascader, Form, Input, Layout, Select} from "antd";
// import React, {useState} from "react";
// import AppointmentTable from "./AppointmentTable";
//
// const {Header, Content} = Layout;
// const { Option } = Select;
// const data = [
//     {
//         key: '1',
//         name: 'Teacherenko Teacher Teacherovych',
//         className: 10,
//         subject: 'Математика',
//     },
//     {
//         key: '2',
//         name: 'Teacherenko Teacher Teacherovych',
//         className: '10-A',
//         subject: 'Алгебра',
//     },
//     {
//         key: '3',
//         name: 'Teacherenko Teacher Teacherovych',
//         className: '9',
//         subject: 'Геометрія',
//     },
//     {
//         key: '4',
//         name: 'Teacherenko Teacher Teacherovych',
//         className: '1-B',
//         subject: 'Креслення',
//     },
// ];
// const columns = [
//     {
//         title: 'ПІБ вчителя',
//         dataIndex: 'name',
//         key: 'name',
//         addSearch: true
//     },
//     {
//         title: 'Клас',
//         dataIndex: 'className',
//         key: 'className',
//         addSearch: true
//     },
//     {
//         title: 'Предмет',
//         dataIndex: 'subject',
//         key: 'subject',
//         addSearch: true
//         // sorter: (a, b) => a.address.length - b.address.length,
//         // sortDirections: ['descend', 'ascend'],
//     },
// ];
//
// const options = [
//     {
//         label: 'Light',
//         value: 'light',
//         children: new Array(20)
//             .fill(null)
//             .map((_, index) => ({ label: `Number ${index}`, value: index })),
//     },
//     {
//         label: 'Bamboo',
//         value: 'bamboo',
//         children: [
//             {
//                 label: 'Little',
//                 value: 'little',
//                 children: [
//                     {
//                         label: 'Toy Fish',
//                         value: 'fish',
//                     },
//                     {
//                         label: 'Toy Cards',
//                         value: 'cards',
//                     },
//                     {
//                         label: 'Toy Bird',
//                         value: 'bird',
//                     },
//                 ],
//             },
//         ],
//     },
// ];
//
// export const Appointment = () => {
//     const [form] = Form.useForm();
//     const [formLayout, setFormLayout] = useState('horizontal');
//
//     const onChange = value => {
//         console.log(value);
//     };
//
//     return (
//         <Layout>
//             <Header>
//             </Header>
//             <Content
//                 className={styles.siteLayoutBackground}
//                 style={{
//                     // margin: '24px 16px',
//                     // padding: 24,
//                     minHeight: 280,
//                 }}>
//                 <div className={styles.tabsContainer}>
//                     <Form
//                         layout='inline'
//                         form={form}
//                         initialValues={{
//                             layout: formLayout,
//                         }}
//                         style={{marginBottom: 30}}
//                         // onValuesChange={onFormLayoutChange}
//                     >
//                         <Form.Item label="Назва предмету">
//                             <Input placeholder="Алгебра" />
//                         </Form.Item>
//                         <Form.Item label="Класи" style={{minWidth: 230}}>
//                             <Cascader
//                                 style={{ minWidth: 300 }}
//                                 options={options}
//                                 onChange={onChange}
//                                 multiple
//                                 maxTagCount="responsive"
//                                 placeholder={'Натисніть щоб обрати'}
//                             />
//                         </Form.Item>
//                         <Form.Item label="Вчитель">
//                             <Select
//                                 style={{ minWidth: 150 }}
//                                 showSearch
//                                 placeholder="Натисніть щоб обрати"
//                                 optionFilterProp="children"
//                                 onChange={onChange}
//                                 // onSearch={onSearch}
//                                 filterOption={(input, option) =>
//                                     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                                 }
//                             >
//                                 <Option value="jack">Jack</Option>
//                                 <Option value="lucy">Lucy</Option>
//                                 <Option value="tom">Tom</Option>
//                             </Select>
//                         </Form.Item>
//                         <Form.Item>
//                             <Button type="primary">Створити</Button>
//                         </Form.Item>
//                     </Form>
//                     <AppointmentTable columns={columns} data={data}/>
//                 </div>
//             </Content>
//         </Layout>
//     );
// }
//
