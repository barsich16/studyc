import {Layout, Spin} from "antd";
const {Header, Content} = Layout

const InDevelopment = () => {
    return (
        <Layout>
            <Header></Header>
            <Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                <div >
                    <div style={{fontSize: '26px', marginBottom: '20px'}}>Сторінка на стадії розробки...</div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                        <Spin style={{margin: '0 auto'}} size="large" />
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default InDevelopment;
