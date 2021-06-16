import '../styles/CSS/Login.css';
import { Input, Button, Form, Row, Col, Modal } from 'antd';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'


const Signup = () => {

    
    return (
        <div>
            <Row>
                <Form>
                    <Form.Item name="Name">
                        <Input placeholder="Enter Name"></Input>
                    </Form.Item>
                    <Form.Item name="Name">
                        <Input placeholder="Enter Email"></Input>
                    </Form.Item>
                    <Form.Item name="Name">
                        <Input placeholder="Enter Project"></Input>
                    </Form.Item>
                    <Form.Item name="Name">
                        <Input placeholder="Enter Title"></Input>
                    </Form.Item>
                    <Form.Item name="Name">
                        <Input placeholder="Auto Generated Password"></Input>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    )
}

export default Signup
