import React from 'react'
import { onUpdateObjective } from '../services/studyAPI';
import { useSelector } from 'react-redux';
import { notif } from '../functions/datagrid';
import {  Form, Button, Input} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '../styles/CSS/Userdash.css'

const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

const Objectives = () => {
    const studyObj = useSelector(state => state.study)
    const initialValues = {objectives: studyObj.STUDY.objectives}

 

      async function handleUpdate(value){
        let res = await onUpdateObjective({'studyID': studyObj.STUDY.studyID, value})
        notif('info', res.data.message)
     }


    return (
        <div>
            
           <Form onFinish={handleUpdate} initialValues={initialValues}>
            <Form.List
            name="objectives"
            rules={[
            {
                validator: async (_, objective) => {
                if (!objective || objective.length < 2) {
                    return Promise.reject(new Error('At least 2 objectives'));
                }
                }
            },
            ]}
        >
            {(fields, { add, remove }, { errors }) => (
            <>
                {fields.map((field, index) => (
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Objectives' : ''}
                    required={false}
                    key={field.key}
                >
                    <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        {
                        required: true,
                        whitespace: true,
                        message: "Please input objective or delete this field.",
                        },
                    ]}
                    noStyle
                    >
                    <TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="Objective" style={{width: '50%'}} />
                    </Form.Item>
                    {fields.length > 1 ? (
                    <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                    />
                    ) : null}
                </Form.Item>
                ))}
                <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '50%' }}
                    icon={<PlusOutlined />}
                >
                    Add objective
                </Button>
                <Form.ErrorList errors={errors} />
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button htmlType='submit' style={{background: "#A0BF85", borderRadius: "5px", width: '50%'}} block>Update Objective</Button>
                </Form.Item>
            </>
            )}
        </Form.List>
        </Form>
           
        </div>
    )
}

export default Objectives
