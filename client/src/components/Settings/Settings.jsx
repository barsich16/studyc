import React from 'react';
import {Layout} from 'antd';
import Loader from "../Loader";

const Settings = () => {
    return (
        <Layout>
            <h1 style={{textAlign: 'center', fontSize: '30px', marginBottom: '-250px', marginTop: '200px'}}>
                Сторінка на стадії розробки...</h1>
            <Loader/>
        </Layout>
    );
}

export default Settings;
