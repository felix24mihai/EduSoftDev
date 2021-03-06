import React from 'react';
import spinner from './images/spinner.gif';

const Spinner = () => {
  return (
    <div className='flex justify-center'>
      <img src={spinner} alt='Loading..' />
    </div>
  );
};

export default Spinner;
