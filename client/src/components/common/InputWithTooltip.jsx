import {Input, Tooltip} from "antd";

export const InputWithTooltip = (props) => {
    return (
        <Tooltip
            trigger={['focus', 'hover']}
            title={props.value}>
            <Input {...props} style={{maxWidth: '80px'}} />
        </Tooltip>
    );
}
