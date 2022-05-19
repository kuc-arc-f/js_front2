import Link from 'next/link';
import moment from 'moment';
import LibBookmark from '@/lib/LibBookmark';

const IndexRow = function (props){
  const categoryItems: Array<any> = props.categoryItems;
//  let dtObj = new Date(Number(props.date));
  let dtObj = new Date(props.date);
  let dt = moment(dtObj);
  const dtStr = dt.format("YYYY-MM-DD HH:mm")
  let displayUrl = "";
//console.log(dtObj);
  if(typeof props.url === 'string'){
    displayUrl = LibBookmark.getUrlShort(props.url);
  }
//console.log(displayUrl)
  return (
  <div className="row justify-content-center">
    <div className="task_card_box card shadow-lg mb-2">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row">
          <div className="card_col_icon px-md-2 py-2 ">
            <i className="bi bi-clipboard"></i>
          </div>
          <div className="card_col_body  p-md-2">
            <h3>
              <Link href={`${props.url}`}><a target="_brank">{props.title}</a>
              </Link>
            </h3>
            {displayUrl} 
            <Link href={`${props.url}`}>
              <a className='btn btn-primary mx-2' target="_brank">Open</a>
            </Link><br />                                    
            ID : {props.id} , {dtStr} ,  Category : {props.categoryName}
            <Link href={`/bookmark/edit/${props.id}`}>
              <a className="btn btn-sm btn-outline-primary mx-2 mt-2"> Edit</a>
            </Link><br />                    
          </div>
        </div>
      </div>
    </div>
  </div>
  )
};
export default IndexRow;

