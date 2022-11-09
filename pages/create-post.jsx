import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Store } from 'react-notifications-component';
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Loading from '../components/Loading';
import { selectUser } from '../slices/userSlice';

function CreatePost() {
  const router = useRouter();

  const user = useSelector(selectUser);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesField, setImagesField] = useState([]);
  const [descriptionField, setDescriptionField] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [section, setSection] = useState('first');

  const onChangeImagesInput = (e) => {
    const imagesInput = e.target.files;

    if (imagesInput.length) setImagesField(imagesInput);
  };

  const onChangeDescriptionInput = (e) => {
    const descriptionInput = e.target.value;

    if (descriptionInput) setDescriptionField(descriptionInput);
  };

  useEffect(() => {
    if (!imagesField.length) {
      setPreviewImages([]);
      return;
    }

    let objectUrl;
    const imagesURL = [];

    Array.from(imagesField).map((img) => {
      objectUrl = URL.createObjectURL(img);

      imagesURL.push(objectUrl);
    });

    setPreviewImages(imagesURL);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imagesField]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Set Loading Active
      setIsSubmitting(true);

      const payload = new FormData();

      payload.append('description', descriptionField);
      Array.from(imagesField).map((file) => payload.append('images', file));

      const result = await axios.post(
        process.env.instamedia_api_url + 'posts',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (result.data.status === 'success') {
        // Set Loading Unactive
        setIsSubmitting(false);

        Store.addNotification({
          title: 'Success',
          message: result.data.data.message,
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });

        router.push('/');
      }
    } catch (err) {
      // Set Loading Unactive
      setIsSubmitting(false);

      Store.addNotification({
        title: 'Gagal',
        message: err.message,
        type: 'warning',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  };

  return (
    <div className='flex flex-col items-center place-content-center'>
      <Head>
        <title>Create Post - Instamedia</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='min-h-screen w-full sm:w-max bg-white'>
        <div className='flex w-full sm:w-[500px] place-content-center p-5'>
          <Link href='/'>
            <ArrowLeftIcon width={20} className='cursor-pointer text-primary' />
          </Link>
          <h1 className='m-auto text-sm font-semibold'>Create Post</h1>
          {section === 'first' ? (
            <button
              disabled={!previewImages.length}
              className={`text-sm ${
                previewImages.length ? 'text-primary' : 'text-secondary'
              }  font-semibold`}
              onClick={() => setSection('second')}
            >
              Next
            </button>
          ) : (
            <button
              className='text-sm text-primary font-semibold'
              onClick={(e) => onSubmit(e)}
            >
              {isSubmitting ? <Loading color='text-primary' /> : 'Share'}
            </button>
          )}
        </div>
        <hr />
        {/* Section 1 */}
        {section === 'first' ? (
          <div className='m-auto flex flex-col w-full sm:w-[500px] place-content-start p-5 items-center space-y-5'>
            {previewImages.length > 0 && (
              <div className='grid grid-cols-3 gap-4'>
                {previewImages.map((img, index) => (
                  <Image
                    key={index}
                    className='rounded-lg'
                    src={img || ''}
                    width='150'
                    height='150'
                    alt='images'
                  />
                ))}
              </div>
            )}
            <div className='absolute m-auto top-[50%]'>
              {!previewImages.length && (
                <div className='w-full flex items-center place-content-center mb-5'>
                  <DocumentPlusIcon
                    width={40}
                    className='text-secondary text-center'
                  />
                </div>
              )}
              <button className='bg-primary w-max text-white text-sm px-5 py-3 rounded-lg cursor-pointer'>
                <div className='flex'>
                  Select from computer
                  <input
                    type='file'
                    multiple
                    className='absolute w-[150px] opacity-0 bg-white'
                    onChange={(e) => onChangeImagesInput(e)}
                  />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Carousel
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              className='w-full sm:w-[500px]'
            >
              {previewImages.map((img, index) => (
                <Image
                  key={index}
                  src={img || ''}
                  width={500}
                  height={500}
                  alt=''
                />
              ))}
            </Carousel>
            <div className='px-5 space-y-5'>
              <div className='flex items-center gap-3 text-sm font-semibold'>
                <Image
                  className='rounded-full'
                  src={user.creds.profile_picture || ''}
                  width='40'
                  height='40'
                  alt='profile_picture'
                />
                <p>{user.creds.username}</p>
              </div>
              <textarea
                className='w-full focus:outline-none'
                placeholder='Write Caption'
                onChange={(e) => onChangeDescriptionInput(e)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
