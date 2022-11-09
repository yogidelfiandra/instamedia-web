import { HeartIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'cookies';
import moment from 'moment';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Navbar from '../components/Navbar';
import { addUser } from '../slices/userSlice';

export default function Home({ user, posts }) {
  const [postData, setPostData] = useState(posts);

  const dispatch = useDispatch();
  if (user) dispatch(addUser(user));

  const onLikePost = async (e, post) => {
    e.preventDefault();

    if (post.is_user_liked) {
      await axios.delete(
        process.env.instamedia_api_url + `post-likes/${post.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } else {
      await axios.post(
        process.env.instamedia_api_url + 'post-likes',
        {
          post_id: post.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    }

    // Get Posts
    const postResponse = await fetch(process.env.instamedia_api_url + 'posts', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const posts = await postResponse.json();
    setPostData(posts.data.posts);
  };

  return (
    <div className='flex flex-col items-center place-content-center'>
      <Head>
        <title>Instamedia</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar isMobile />
      <Navbar />
      <div className='w-full sm:w-[400px] sm:mt-28 sm:space-y-5'>
        {postData.map((post) => (
          <div key={post.id} className='sm:border sm:rounded-xl bg-white'>
            {/* Title */}
            <div className='flex items-center space-x-2 p-5'>
              <Image
                src={post.user_profile_picture || ''}
                width={25}
                height={25}
                alt=''
              />
              <h1 className='text-sm font-semibold'>{post.user_username}</h1>
            </div>
            {/* Images  */}
            <Carousel
              showStatus={false}
              emulateTouch={true}
              showArrows={false}
              showThumbs={false}
            >
              {post.images.map((img) => (
                <Image
                  key={img.id || ''}
                  src={img}
                  width={400}
                  height={400}
                  alt=''
                />
              ))}
            </Carousel>
            {/* Like  */}
            <div className='px-5 relative flex place-content-end -mt-5'>
              <HeartIcon
                className={`${
                  post.is_user_liked
                    ? 'text-white bg-primary'
                    : 'text-secondary bg-white'
                } shadow-lg  p-2 rounded-full cursor-pointer`}
                width={45}
                onClick={(e) => onLikePost(e, post)}
              />
            </div>
            {/* Likes Count  */}
            <div className='px-5 flex space-x-1 items-center'>
              {post.total_likes > 0 ? (
                <p className='text-xs font-bold'>{post.total_likes} likes</p>
              ) : (
                ''
              )}
            </div>
            {/* Description */}
            <div className='flex items-center text-xs px-5 pb-5 mt-3 space-x-1'>
              <h1 className='font-semibold'>{post.user_username}</h1>
              <p>{post.description}</p>
            </div>
            <p className='text-[10px] mx-5 mb-3'>
              {moment([
                new Date(post.created_at).getFullYear(),
                new Date(post.created_at).getMonth(),
                new Date(post.created_at).getDate(),
              ]).fromNow()}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);
  const cookieToken = cookies.get('token');

  try {
    // check Auth
    if (cookieToken != undefined) {
      const token = decodeURIComponent(cookieToken);

      const header = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Get logged user
      const userResponse = await fetch(
        process.env.instamedia_api_url + 'auth/me',
        { headers: header }
      );

      const user = await userResponse.json();

      if (user.status !== 'success') throw new Error('Unauthenticated');

      user.data.token = token;

      // Get Posts
      const postsResponse = await fetch(
        process.env.instamedia_api_url + 'posts',
        {
          headers: header,
        }
      );

      const posts = await postsResponse.json();
      return {
        props: {
          user: user.data,
          posts: posts.data.posts,
        },
      };
    }
    throw new Error('Unauthenticated');
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
