
import React, { useState , useEffect} from "react";
import { Button, Spin } from "antd";
import { useSelector } from 'react-redux';
import { onGetDocumentation, onUpdateMethodology } from "../services/studyAPI";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromRaw} from "draft-js";
import draftToHtml from 'draftjs-to-html'
import { LoadingOutlined } from "@ant-design/icons";
import '../styles/CSS/Userdash.css'

const Methodology = () => {
    const studyObj = useSelector(state => state.study) //study reducer
    const userObj = useSelector(state => state.user)
    const AUTOSAVE_INTERVAL = 3000;
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [loading, setLoading] = useState(false)

    const content = editorState.getCurrentContent(); 
    const dataToSaveBackend = JSON.stringify(convertToRaw(content))
    const markup = draftToHtml(convertToRaw(content))

 

    async function download(){
        try {
         var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
             "xmlns:w='urn:schemas-microsoft-com:office:word' "+
             "xmlns='http://www.w3.org/TR/REC-html40'>"+
             "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        var footer = "</body></html>";
        var sourceHTML = header+markup+footer;
        
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${studyObj.STUDY.title}Methodology.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
        } catch (error) {
            console.log(error)
        }
     }

     function uploadImageCallBack(file) { 
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/v1/upload/documentation'); 
         console.log('file', file)
            const data = new FormData();
            data.append('file', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              resolve({data: {link: `http://localhost:8080/documentation/${response.filename}`}})
              console.log(response.filename);
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              console.log(error)
              reject(error);
            });
          }
        );
      }

    useEffect(() => {
        const timer = setTimeout(()=>{
          async function updateDB(){
            try {
                await onUpdateMethodology({studyID: studyObj.STUDY.studyID, methodology: dataToSaveBackend, user: userObj.USER.name})
                console.log('updating methodology')
            } catch (error) {
                console.log(error)
            }
          }
          updateDB()
        }, AUTOSAVE_INTERVAL)
        return () => clearTimeout(timer);
      }, [editorState, studyObj.STUDY.studyID, dataToSaveBackend,  userObj.USER.name ])

      useEffect(() => {
        async function getDataFromDB(){
          try {
            setLoading(true)
              let result = await onGetDocumentation({studyID: studyObj.STUDY.studyID})
              setLoading(false)
              const contentState = convertFromRaw(JSON.parse(result.data.docs.methodology)); //displaying data
              setEditorState(EditorState.createWithContent(contentState))
             
          } catch (error) {
              console.log(error)
          }
      }
        getDataFromDB()
      }, [studyObj.STUDY.studyID])

      const onEditorStateChange = (editorState) =>{
        setEditorState(editorState)
      }
    return (
      <div>
        {loading? <Spin indicator={antIcon} className="spinner" /> :
        <div style={{justifyContent:'space-between', flexDirection:'column', display:'flex'}}>
            <div style={{lineHeight: '20px'}}>
                <Editor editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                toolbar={{
                   inline: { inDropdown: true },
                   list: { inDropdown: true },
                   textAlign: { inDropdown: true },
                   link: { inDropdown: true },
                   history: { inDropdown: true },
                   image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true }, previewImage: true }
                 }}
                    onEditorStateChange={onEditorStateChange}
                />
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', lineHeight: '20px', gap:'5px'}}>
            <Button type='primary' onClick={download}>Download</Button>
            </div>
        </div>}
        </div>
    )
}

export default Methodology
