import {Select} from "antd";

const SearchedSelect = (props) => {
    const { children, ...properties } = props;
    const options = children.map(child => {
        return <Select.Option value={child.value}>{child.key}</Select.Option>
    })

    return (
        <Select
                {...properties}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
        >
            {options}
        </Select>
    );
}

export default SearchedSelect;
