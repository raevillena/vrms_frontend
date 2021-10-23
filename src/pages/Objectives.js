import React, {useState, useEffect} from 'react'
import { onGetStudyForDoc } from '../services/studyAPI';
import { useSelector } from 'react-redux';
import { notif } from '../functions/datagrid';
import { List , Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/CSS/Userdash.css'

const Objectives = () => {
    const [loading, setLoading] = useState(false)
    const studyObj = useSelector(state => state.study)
    const [obj, setObj] = useState()
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    useEffect(() => {
        async function getStudyData(){
            try {
                setLoading(true)
                let result = await onGetStudyForDoc({studyID: studyObj.STUDY.studyID})
                setObj(result.data.study[0].objectives)
                setLoading(false)
            } catch (error) {
                notif('error', 'Error in getting data!')
            }
        }

          getStudyData()
          return () => console.log("unmounting from summary")
      }, [studyObj.STUDY.studyID])


    return (
        <div>
           {loading? <Spin indicator={antIcon} className='spinner' /> : 
            <div className="div-flex">
            <label style={{fontWeight:'bolder', marginTop: '7px'}}>Objectives: </label>
            <List size="small"
                dataSource={obj}
                renderItem={item => <List.Item>{item}</List.Item>}
                >
            </List>
        </div>
           }
        </div>
    )
}

export default Objectives
