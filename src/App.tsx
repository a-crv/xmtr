import React from 'react';
import { Row, Col } from 'antd';
import Form from './components/Form';
import './styles.css';

function App() {
  return (
    <div className="app">
      <Row>
        <Col span={9} offset={7}>
          <Form />
        </Col>
      </Row>
    </div>
  );
}

export default App;
