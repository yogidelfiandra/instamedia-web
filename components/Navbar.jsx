import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { DocumentPlusIcon, HomeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import propTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { removeUser, selectUser } from '../slices/userSlice';
import Logo from './Logo';

const cookies = new Cookies();

function Navbar(props) {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [isLogoutDropdownActive, setIsLogoutDropdownActive] = useState(false);

  const onLogout = (e) => {
    e.prevenDefault();

    dispatch(removeUser());
    cookies.remove('token');

    router.push('/login');
  };

  if (props.isMobile) {
    return (
      <nav className='fixed w-full top-0 bg-white z-50 flex justify-between items-center place-content-center py-3 px-3 sm:py-5 sm:px-5 focus:outline-none md:hidden'>
        <Logo isMobile />
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex px-2 pt-2.5'>
            <label htmlFor='search'>
              <MagnifyingGlassIcon
                width={10}
                height={10}
                className='text-secondary'
              />
            </label>
          </div>
          <input
            type='text'
            placeholder='search....'
            id='search'
            className='border border-secondary rounded-lg py-1.5 pl-6 pr-2.5 text-[10px] sm:text-xs w-[175px] sm:w-[250px] focus:outline-none'
          />
        </div>

        <Link href='/'>
          <HomeIcon className='text-primary cursor-pointer' width={20} />
        </Link>

        <Link href='/create-post'>
          <DocumentPlusIcon
            className='text-secondary cursor-pointer'
            width={20}
          />
        </Link>

        <div className='relative inline-block text-left'>
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={() => setIsLogoutDropdownActive(!isLogoutDropdownActive)}
          >
            <Image
              className='rounded-full'
              src={user.creds.profile_picture}
              width='24'
              height='24'
              alt={`profile-${user.creds.username}`}
            />
            <p className='hidden sm:block text-base leading-4 order-1 flex-grow-0 font-medium'>
              {user.creds.username}
            </p>
          </div>

          {isLogoutDropdownActive && (
            <div
              className='origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='menu-button'
              tabIndex='-1'
            >
              <div
                className='flex py-2 px-3 space-x-2 items-center text-sm text-red-600 cursor-pointer'
                onClick={(e) => onLogout(e)}
              >
                <ArrowRightOnRectangleIcon width={20} />
                <p>Logout</p>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className='fixed w-full top-0 bg-white z-50 md:flex justify-between lg:space-x-7 items-center lg:place-content-center py-5 px-3 focus:outline-none hidden'>
      <Logo />
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 flex px-2 pt-2'>
          <label htmlFor='search'>
            <MagnifyingGlassIcon
              width={19}
              height={19}
              className='text-secondary'
            />
          </label>
        </div>
        <input
          type='text'
          placeholder='search....'
          id='search'
          className='border border-secondary rounded-lg py-1.5 px-9 text-sm w-full sm:w-[300px] lg:w-[400px] focus:outline-none'
        />
      </div>

      <Link href='/'>
        <HomeIcon className='text-primary cursor-pointer' width={30} />
      </Link>

      <Link href='/create-post'>
        <DocumentPlusIcon
          className='text-secondary cursor-pointer'
          width={30}
        />
      </Link>

      <div className='relative inline-block text-left'>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => setIsLogoutDropdownActive(!isLogoutDropdownActive)}
        >
          <Image
            className='rounded-full'
            src={user.creds.profile_picture}
            width='40'
            height='40'
            alt={`profile-${user.creds.username}`}
          />
          <p className='hidden sm:block text-base leading-4 order-1 flex-grow-0 font-medium'>
            {user.creds.username}
          </p>
        </div>

        {isLogoutDropdownActive && (
          <div
            className='origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='menu-button'
            tabIndex='-1'
          >
            <div
              className='flex py-2 px-3 space-x-2 items-center text-sm text-red-600 cursor-pointer'
              onClick={(e) => onLogout(e)}
            >
              <ArrowRightOnRectangleIcon width={20} />
              <p>Logout</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

Navbar.propTypes = {
  isMobile: propTypes.bool,
};
