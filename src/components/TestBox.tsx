
import React from "react";
type Props = {
  parent: any;
};

export default function TestBox(props :Props) {
//  console.log(props.parent.state);
  const clickTest = function(){
    console.log(props.parent.state.count);
    let n = props.parent.state.count + 1;
    props.parent.setState({count: n});
  }
  return (
    <div className="bg-light">
      <h3>TestBox</h3>
      <hr className="my-1" />
      <button onClick={() => clickTest() }>clickTest
      </button>
    </div>
  );
}
