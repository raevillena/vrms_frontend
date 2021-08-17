
import React, { useState , useEffect} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "antd";
import { useSelector } from "react-redux";



const Editors = () => {
    const studyObj = useSelector(state => state.study) //study reducer
    const [value, setValue] = useState('');

    useEffect(() => {
        console.log('doc val', value)
    }, [value])

    return (
        <div style={{justifyContent:'space-between', flexDirection:'column', display:'flex'}}>
            <div style={{lineHeight: '20px'}}>
            <ReactQuill theme="snow" value={value} onChange={setValue}/>
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', lineHeight: '20px', gap:'5px'}}>
            <Button type='primary'>Save</Button>
            <Button type='primary'>Download</Button>
            </div>
        </div>
    )
}

export default Editors
