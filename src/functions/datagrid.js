import { onDownloadHistory, onEditLog, onUpdateDatagrid } from '../services/studyAPI';
import { notification } from 'antd';

export const notif = (type, message) => {
    notification[type]({
      message: 'Notification Title',
      description:
        message,
    });
  };

export async function downloadCSV(data, ID, title, user){
    let csv = ''

    let keys = Object.keys(data[0])
    keys.forEach((key) => {
      csv += key + ","
    })
    csv += "\n"

    data.forEach((datarow) => {
      keys.forEach((key)=>{
        csv += datarow[key] + ","
      })
      csv += "\n"
    });
      const element = document.createElement('a')
      const file = new Blob([csv], {type: 'data:text/csv;charset=utf-8'})
      element.href = URL.createObjectURL(file)
      element.download = `${title}.csv`
      document.body.appendChild(element)
      element.click()
      let id ={tableID: ID}
      let resultDownload = await onDownloadHistory({user: user , id})
      notif('success', resultDownload.data.message)
}


export async function downloadCSVonCreate(data, title){
  
    try {
      let csv = ''
    let keys = Object.keys(data[0])
    keys.forEach((key) => {
      csv += key + ","
    })
    csv += "\n"

    data.forEach((datarow) => {
      keys.forEach((key)=>{
        csv += datarow[key] + ","
      })
      csv += "\n"
    });
      const element = document.createElement('a')
      const file = new Blob([csv], {type: 'data:text/csv;charset=utf-8'})
      element.href = URL.createObjectURL(file)
      element.download = `${title}.csv`
      document.body.appendChild(element)
      element.click()
      notif('success', "Download sucessful!")
    } catch (error) {
      notif('error', 'Download failed!')
    }
      
  }

  export async function downloadCSVonGrid(data){
    let toDownload = data[0].data
    let csv = ''
    let keys = Object.keys(data[0].data[0])
    keys.forEach((key) => {
      csv += key + ","
    })
    csv += "\n"

    toDownload.forEach((datarow) => {
      keys.forEach((key)=>{
        csv += datarow[key] + ","
      })
      csv += "\n"
    });
      const element = document.createElement('a')
      const file = new Blob([csv], {type: 'data:text/csv;charset=utf-8'})
      element.href = URL.createObjectURL(file)
      element.download = `${data[0].title}.csv`
      document.body.appendChild(element)
      element.click()
  }

  export async function updateDB(data, id, user){
    let result = await onUpdateDatagrid(data)
    notif('success', result.data.message)
    await onEditLog({user: user , id})
  }
