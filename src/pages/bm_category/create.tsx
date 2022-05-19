import Link from 'next/link';
import Router from 'next/router'
import flash from 'next-flash';
import React, {Component} from 'react';

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
}
interface IProps {
  csrf: any,
}
//
export default class TaskCreate extends Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', userId: '', button_display: false
    }
    this.handleClick = this.handleClick.bind(this);
//console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
//console.log( "uid=" , uid)
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/login');
    }else{
  //console.log(data.data.getToken);
      this.setState({
        userId: uid, button_display: true,
      });    
    }
  }   
  handleClick(){
    this.addItem()
  } 
  async addItem(){
    try {
      const name = document.querySelector<HTMLInputElement>('#name');
      const item = {
        name: name.value,
        userId: this.state.userId,
      }
      const res = await fetch(process.env.API_URI + '/bm_category/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      if(json.ret !== 'OK'){
        throw new Error('Error , fetch add');
      }      
//console.log(title.value);
      Router.push('/bm_category');
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  } 
  render() {
console.log(this.state);
    return (
    <Layout>
      <main>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}
        <div className="container">
          <Link href="/bookmark">
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h1>Category - Create</h1>
          <div className="col-md-6">
            <label>Name:</label>
            <input type="text" className="form-control" name="name" id="name"
             />
          </div>
          {this.state.button_display ? (
          <div className="form-group my-2">
            <button className="btn btn-primary" onClick={this.handleClick}>Create
            </button>
          </div>                
          ): (
          <div>false</div>
          )
          }          
          <hr />
          {/*
          */}
        </div>
      </main>
    </Layout>
    )    
  } 
}

