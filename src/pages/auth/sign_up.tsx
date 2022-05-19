import React, {Component} from 'react';
//import { gql } from "@apollo/client";
//import client from '@/apollo-client'
//import Layout from '../components/layout'
import Layout from '@/components/layout'
import SignUpBox from '@/components/auth/SignUpBox';
import { createUserWithEmailAndPassword } from 'firebase/auth'
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
    const { email, password } = event.target.elements;
console.log(email.value);
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then( async(userCredential) => {
      console.log('user created');
      console.log(userCredential.user);
      console.log(userCredential.user.uid);
      //
      alert("OK, save");
      location.href= '/auth/login';      
    })
  } 
   
  return (
  <Layout>
    <div className="container py-4">
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <SignUpBox />
        <div>
          <button className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </Layout>
  );
}


export default Page;

