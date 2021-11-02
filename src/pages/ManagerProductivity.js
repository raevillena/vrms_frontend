import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { onGetTaskCreatedbyManager } from '../services/taskAPI';
import _ from 'lodash'
import moment from 'moment';
import { useSelector } from 'react-redux';

 const ManagerProductivity = () => {
    let userObj = useSelector(state => state.user)

    const [data, setData] = useState([
        { month: 'January', value: 0 },
        { month: 'February', value: 0},
        { month: 'March', value: 0 },
        { month: 'April', value: 0 },
        { month: 'May', value: 0 },
        { month: 'June', value: 0 },
        { month: 'July', value: 0 },
        { month: 'August', value: 0 },
        { month: 'September', value: 0 },
        { month: 'October', value: 0 },
        { month: 'November', value: 0 },
        { month: 'December', value: 0 },
    ])
    useEffect(() => {
       try {
            async function getData(){
                let res = await  onGetTaskCreatedbyManager(userObj.USER._id)
                let arr = res.data.tasks
                const monthName = item => moment(item.deadline, 'YYYY-MM-DD').format('MM');
                const result = _.groupBy(arr, monthName);
                let tempArray =[]
            
                for (let i = 1; i < 13; i++) {
                 if(result[i] === undefined || result[i] === null){
                     tempArray.push({
                         month: moment(i, 'MM').format('MMMM'),
                         value: 0
                     }) 
                 } else{
                     let completed = _.filter(result[i], {status: 'COMPLETED'});
                     let denominator = result[i].length
                     let percentage = completed.length/denominator
                     tempArray.push({
                         month: moment(i, 'MM').format('MMMM'),
                         value: percentage*100
                     }) 
                 }
                }
                setData(tempArray)
             }
             getData()  
        } catch (error) {
            alert(error)
        }
        
    }, [])

  const config = {
    data,
    height: 200,
    yField: 'value',
    xField: 'month',
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.year}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="g2-tooltip-marker" style={{ backgroundColor: color }}></span>
                    <span
                      style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                    >
                      <span style={{ margiRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">{value}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
    point: {
      size: 4,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2,
      },
    },
  };

  return <Line autoFit={true} {...config} />;
};

export default ManagerProductivity;
