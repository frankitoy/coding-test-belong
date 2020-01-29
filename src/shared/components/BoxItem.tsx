import React, { useEffect, useState } from 'react';
import IBoxItem from '../models/box-item.model';

const BoxItem = (props: IBoxItem) => {
  const { id, boxItemOnClickHandler, isActivated } = props;
  const [boxItemColorModifier, setBoxItemColorModifier] = useState('');

  useEffect(() => {
    setBoxItemColorModifier(randomColorfulCell());
  }, []);

  const randomColorfulCell = () => {
    const arrayOfColors = ['-green', '-yellow', '-blue', '-brown', '-black'];
    const maximum = arrayOfColors.length;
    const minimum = 0;
    const randomIndex = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

    return arrayOfColors[randomIndex];
  };

  const classNames = `container__box-item-container ${
    isActivated ? '-activated' : '-in-active'
    } ${boxItemColorModifier}`;

  return <div id={id} className={classNames} onClick={boxItemOnClickHandler} />;
};

export default BoxItem;
