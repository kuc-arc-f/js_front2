import moment from 'moment';

const LibCommon = {
  /* postgres, date format */
  converDateString: function(value){
    try{
      let ret = "";
//      let dtObj = new Date(Number(value));
      let dtObj = new Date(value);
      let dt = moment(dtObj);      
      ret = dt.format("YYYY-MM-DD");
      return ret;
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },
  converDatetimeString: function(value){
    try{
      let ret = "";
      let dtObj = new Date(value);
      let dt = moment(dtObj);      
      ret = dt.format("YYYY-MM-DD HH:mm");
      return ret;
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },

}
export default LibCommon
