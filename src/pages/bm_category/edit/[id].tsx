//import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router'
import React from 'react'
import flash from 'next-flash';

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  name: string,
  //url: string,
  _token: string,
  userId: string,
  button_display: boolean,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  user_id: string,
}
//
export default class Edit extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
    console.log("id=", ctx.query.id)
    const id = ctx.query.id
    const res = await fetch(process.env.API_URI + '/bm_category/show/' + id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    });
    const json = await res.json();
//console.log(json); 
    const item = json;    
    return {
      id: id,
      item: item,
      user_id : '',
      csrf: '',
    };
  }
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.state = {
      name: this.props.item.name, 
      _token : this.props.csrf.token,
      userId: '', button_display: false,
    }
console.log(this.props )
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log( "userId=" , uid)    
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/login');
    }else{
      this.setState({
        userId: uid, button_display: true,
      });      
    }
  }     
  async handleClickDelete(){
    console.log("#deete-id:" , this.props.id)
    try {
      const item = {
        id: this.props.id,
      }
      const res = await fetch(process.env.API_URI + '/bm_category/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      if(json.ret !== 'OK'){
        throw new Error('Error , fetch save');
      }      
      Router.push('/bm_category');      
    } catch (error) {
      console.error(error);
    }     
  } 
  async handleClick(){
  console.log("#-handleClick")
    await this.update_item()
  }     
  async update_item(){
    try {
      console.log("#update_item-id:" , this.props.id);
      const name = document.querySelector<HTMLInputElement>('#name');
      const item = {
        id: this.props.id,
        name: name.value,
      }
      const res = await fetch(process.env.API_URI + '/bm_category/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      if(json.ret !== 'OK'){
        throw new Error('Error , fetch save');
      }      
      Router.push('/bm_category');
    } catch (error) {
      console.error(error);
      alert("Error, save item");
    }     
  }  
  render() {
console.log(this.state);
    return (
      <Layout>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )
        }        
        <div className="container">
          <Link href="/bm_category">
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h1>bookmark - Edit</h1>
          <hr className="my-1" />
          <div className="col-md-6">
            <label>Name:</label>
            <input type="text" id="name" className="form-control"
            defaultValue={this.state.name}
             />
          </div>
          {this.state.button_display ? (
          <div>
            <div className="form-group mt-2">
              <button className="btn btn-primary" onClick={this.handleClick}>Save
              </button>
            </div>
            <hr />                  
            <div className="form-group">
              <button className="btn btn-danger" onClick={this.handleClickDelete}>Delete
              </button>
            </div>
          </div>
          ): ""
          }          
          <hr />
          ID : {this.props.id}
        </div>
      </Layout>
    );
  }
}

