import React, { useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';

const sizeMap = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

const styleMap = {
  primary: {
    backgroundColor: '#53E458',
    color: 'white',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#ffffff ',
    color: '#53E458 !important',
    borderColor: '#53E458 ',
   
  },
  login: {
    backgroundColor: '#53E458',
    color: '#ffffff',
    border: 'none',
  },
  google: {
    backgroundColor: '#F7F7F8',
    color: '#000000',
    border: '#ccc',
  },
};

const hoverStyleMap = {
  primary: { backgroundColor: '#0d9412' },
  secondary: { backgroundColor: '#ffffff', color: '#0d9412', borderColor: '#0d9412'   },
  login: { backgroundColor: '#0d9412' },
  google: { backgroundColor: '#e5e5e5' },
};

const CustomButton = ({
  variant = 'primary',
  size = 'md',
  block = false,
  style,
  className,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const combinedStyle = useMemo(() => {
    return {
      ...styleMap[variant],
      ...(isHovered ? hoverStyleMap[variant] : {}),
      ...style,
    };
  }, [variant, isHovered, style]);

  return (
    <AntButton
      size={sizeMap[size]}
      block={block}
      type="default"
      className={className}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    />
  );
};

export default CustomButton;
