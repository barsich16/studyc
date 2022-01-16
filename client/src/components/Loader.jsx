import {Spin} from 'antd';

const Loader = () => {
    return (
        <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spin size="large" />
        </div>
    );
}

export default Loader;
