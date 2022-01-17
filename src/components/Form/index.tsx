import React, { FC, useState, useMemo } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Divider,
  Typography,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { features } from './features';
import { Process, Material, Finish, Values } from './types';

const { Option } = Select;

const getMaterialsByProcess = (materials: Array<Material>, processId: number) =>
  materials.filter((materialItem) => processId === materialItem.processId);

const getDefaultMaterialId = (materials: Array<Material>) => {
  const filteredMaterials = materials.find(
    (materialItem) => materialItem.active,
  );

  return filteredMaterials ? filteredMaterials.id : filteredMaterials;
};

const getFinishesByProcessAndMeterial = (
  finishes: Array<Finish>,
  processId: number,
  materialId?: number,
) =>
  finishes.filter(
    (finishItem) =>
      processId === finishItem.processId &&
      !finishItem.restrictedMaterials.find(
        (restrictedMaterial) => restrictedMaterial === materialId,
      ),
  );

const getDefaultFinishId = (finishes: Array<Finish>) => {
  const defaultFinish = finishes[0];
  return defaultFinish ? defaultFinish.id : defaultFinish;
};

const FormComponent: FC = () => {
  const [form] = Form.useForm();

  const { processes, materials, finishes } = features;

  const [processId, setProcessId] = useState(processes[0].id);

  const filteredMaterials = useMemo(
    () => getMaterialsByProcess(materials, processId),
    [materials, processId],
  );
  const [materialId, setMaterialId] = useState(
    getDefaultMaterialId(filteredMaterials),
  );
  const currentMaterial = useMemo(
    () => materials.find((m) => m.id === materialId),
    [materialId, materials],
  );

  const filteredFinishes = useMemo(
    () => getFinishesByProcessAndMeterial(finishes, processId, materialId),
    [finishes, materialId, processId],
  );
  const [finishId, setFinishId] = useState(
    getDefaultFinishId(filteredFinishes),
  );
  const currentFinish = useMemo(
    () => finishes.find((f) => f.id === finishId),
    [finishId, finishes],
  );

  const handleProcessChange = (id: number) => {
    if (processId !== id) {
      const defaultMaterialId = getDefaultMaterialId(
        getMaterialsByProcess(materials, id),
      );
      const defaultFinishId = getDefaultFinishId(
        getFinishesByProcessAndMeterial(finishes, id, defaultMaterialId),
      );
      setProcessId(id);
      setMaterialId(defaultMaterialId);
      setFinishId(defaultFinishId);
    }
  };

  const handleMaterialChange = (id: number) => {
    if (materialId !== id) {
      const defaultFinishId = getDefaultFinishId(
        getFinishesByProcessAndMeterial(finishes, processId, id),
      );

      setMaterialId(id);
      setFinishId(defaultFinishId);
    }
  };

  const handleFinishChange = (id: number) => {
    if (finishId !== id) {
      setFinishId(id);
    }
  };

  const onFinish = (values: Values) => {
    alert(JSON.stringify(values, undefined, 2));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      fields={[
        {
          name: 'processId',
          value: processId,
        },
        {
          name: 'materialId',
          value: materialId,
        },
        {
          name: 'finishId',
          value: finishId,
        },
      ]}
      // eslint-disable-next-line no-template-curly-in-string
      validateMessages={{ required: '${label} is required!' }}
      onFinish={onFinish}
    >
      <Typography.Title level={4}>
        Manufacturing Process / Material
      </Typography.Title>
      <Form.Item label="Quantity:" name="quantity" initialValue={1}>
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item
        label="Technology:"
        name="processId"
        tooltip={{
          title: 'This is technology',
          icon: <InfoCircleOutlined />,
        }}
        initialValue={processId}
      >
        <Select onSelect={handleProcessChange}>
          {processes.map((processItem) => (
            <Option
              key={processItem.id}
              value={processItem.id}
              disabled={!processItem.active}
            >
              {processItem.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Material:"
        name="materialId"
        tooltip={{
          title: 'This is material',
          icon: <InfoCircleOutlined />,
        }}
      >
        <Select
          onSelect={handleMaterialChange}
          placeholder="Please choose material"
        >
          {filteredMaterials.map((materialItem) => (
            <Option
              key={materialItem.id}
              value={materialItem.id}
              disabled={!materialItem.active}
            >
              {materialItem.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {currentMaterial?.isCustom && (
        <Form.Item label="Custom material:" name="customMaterial">
          <Input placeholder="Enter material" />
        </Form.Item>
      )}
      {currentMaterial?.color && currentMaterial.color.length > 0 && (
        <Form.Item
          label="Color:"
          name="color"
          initialValue={currentMaterial.color[0]}
        >
          <Select>
            {currentMaterial.color.map((color) => (
              <Option key={color} value={color}>
                {color}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {currentMaterial?.infill && currentMaterial.infill.length > 0 && (
        <Form.Item
          label="Infill:"
          name="infill"
          initialValue={currentMaterial.infill[0]}
        >
          <Select>
            {currentMaterial.infill.map((infill) => (
              <Option key={infill} value={infill}>
                {infill}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Divider />
      <Typography.Title level={4}>Advanced Features</Typography.Title>
      <Form.Item
        label="Finish:"
        name="finishId"
        tooltip={{
          title: 'This is finish',
          icon: <InfoCircleOutlined />,
        }}
      >
        <Select
          onSelect={handleFinishChange}
          placeholder="Please choose finish"
        >
          {filteredFinishes.map((finishItem) => (
            <Option key={finishItem.id} value={finishItem.id}>
              {finishItem.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {currentFinish?.isCustom && (
        <Form.Item label="Custom material:" name="customFinish">
          <Input placeholder="Enter finish" />
        </Form.Item>
      )}
      {currentMaterial?.tolerance.options &&
        currentMaterial.tolerance.options.length > 0 && (
          <Form.Item
            label="Tightest tolerance:"
            name="tolerance"
            initialValue={currentMaterial.tolerance.default}
          >
            <Select>
              {currentMaterial.tolerance.options.map((tolerance) => (
                <Option key={tolerance} value={tolerance}>
                  {tolerance}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      <Form.Item
        label="Threads and Tapped Holes:"
        name="threads"
        initialValue={1}
      >
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item label="Inserts:" name="inserts" initialValue={1}>
        <InputNumber min={1} max={10} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
