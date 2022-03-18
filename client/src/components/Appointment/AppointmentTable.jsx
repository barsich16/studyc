import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import React from "react";



class AppointmentTable extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Знайти ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Знайти
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Скинути
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Фільтрувати
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        // if(this.props.columns) {
        //     console.log('Columns are here');
        // }
        const columns = this.props.columns.map(column => {
            if (column.addSearch) {
                return {
                    ...column,
                    ...this.getColumnSearchProps(column.dataIndex),
                }
            }
            return column
        })
        // const columns2 = this.props.columns
        //     ?  [{
        //         title: 'ПІБ вчителя',
        //         dataIndex: 'name',
        //         key: 'name',
        //         // width: '30%',
        //         ...this.getColumnSearchProps('name'),
        //     },
        //         {
        //             title: 'Клас',
        //             dataIndex: 'className',
        //             key: 'className',
        //             // width: '20%',
        //             ...this.getColumnSearchProps('className'),
        //         },]
        //     : [
        //         {
        //             title: 'ПІБ вчителя',
        //             dataIndex: 'name',
        //             key: 'name',
        //             // width: '30%',
        //             ...this.getColumnSearchProps('name'),
        //         },
        //         {
        //             title: 'Клас',
        //             dataIndex: 'className',
        //             key: 'className',
        //             // width: '20%',
        //             ...this.getColumnSearchProps('className'),
        //         },
        //         {
        //             title: 'Предмет',
        //             dataIndex: 'subject',
        //             key: 'subject',
        //             ...this.getColumnSearchProps('subject'),
        //             // sorter: (a, b) => a.address.length - b.address.length,
        //             // sortDirections: ['descend', 'ascend'],
        //         },
        //     ];

        console.log(this);
        return <Table columns={columns} dataSource={this.props.data} />;
    }
}
export default AppointmentTable;
