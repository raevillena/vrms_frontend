import React, {useState, useEffect} from 'react'
import Gallery from 'react-grid-gallery';
import { Button, message, Spin, Empty, Modal, Upload, Input, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { onUploadGallery } from '../services/uploadAPI';
import { useSelector } from 'react-redux';
import { onGetGallery } from '../services/studyAPI';
import '../styles/CSS/Userdash.css'
import { onGetOfflineGalleryStudy } from '../services/offline';

const StudyGallery = () => {

    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const [images, setImages] = useState([])
    const [caption, setCaption] = useState()
    const [loading, setLoading] = useState(true)
    const [visible, setVisible] = useState(false);

    const data = new FormData()
    const initialValues = { caption: '', data: ''}
    const [form] = Form.useForm();

    useEffect(() => {
        async function getImages(){
            let result = await onGetGallery(studyObj.STUDY.studyID)
            let image =  result.data
            let imageArr = []

            let result1 = await onGetOfflineGalleryStudy(studyObj.STUDY.studyID)
            let x = result1.data
            let tempData = []

            for (let i = 0; i < image.length; i++) {
               imageArr.push({
                src: `/gallery/${image[i].images}`,   ///http://127.0.0.1:8080/gallery/${image[i].images}
                thumbnail: `/gallery/${image[i].images}`, //http://127.0.0.1:8080/gallery/${image[i].images}
                thumbnailWidth: 200,
                thumbnailHeight: 200,
                caption: image[i].caption
               })
            }

            for (let i = 0; i < x.length; i++) {
                tempData.push({
                    caption: x[i].caption,
                    thumbnailWidth: 200,
                    thumbnailHeight: 200,
                    src: `/offline/${x[i].images}`,
                    thumbnail: `/offline/${x[i].images}`
            }
            );
            }
            let mergedArr = imageArr.concat(tempData)
            setImages(mergedArr) 
            setLoading(false)
        }
        
          
        getImages()
        return () => {
            console.log('unmounting gallery')
        }
    }, [])
    
    const upload = async(value)=>{
        data.append("file", value.image.fileList[0].originFileObj)
        data.append("study", studyObj.STUDY.studyID )               
        data.append("caption", caption)
        let result = await onUploadGallery(data)
        let newImage = result.data.newGallery.images
        setImages([...images, {
            src: `http://nberic.org/gallery/${newImage}`,
            thumbnail: `http://nberic.org/gallery/${newImage}`,
            thumbnailWidth: 258,
            thumbnailHeight: 200,
            caption: caption
            }])
        message.success(result.data.message)
        form.resetFields()
    }

    
    return (
        <div>
            {loading ? <Spin className="spinner" /> :
            <div>
                <Button icon={<UploadOutlined />} style={{background:'#A0BF85', display: userObj.USER.category === 'director' ? 'none' : 'initial'}}  onClick={() => setVisible(true)}>
                    Upload
                </Button>
                <Modal title='Upload Gallery Image' visible={visible} onCancel={() => setVisible(false)} centered footer={null}>
                    <Form onFinish={upload} initialValues={initialValues} form={form}>
                        <Form.Item label="Caption:" name='caption'>
                            <Input onChange={e => setCaption(e.target.value)} value={caption}/>
                        </Form.Item>
                        <Form.Item name='image' label='Select File:'>
                            <Upload maxCount={1}>
                                <Button icon={<UploadOutlined />}>Choose file to upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button block htmlType='submit' style={{background: "#A0BF85", borderRadius: "5px"}}>Upload</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                {images.length === 0 ? <Empty/> : <Gallery  images={images}/>}
            </div>
            }
        </div>
    )
}

export default StudyGallery
