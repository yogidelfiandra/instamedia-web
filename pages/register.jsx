import { CameraIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Logo from '../components/Logo';

function Register() {
  const router = useRouter();

  const [previewProfilePicture, setPreviewProfilePicture] = useState();

  const [profilPictureField, setProfilPictureField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'profile_picture',
  });

  const [fullnameField, setFullnameField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'name',
  });

  const [usernameField, setUsernameField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'username',
  });

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

  const [confirmPasswordField, setConfirmPasswordField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'confirm_password',
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profilPictureField.value) {
      setPreviewProfilePicture(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(profilPictureField.value);
    setPreviewProfilePicture(objectUrl);

    // free memory when even this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilPictureField.value]);

  // Event Handler
  const onChangeProfilePictureInput = (e) => {
    const profilePictureInput = e.target.files[0];

    if (profilePictureInput) {
      setProfilPictureField({
        isError: false,
        message: '',
        value: profilePictureInput,
        key: 'profile_picture',
      });
    } else {
      setProfilPictureField({
        isError: true,
        message: 'The profile photo is required',
        value: profilePictureInput,
        key: 'profile_picture',
      });
    }
  };

  const onChangeFullnameInput = (e) => {
    const fullnameInput = e.target.value;

    if (fullnameInput !== '') {
      setFullnameField({
        isError: false,
        message: '',
        value: fullnameInput,
        key: 'name',
      });
    } else {
      setFullnameField({
        isError: true,
        message: 'The name is required',
        value: fullnameInput,
        key: 'name',
      });
    }
  };

  const onChangeUsernameInput = (e) => {
    const usernameInput = e.target.value;

    if (usernameInput !== '') {
      setUsernameField({
        isError: false,
        message: '',
        value: usernameInput,
        key: 'username',
      });
    } else {
      setUsernameField({
        isError: true,
        message: 'The username is required',
        value: usernameInput,
        key: 'username',
      });
    }
  };

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

  const onChangeConfirmPasswordInput = (e) => {
    const confirmPasswordInput = e.target.value;

    if (confirmPasswordInput === '') {
      setConfirmPasswordField({
        isError: true,
        message: 'The confirm password is required',
        value: confirmPasswordInput,
        key: confirmPasswordField.key,
      });
    } else if (confirmPasswordInput !== passwordField.value) {
      setConfirmPasswordField({
        isError: true,
        message: 'The password does not match',
        value: confirmPasswordInput,
        key: confirmPasswordField.key,
      });
    } else {
      setConfirmPasswordField({
        isError: false,
        message: '',
        value: confirmPasswordInput,
        key: confirmPasswordField.key,
      });
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();

    try {
      // Set Loading Active
      setIsSubmitting(true);

      const payload = new FormData();

      payload.append(profilPictureField.key, profilPictureField.value);
      payload.append(fullnameField.key, fullnameField.value);
      payload.append(usernameField.key, usernameField.value);
      payload.append(emailField.key, emailField.value);
      payload.append(passwordField.key, passwordField.value);

      const result = await axios.post(
        process.env.instamedia_api_url + 'auth/register',
        payload
      );

      if (result.data.status === 'success') {
        // Set Loading Unactive
        setIsSubmitting(false);

        router.push('/login');
      }
    } catch (error) {
      // Set Loading Unactive
      setIsSubmitting(false);

      const responseData = error.response.data;
      const error_validation = responseData.data.error_validation;

      error_validation.map((err) => {
        if (err.param === profilPictureField.key) {
          setProfilPictureField({
            isError: true,
            message: responseData.data.message,
            value: profilPictureField.value,
            key: profilPictureField.key,
          });
        }

        if (err.param === fullnameField.key) {
          setFullnameField({
            isError: true,
            message: 'fullname is required',
            value: fullnameField.value,
            key: fullnameField.key,
          });
        }

        if (err.param === usernameField.key) {
          setUsernameField({
            isError: true,
            message: 'username is required',
            value: usernameField.value,
            key: usernameField.key,
          });
        }

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
  };

  return (
    <div className='flex flex-col md:items-center place-content-center min-h-screen gap-10'>
      <Head>
        <title>Register Instamedia</title>
        <meta property='og:title' content='Register Instamedia' key='title' />
      </Head>
      <div className='flex items-center place-content-center lg:mt-8 gap-16'>
        <div className='p-5 rounded-lg w-full mx-3 md:w-[437px] shadow-[0_14px_14px_rgba(63,63,63,0.15)]'>
          <p className='text-primary font-bold text-2xl text-center mb-6'>
            Register
          </p>

          <form onSubmit={(e) => onRegister(e)}>
            <div className='flex items-center place-content-center mb-4'>
              <div className='flex flex-col items-center place-content-center rounded-full bg-[#EFEFEF] w-[100px] h-[100px] cursor-pointer'>
                {profilPictureField.value ? (
                  <div>
                    <Image
                      className='rounded-full'
                      src={previewProfilePicture || ''}
                      width={100}
                      height={100}
                      alt='preview-profile-picture'
                    />
                  </div>
                ) : (
                  <CameraIcon width={40} className='text-gray-400' />
                )}
                <input
                  type='file'
                  name=''
                  id=''
                  className='absolute w-[100px] h-[100px] rounded-full opacity-0 cursor-pointer'
                  onChange={(e) => onChangeProfilePictureInput(e)}
                />{' '}
              </div>
              {profilPictureField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {profilPictureField.message}
                </p>
              )}
            </div>
            <div className='flex flex-col mb-4'>
              <label htmlFor='fullname' className='font-normal text-base mb-2'>
                Fullname
              </label>
              <input
                type='text'
                name='fullname'
                id='fullname'
                placeholder='Enter your fullname'
                className='py-2.5 px-5 rounded-lg border-secondary border-2 placeholder:text-secondary focus:border-primary focus:outline-none focus:border-2'
                onChange={(e) => onChangeFullnameInput(e)}
              />{' '}
              {fullnameField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {fullnameField.message}
                </p>
              )}
            </div>
            <div className='flex flex-col mb-4'>
              <label htmlFor='username' className='font-normal text-base mb-2'>
                Username
              </label>
              <input
                type='text'
                name='username'
                id='username'
                placeholder='Enter your username'
                className='py-2.5 px-5 rounded-lg border-secondary border-2 placeholder:text-secondary focus:border-primary focus:outline-none focus:border-2'
                onChange={(e) => onChangeUsernameInput(e)}
              />{' '}
              {usernameField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {usernameField.message}
                </p>
              )}
            </div>
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
              />{' '}
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
            <div className='flex flex-col mb-4'>
              <label
                htmlFor='confirm_password'
                className='font-normal text-base mb-2'
              >
                Confirm Password
              </label>
              <div className='relative w-full'>
                <div className='absolute inset-y-0 right-0 flex px-3 pt-1'>
                  <input
                    className='hidden js-password-toggle'
                    type='checkbox'
                  />
                  {isShowConfirmPassword ? (
                    <EyeSlashIcon
                      className='text-gray-400 cursor-pointer js-password-label'
                      width={20}
                      onClick={() => setIsShowConfirmPassword(false)}
                    />
                  ) : (
                    <EyeIcon
                      className='text-gray-400 cursor-pointer js-password-label'
                      width={20}
                      onClick={() => setIsShowConfirmPassword(true)}
                    />
                  )}
                </div>
                <input
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  name='confirm_password'
                  id='confirm_password'
                  placeholder='Confirm your password'
                  className='py-2.5 px-5 w-full rounded-lg border-secondary border-2 placeholder:text-secondary focus:border-primary focus:outline-none focus:border-2'
                  onChange={(e) => onChangeConfirmPasswordInput(e)}
                />
              </div>
              {confirmPasswordField.isError && (
                <p className='text-red-600 text-xs mt-1'>
                  {confirmPasswordField.message}
                </p>
              )}
            </div>
            <button
              type='submit'
              className='flex place-content-center py-2.5 px-5 rounded-lg bg-primary hover:bg-orange-500 transition-all duration-500 w-full mt-4 font-bold text-base cursor-pointer text-white'
            >
              {isSubmitting ? <Loading /> : <div>Register</div>}
            </button>
          </form>
          <p className='mt-4 text-sm'>
            Already have an account?{' '}
            <Link href='/login' className='font-bold text-primary'>
              Login
            </Link>
          </p>
        </div>
        <div className='hidden lg:flex flex-col items-center gap-10'>
          <Logo />
          <Image
            src='/register-banner.svg'
            alt='register-banner'
            width={500}
            height={390}
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

export default Register;
