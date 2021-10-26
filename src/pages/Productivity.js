import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';

export const Productivity = () => {
  const data = [
    {
      month: 'January',
      value: 50,
    },
    {
      month: 'February',
      value: 50,
    },
    {
      month: 'March',
      value: 95,
    },
    {
      month: 'April',
      value: 55,
    },
    {
      month: 'May',
      value: 40,
    },
    {
      month: 'June',
      value: 76,
    },
    {
      month: 'July',
      value: 68,
    },
    {
      month: 'August',
      value: 80,
    },
    {
      month: 'September',
      value: 50,
    },
    {
      month: 'October',
      value: 70,
    },
    {
      month: 'November',
      value: 75,
    },
    {
      month: 'December',
      value: 84,
    },
  ];

  const config = {
    data,
    height: 200,
    label: 'Productivity',
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

export default Productivity;
