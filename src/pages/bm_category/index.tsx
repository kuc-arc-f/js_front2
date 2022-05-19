import {useState, useEffect}  from 'react';
import React from 'react';
import Link from 'next/link';
//import { gql } from "@apollo/client";
//import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
//import cookies from 'next-cookies';
import ReactPaginate from 'react-paginate';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'

const perPage = 5;
interface IProps {
  items: Array<object>,
  history:string[],
}
interface IState {
  items: any[],
  items_all: any[],
  categoryItems: any[],
  category: string,
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
}
//
export default class NotesIndex extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false,
     };
//console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
    }else{
      const item = { userId : uid};
      const res = await fetch(process.env.API_URI + '/bm_category/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
//console.log(json);
      let items = json;
      LibPagenate.set_per_page(perPage);
      const n = LibPagenate.getMaxPage(items.length);
      this.setState({
        items: items, items_all: items, button_display: true, pageCount: n, 
      })  
//      return json;      
    }
    /*
    let items = data.data.bmCategories;
    */
  }    
  render(){
    const data = this.state.items;
console.log(this.state);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container py-2">
        <Link href="/bookmark">
          <button className="btn btn-outline-primary mt-2">Back Bookmark</button>
        </Link>        
        <hr className="my-2" />
        <h3>BookMark Category</h3>
        <hr className="my-1" />
        <Link href="/bm_category/create">
          <button className="btn btn-primary mt-2">Create</button>
        </Link>
        <hr className="my-1" />
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item: any ,index: number) => {
// console.log(item);
            return (
              <IndexRow key={index} id={item.id} name={item.name} date={item.createdAt} 
              url={item.url} />
            )
          })}      
          </tbody>
        </table>
      </div>
    </Layout>
    );
  }
}
