import {io} from 'socket.io-client'

export const socket = io("http://nberic.org:3002")

export const join = (id, user, join) =>{
    socket.emit('join-table', {room: id, user: user, join: join})
}

export const changeColumns = (type, title, id) => {
    socket.emit("send-changes-columns",
      {
        type: type, 
        title: title, 
        room: id
      })
}

export const columnDelete = (data, id) =>{
    socket.emit("send-changes-columns-delete", {data: data, room: id})
}


export const emitDatagridChange = (data, id) =>{
    socket.emit('send-changes', {data: data, room: id})
}
