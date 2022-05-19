const LibTest = {
  test1: function(count, setCount){
    try{
      let value = count + 1;
      setCount(value);
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },
  /*
  parent : this(呼出しcomponent)
  */
  test2: function(parent){
    try{
      let n = parent.state.count + 1;
      parent.setState({count: n});
//      console.log(n);
    } catch (e) {
      console.log(e);
      throw new Error('error, test2:' + e);
    }
  },  
}
export default LibTest
