// import {useState, useEffect}  from 'react';
import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import ReactPaginate from 'react-paginate';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
// import LibBookmark from '@/lib/LibBookmark';

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
  paginate_display: boolean,
  userId: string,
}
//
export default class Page extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false, userId: '', paginate_display: false,
     };
//console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log(uid);
    if(uid === null){
      location.href = '/auth/login';
      return;
    }
    let items = await this.getItems(uid);
    //category
    const item = { userId : uid};
    const res = await fetch(process.env.API_URI + '/bm_category/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(item),
    });
    const json = await res.json();
//console.log(json);
    let categoryItems = json;    
//console.log(categoryItems);
    LibPagenate.set_per_page(perPage);
    const n = LibPagenate.getMaxPage(items.length);
    const d = LibPagenate.getPageStart(0);
    this.setState({
      items: items.slice(d.start, d.end), items_all: items, button_display: true, pageCount: n,
      categoryItems: categoryItems, userId: uid, paginate_display: true,
    })  
  }
  async getItems(uid: string){
    try{
      const item = { userId : uid};
      const res = await fetch(process.env.API_URI + '/book_marks/index', {
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
// console.log(d);
// console.log(this.state.items_all);
    this.setState({
      offset: offset, 
      items: this.state.items_all.slice(d.start, d.end) 
    });
  }
  async clickClear(){
    location.href= '/bookmark';
  }
  async clickSearch(){
    try{
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
      const item = {
        userId : this.state.userId, seachKey: searchKey.value, 
      };
      const res = await fetch(process.env.API_URI + '/book_marks/searchBookMarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      console.log(json);
      this.setState({ items: json, paginate_display: false, button_display: true })            
    } catch (e) {
      console.error(e);
    }    
  }
  async changeCategory(){
    console.log("#changeCategory");
    try{
      const category = document.querySelector<HTMLInputElement>('#category');
      console.log(category.value);
      if(Number(category.value) === 0){
        location.href= '/bookmark';
        return;
      }
      this.setState({ items: [] , button_display: false })
      //
      const item = { bmCategoryId : category.value };
      const res = await fetch(process.env.API_URI + '/book_marks/categoryBookMarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(item),
      });
      const json = await res.json();
//      console.log(json);
      this.setState({ items: json, paginate_display: false, button_display: true })      
    } catch (e) {
      console.error(e);
    }    


  }  
  render(){
    const currentPage = Math.round(this.state.offset / perPage);
    const data = this.state.items;
//console.log(this.state);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container py-4">
        <h3>Bookmark - index</h3>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-6">
            <Link href="/bookmark/create">
              <a><button className="btn btn-primary">Create</button>
              </a>
            </Link>
          </div>
          <div className="col-md-6 text-end">
            <Link href="/bm_category">
              <a>
                <button className="btn btn-outline-success mx-4 ">Category
                </button>
              </a>
            </Link>        
          </div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-8 pt-2">
            <button onClick={() => this.clickClear()} className="btn btn-sm btn-outline-primary">Clear
            </button>
            <span className="search_key_wrap">
              {/* form-control form-control-sm */}
              <input type="text" size={24} className="mx-2 " name="searchKey" id="searchKey"
              placeholder="Title search Key" />        
            </span>
            <button onClick={() => this.clickSearch()} className="btn btn-sm btn-outline-primary">Search
            </button>
          </div>
          <div className="col-md-4">
            <label>Category:</label>
            <select className="form-select" name="category" id="category"
            onChange={() => this.changeCategory()}>
            <option key={0} value={0}></option>
            {this.state.categoryItems.map((item ,index) => (
              <option key={index} value={item.id}>{item.name}</option>
            ))
            }
            </select>
          </div>
        </div>
        <hr className="my-1" />
        {data.map((item: any ,index: number) => {
          let categoryName = "";
          let category = this.state.categoryItems.filter(
            categoryItem => (categoryItem.id === item.bmCategoryId)
          );
          if(category.length > 0){
            categoryName = category[0].name;
          }            
//console.log(item.createdAt);
          return (
            <IndexRow key={index} id={item.id} title={item.title} date={item.createdAt} 
            url={item.url} bmCategoryId={item.bmCategoryId} categoryName={categoryName}
            />
          )
        })}      
        <hr />
        {this.state.paginate_display ? (
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
        ): (<div></div>)
        }        
        
      </div>
      <style>{`
      .search_key_wrap{ width: 200px; }
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 2.4rem; }      
      `}</style>
    </Layout>
    );
  }
}
