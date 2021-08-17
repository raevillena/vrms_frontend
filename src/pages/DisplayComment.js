import React, { createElement, useState, useEffect } from 'react';
import { Comment, Tooltip, Avatar, Button } from 'antd';
import moment from 'moment';
import { onGetALlComment } from '../services/taskAPI';


const DisplayComment = (props) => {
    const [comments, setComments] = useState([])
    const [length, setLength] = useState(3)
    

    async function getAllComments(){
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
    }

    useEffect( () => {
        getAllComments()
    }, [props.data])

    async function addLength(){
        setLength(length+3)
        getAllComments()
        var x = document.getElementById("showComment");
        if (comments.length <= length) {
            x.style.display = "none";
        }else{
            x.style.display = "flex"
        }
    }

    return (
        <div >
            {comments.slice(0,length).map(comment =>(
            
              <Comment
                    author={<a>{comment.author}</a>}
                    avatar={
                        <Avatar
                            src={`http://localhost:8080/avatar/${comment.avatar}`}
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
        </div>
    )
}

export default DisplayComment
