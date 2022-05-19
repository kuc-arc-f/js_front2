import {useState, useEffect}  from 'react';
import React from 'react';
const ExcelJS = require('exceljs');
import axios from 'axios'

import Link from 'next/link';
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import ReactPaginate from 'react-paginate';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
import LibCommon from '@/lib/LibCommon'

const perPage = 100;
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
  userId: string,
  type_complete: number,
}
//
export default class TodoIndex extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
//console.log(items);  
    return {
      items: [],
    }
  }
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false, userId: '', type_complete: 0,
     };
//console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
    }
    let items = await this.getItems(uid);
    const items_all = items;
    items = items_all.filter(item => (item.complete === 0));
//console.log(items);
    LibPagenate.set_per_page(perPage);
    const n = LibPagenate.getMaxPage(items.length);
    const d = LibPagenate.getPageStart(0);
    this.setState({
      items: items.slice(d.start, d.end), items_all: items_all, button_display: true, pageCount: n,
      userId: uid,  
    })  
  }
  async getItems(uid: string){
    try{
      const item = { userId : uid};
      const res = await fetch(process.env.API_URI + '/todos/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
//  console.log(json);      
      return json;
    } catch (e) {
      console.error(e);
      alert("Error, get  items");
    }    
  }      
  handlePageClick (data: any) {
    console.log('onPageChange', data);
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);
    const d = LibPagenate.getPageStart(selected);
    const items = this.state.items_all.filter(item => 
      (item.complete === this.state.type_complete)
    );
//console.log(d);
    this.setState({
      offset: offset, 
      items: items.slice(d.start, d.end) 
    });
  } 
  clickTypeComplete(value: number){
console.log("clickTypeComplete", value);
    const nav_complete_none_tab = document.getElementById("nav_complete_none_tab"); 
    const nav_complete_tab = document.getElementById('nav_complete_tab');
    nav_complete_none_tab.classList.remove("active");
    nav_complete_tab.classList.remove("active");
//    console.log(typeof nav_complete_none_tab);
    if(value === 1){
      nav_complete_tab.classList.add('active');
    }else{
      nav_complete_none_tab.classList.add('active');
    }
    const items = this.state.items_all.filter(item => (item.complete === value));
    LibPagenate.set_per_page(perPage);
    const n = LibPagenate.getMaxPage(items.length);
    const d = LibPagenate.getPageStart(0);
console.log(items.length);
console.log(n, d);
    this.setState({
      items: items.slice(d.start, d.end), pageCount: n, offset: 0, type_complete: value 
    });
  }
  async clickHandler(e: any){
console.log("#clickHandler");
    e.preventDefault();
    let temp_name = "todo_temp.xlsx";
    if(this.state.type_complete === 1){
      temp_name = "todo_comple_temp.xlsx";
    }
// console.log(this.state.type_complete);
    const res = await axios.get("/" + temp_name, { responseType: "arraybuffer" });
    const data = new Uint8Array(res.data);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    //data
    const items = this.state.items_all.filter(item => (item.complete === this.state.type_complete));
    const worksheet = workbook.getWorksheet('sheet1');
    worksheet.pageSetup = {orientation:'portrait'};
    const startRow = 4;
    let iCount = 0;
    let row = worksheet.getRow(1);
    const borderObj = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };
// console.log(items);
    for (const item of items) {
      let pos = startRow + iCount;
      row = worksheet.getRow(pos);
      let date = LibCommon.converDateString(item.createdAt);
      row.getCell(1).value = item.id;
      row.getCell(2).value = date;
      row.getCell(3).value = item.title;
      iCount += 1;
    }
    // style
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // セルの枠線を設定
        if (rowNumber >= startRow) {
          cell.border = borderObj;
        }
      });
      row.commit();
    });    
    //save
    const uint8Array = await workbook.xlsx.writeBuffer();
//console.log(uint8Array);
    const blob = new Blob([uint8Array], {type: 'application/octet-binary'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo.xlsx`;
    a.click();
    a.remove()    
  }   
  render(){
    const currentPage = Math.round(this.state.offset / perPage);
    const data = this.state.items;
console.log(this.state);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-2 mb-4">
        <h3>Todos - index</h3>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6">
            <Link href="/todos/create">
              <button className="btn btn-primary mt-2">Create</button>
            </Link>
          </div>
          <div className="col-md-6  text-end">
            <button className="btn btn-sm btn-outline-success mx-2 mt-2"
             onClick={(e) => this.clickHandler(e)}>xlsx Export
            </button>
          </div>
        </div>
        <hr className="my-1" />
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className="nav-link active" id="nav_complete_none_tab"
            onClick={() => this.clickTypeComplete(0)} >Todo
            </button>                    
          </li>
          <li className="nav-item">
            <button className="nav-link" id="nav_complete_tab"
            onClick={() => this.clickTypeComplete(1)} >Complete
            </button>                    
          </li>
        </ul>  
        {/* data */}      
        {data.map((item: any ,index: number) => {
//          let date = LibCommon.converDateString(item.createdAt);
          let date = LibCommon.converDatetimeString(item.createdAt);
  //console.log(item.values.title);  created_at
          return (
            <IndexRow key={index} id={item.id} title={item.title} date={date} />
          )
        })}      
        <hr />
        <nav aria-label="Page navigation comments" className="mt-4">
          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={this.state.pageCount}
            pageRangeDisplayed={4}
            marginPagesDisplayed={2}
            onPageChange={this.handlePageClick.bind(this)}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
            hrefBuilder={(page, pageCount) =>
              page >= 1 && page <= pageCount ? `/page/${page}` : '#'
            }
            hrefAllControls
            forcePage={currentPage}
            onClick={(clickEvent) => {
              console.log('onClick', clickEvent);
            }}
          />
        </nav>        
      </div>
      <style>{`
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 2.4rem; }      
      `}</style>
    </Layout>
    );
  }
}
