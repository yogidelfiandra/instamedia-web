import Image from 'next/image';
import propTypes from 'prop-types';
import React from 'react';

function Logo(props) {
  if (props.isLoginMobile) {
    return (
      <div className='flex items-center justify-center space-x-2 mb-10 lg:hidden'>
        <Image src='/logo.svg' width='40' height='40' alt='icon' />
        <h1 className='text-primary text-2xl font-bold'>Instamedia</h1>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center space-x-2'>
      <Image src='/logo.svg' width='40' height='40' alt='icon' />
      <h1 className='text-primary text-2xl font-bold'>Instamedia</h1>
    </div>
  );
}

export default Logo;

Logo.propTypes = {
  isLoginMobile: propTypes.bool,
};
