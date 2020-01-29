import React from 'react';
import IButtonType from '../models/button-type.model';

const Button = (props: IButtonType) => {
  const { btnClass, text, clickHandler } = props;
  return (
    <a className={btnClass} onClick={clickHandler}>
      {text}
    </a>
  );
};

export default Button;
