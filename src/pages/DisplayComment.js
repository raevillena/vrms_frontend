import React, {  useState, useEffect } from 'react';
import { Comment, Tooltip, Avatar, Button, notification, Spin } from 'antd';
import moment from 'moment';
import { onGetALlComment } from '../services/taskAPI';
import '../styles/CSS/Userdash.css'
import { LoadingOutlined } from '@ant-design/icons';



const DisplayComment = (props) => {
    const [comments, setComments] = useState([])
   const [length, setLength] = useState(3)
   const [loading, setLoading] = useState(false)
   const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; 

   const notif = (type, message) => {
    notification[type]({
      message: 'Notification Title',
      description:
        message,
    });
  };

   async function getAllComments(){
      setLoading(true)
      let result = await onGetALlComment({taskId: props.data.task})
      let tempCommentData = []
      
      let commentLoop = result.data.comments
      for(let i = 0; i < commentLoop.length; i++){ 
          tempCommentData.push({
            author: commentLoop[i].user,
            avatar: commentLoop[i].avatar,
            content: commentLoop[i].comment,
            date: commentLoop[i].dateCreated
          });
        }
        setComments(tempCommentData)
        setLoading(false)
  }

    useEffect( () => {
        async function getAllComments(){
            //  setLoading(true)
              let result = await onGetALlComment({taskId: props.data.task})
            //  setLoading(false)
              let tempCommentData = []
              
              let commentLoop = result.data.comments
              for(let i = 0; i < commentLoop.length; i++){ 
                  tempCommentData.push({
                      key: commentLoop[i],
                    author: commentLoop[i].user,
                    avatar: commentLoop[i].avatar,
                    content: commentLoop[i].comment,
                    date: commentLoop[i].dateCreated
                  });
                }
                setComments(tempCommentData)
               
          }
        getAllComments()
    }, [props.data])

    
    async function addLength(){
        setLength(length + 2)
        getAllComments()
        if(length >= comments.length){
          notif('info', 'All comments already displayed!')
        }
    }
    return (
        <div>
          {loading? <Spin indicator={antIcon} className="spinner" /> :
        <div > 
            {comments.slice(0,length).map(comment =>(
              <Comment
                    author={<p>{comment.author}</p>}
                    avatar={
                        <Avatar
                            src={`/avatar/${comment.avatar}`}
                            alt={comment.author}
                        />
                    }
                    content={
                        <p>
                            {comment.content}
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(comment.date).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Tooltip>
                    }
                 /> 
        
            ))}
            <div id="showComment" style={{display: 'flex', justifyContent: 'center'}}>
                <Button onClick={addLength}>load more</Button>
            </div>
        </div>}
        </div>
    )
}

export default DisplayComment
