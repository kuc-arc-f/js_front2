import React, {Component} from 'react';
import Link from 'next/link';
//import { gql } from "@apollo/client";
//import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoginBox from '@/components/auth/LoginBox';
import { signInWithEmailAndPassword } from 'firebase/auth'
import LibCookie from '@/lib/LibCookie'
import {auth} from '@/firebase';

interface IProps {
  history:string[],
  tasks: any[],
}
interface IObject {
  id: number,
  title: string
}
//
function Page(props:IProps) {
//console.log(props.tasks);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const key = process.env.COOKIE_KEY_USER_ID;
    const { email, password } = event.target.elements;
console.log(email.value);      
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((user) => {
      console.log('ログイン成功=', user.user.uid)
      LibCookie.set_cookie(key, user.user.uid);
      location.href= '/';
    })
    .catch((error) => {
      console.error(error);
      alert("Error, Login");
    });
console.log("handleSubmit");

  } 
   
  return (
  <Layout>
    <div className="container py-4">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <LoginBox />
        <div>
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
      <hr />
      <div>
      <Link href="/auth/sign_up">
        <a><button className="btn btn-outline-primary">SignUp</button></a>
      </Link>        
      </div>      
    </div>
  </Layout>
  );
}

export default Page;

