import React, {useState, useEffect} from 'react'
import Gallery from 'react-grid-gallery';
import { Button, message, Spin, Empty } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { onUploadGallery } from '../services/uploadAPI';
import { useSelector } from 'react-redux';
import { onGetGallery } from '../services/studyAPI';
import '../styles/CSS/Userdash.css'

const StudyGallery = () => {

    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getImages(){
            let result = await onGetGallery(studyObj.STUDY.studyID)
            let image =  result.data
            let imageArr = []
            for (let i = 0; i < image.length; i++) {
               imageArr.push({
                src: `/gallery/${image[i].images}`,   ///http://127.0.0.1:8080/gallery/${image[i].images}
                thumbnail: `/gallery/${image[i].images}`, //http://127.0.0.1:8080/gallery/${image[i].images}
                thumbnailWidth: 258,
                thumbnailHeight: 200,
               })
            }
            setImages(imageArr)
            setLoading(false)
        }
        getImages()
        return () => {
            console.log('unmounting gallery')
        }
    }, [])
    return (
        <div style={{maxHeight: '320px', overflowY: 'auto'}}>
            {loading ? <Spin className="spinner" /> :
            <div>
                <Button style={{background:'#A0BF85', display: userObj.USER.category === 'director' ? 'none' : 'initial'}}>
                    <label className="file_input_id">
                    <UploadOutlined/> Upload Image
                        <input type="file"  accept="image/*" onChange={async e => {
                            const file = e.target.files[0]
                            const data = new FormData()
                            data.append("study", studyObj.STUDY.studyID )
                            data.append("file", file)
                            let result = await onUploadGallery(data)
                            let newImage = result.data.newGallery.images
                            setImages([...images, {
                                src: `http://nberic.org/gallery/${newImage}`,
                                thumbnail: `http://nberic.org/gallery/${newImage}`,
                                thumbnailWidth: 110,
                                thumbnailHeight: 70,
                                }])
                            message.success(result.data.message)
                            }
                        }
                        />
                    </label>
                </Button>
                {images.length === 0 ? <Empty/> : <Gallery  images={images}/>}
            </div>
            }
        </div>
    )
}

export default StudyGallery
