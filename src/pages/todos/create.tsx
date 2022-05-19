import Link from 'next/link';
import Router from 'next/router'
import flash from 'next-flash';
import React, {Component} from 'react';

import LibCookie from "@/lib/LibCookie";
import LibTodo from "@/lib/LibTodo";
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
  user_id: string,
}
//
export default class TodoCreate extends Component<IProps, IState> {
  static async getInitialProps(ctx) {
//console.log(json)
    return {}
  }  
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
//console.log( "user_id=" , uid)
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
console.log("addItem:", this.state.userId);
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = LibTodo.replaceMutaionString(content.value);
      console.log(contentValue);
      const item = {
        title: title.value,
        content: contentValue,
        userId: this.state.userId,
      }
      const res = await fetch(process.env.API_URI + '/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      if(json.ret !== 'OK'){
        throw new Error('Error , fetch add');
      }            
      Router.push('/todos');
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
          <div className="row">
            <div className="col-md-4">
              <Link href="/todos">
                <a className="btn btn-outline-primary mt-2">Back</a>
              </Link>
            </div>
            <div className="col-md-4"><h3>Todos - Create</h3>
            </div>
            <div className="col-md-4">
            {this.state.button_display ? (
              <div className="form-group mt-2 text-center">
                <button className="btn btn-primary" onClick={this.handleClick}>Create
                </button>
              </div>                
              ): (<div />)
            }          
            </div>
          </div>
          <hr className="mt-2 mb-2" />
          <div className="col-md-6 form-group">
            <label>Title:</label>
            <input type="text" name="title" id="title" className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Content:</label>
            <div className="col-sm-12">
              <textarea name="content" id="content" className="form-control"
               rows={10} placeholder="markdown input, please"></textarea>
            </div>
          </div>
          <hr />
          {/*
          {this.state.button_display ? (
          <div className="form-group my-2">
            <button className="btn btn-primary" onClick={this.handleClick}>Create
            </button>
          </div>                
          ): (
            <div />
          )
          }          
          */}
        </div>
      </main>
    </Layout>
    )    
  } 
}

