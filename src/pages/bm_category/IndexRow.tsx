import Link from 'next/link';
import moment from 'moment';

const IndexRow = function (props){
//  let dtObj = new Date(props.date);
  let dtObj = new Date(Number(props.date));
  let dt = moment(dtObj);
  const dtStr = dt.format("YYYY-MM-DD HH:mm")
  //console.log(typeof props.date)
  //console.log(dtStr)
  //console.log(String(dtObj) )
  return (
  <tr>
    <td>
      <h3>{props.name}
      </h3>
      ID: {props.id}
    </td>
    <td>
      <Link href={`/bm_category/edit/${props.id}`}>
        <a className="btn btn-sm btn-outline-primary"> Edit</a>
      </Link>
    </td>
  </tr>
  )
};
export default IndexRow;
