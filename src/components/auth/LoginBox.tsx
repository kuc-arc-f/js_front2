
import React from "react";

export default function Login() {
//  const text = props.text;
  return (
    <div className="bg-light">
      {/*
      <h3>Login</h3>
      */}
      <hr className="my-1" />
      <div className="col-sm-6">
        <label>メールアドレス</label>
        <input type="email" name="email" id="email" placeholder="email" className="form-control" />
      </div>
      <div className="col-sm-6">
        <label>パスワード</label>
        <input type="password" name="password" id="password" placeholder="password" className="form-control" />
      </div>      
      <hr />
    </div>
  );
}
