import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import Loading from '../components/Loading';
import Logo from '../components/Logo';

function Login() {
  const router = useRouter();

  const [cookie, setCookie] = useCookies();

  const [emailField, setEmailField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'email',
  });

  const [passwordField, setPasswordField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'password',
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeEmailInput = (e) => {
    const emailInput = e.target.value;

    if (emailInput === '') {
      setEmailField({
        isError: true,
        message: 'The email is required',
        value: emailInput,
        key: 'email',
      });
    } else if (
      !emailInput
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setEmailField({
        isError: true,
        message: 'The email you entered is invalid',
        value: emailInput,
        key: 'email',
      });
    } else {
      setEmailField({
        isError: false,
        message: '',
        value: emailInput,
        key: 'email',
      });
    }
  };

  const onChangePasswordInput = (e) => {
    const passwordInput = e.target.value;

    if (passwordInput === '') {
      setPasswordField({
        isError: true,
        message: 'The password is required',
        value: passwordInput,
        key: 'password',
      });
    } else if (passwordInput.length < 8) {
      setPasswordField({
        isError: true,
        message: 'Password filled in at least 8 characters',
        value: passwordInput,
        key: 'password',
      });
    } else {
      setPasswordField({
        isError: false,
        message: '',
        value: passwordInput,
        key: 'password',
      });
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      // set loading active
      setIsSubmitting(true);

      // call login API
      const result = await axios.post(
        process.env.instamedia_api_url + 'auth/login',
        {
          email: emailField.value,
          password: passwordField.value,
        }
      );

      if (result.data.status === 'success') {
        // set loading unactive
        setIsSubmitting(false);

        // share token to redux state
        const token = result.data.data.token;

        // set token to cookie
        setCookie('token', token);

        router.push('/');
      }
    } catch (error) {
      // set loading unactive
      setIsSubmitting(false);

      const responseData = error.response.data;

      if (responseData.status !== 'success') {
        const error_validation = responseData.data.error_validation;

        error_validation.map((err) => {
          if (err.param === emailField.key) {
            setEmailField({
              isError: true,
              message: responseData.data.message,
              value: emailField.value,
              key: emailField.key,
            });
          }
          if (err.param === passwordField.key) {
            setPasswordField({
              isError: true,
              message: responseData.data.message,
              value: passwordField.value,
              key: passwordField.key,
            });
          }
        });
      }
    }
  };

  return (
    <div className='flex flex-col md:items-center place-content-center min-h-screen gap-10'>
      <Head>
        <title>Login Instamedia</title>
        <meta property='og:title' content='Login Instamedia' key='title' />
      </Head>
      <div className='flex items-center place-content-center gap-16'>
        <div className='p-5 w-full mx-3 md:w-[437px] rounded-lg shadow-[0_14px_14px_rgba(63,63,63,0.15)]'>
          <Logo isLoginMobile />
          <span className='hidden lg:flex justify-center font-bold text-2xl text-primary mb-4'>
            Login
          </span>
          <form onSubmit={(e) => onLogin(e)}>
            <div className='flex flex-col mb-4'>
              <label htmlFor='email' className='font-normal text-base mb-2'>
                Email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='Enter your email'
                className='py-2.5 px-5 rounded-lg border-secondary border-2 placeholder:text-secondary focus:border-primary focus:outline-none focus:border-2'
                onChange={(e) => onChangeEmailInput(e)}
              />
              {emailField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {emailField.message}
                </p>
              )}
            </div>
            <div className='flex flex-col mb-4'>
              <label htmlFor='password' className='font-normal text-base mb-2'>
                Password
              </label>
              <div className='relative w-full'>
                <div className='absolute inset-y-0 right-0 flex px-3 pt-1'>
                  <input
                    className='hidden js-password-toggle'
                    type='checkbox'
                  />
                  {isShowPassword ? (
                    <EyeSlashIcon
                      className='text-gray-400 cursor-pointer js-password-label'
                      width={20}
                      onClick={() => setIsShowPassword(false)}
                    />
                  ) : (
                    <EyeIcon
                      className='text-gray-400 cursor-pointer js-password-label'
                      width={20}
                      onClick={() => setIsShowPassword(true)}
                    />
                  )}
                </div>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  id='password'
                  placeholder='Enter your password'
                  className='py-2.5 px-5 w-full rounded-lg border-secondary border-2 placeholder:text-secondary focus:border-primary focus:outline-none focus:border-2'
                  onChange={(e) => onChangePasswordInput(e)}
                />
              </div>
              {passwordField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {passwordField.message}
                </p>
              )}
            </div>
            <div className='flex items-center gap-1.5'>
              <p className='text-sm'>Remember Me</p>
              <input type='checkbox' className='w-4 h-4' />
            </div>
            <button
              type='submit'
              className='flex place-content-center py-2.5 px-5 rounded-lg bg-primary hover:bg-orange-500 transition-all duration-500 w-full mt-4 font-bold text-base cursor-pointer text-white'
            >
              {isSubmitting ? <Loading /> : <div>Login</div>}
            </button>
          </form>
          <p className='mt-4 text-sm'>
            Don’t have an account?{' '}
            <Link href='/register' className='font-bold text-primary'>
              Sign Up
            </Link>
          </p>
        </div>
        <div className='hidden lg:flex flex-col items-center gap-3'>
          <Logo />
          <Image
            src='/login-banner.svg'
            alt='login-banner'
            width={420}
            height={415}
          />
        </div>
      </div>
      <footer className='text-center mb-5'>
        <p className='text-sm text-gray-400'>
          &copy; 2022 Instamedia by{' '}
          <Link href='https://www.instagram.com/dosenkoding/' target='_blank'>
            DosenKoding
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default Login;
