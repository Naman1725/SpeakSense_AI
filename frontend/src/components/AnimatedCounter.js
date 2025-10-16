import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedCounter = ({ value, suffix = '', duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  const props = useSpring({
    number: value,
    from: { number: displayValue },
    config: { duration },
    onChange: ({ value: { number } }) => {
      setDisplayValue(Math.floor(number));
    },
  });

  return (
    <animated.span>
      {props.number.to(n => Math.floor(n))}
      {suffix}
    </animated.span>
  );
};

export default AnimatedCounter;
