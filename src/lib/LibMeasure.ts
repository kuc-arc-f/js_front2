import moment from 'moment';
const TIME_INIT_STR = "T00:00:00.000Z"

const LibMeasure = {
  getMonthItem: function(items , ym){
    try{
      let ret = [];
      const target = new Date(ym + "-01" + TIME_INIT_STR) ;
      const start = moment(target);
      const start_str = moment(target).format("YYYYMMDD");
//console.log(target , start);
//console.log(start_str);
      const end = start.add(1, 'month');
      const end_str = end.format("YYYYMMDD");
      console.log(end_str);
      for (const item of items) {
        let dt = new Date(Number(item.mdate))
        let dtStr = moment(dt).format("YYYYMMDD");
        if(Number(dtStr) >= Number(start_str) && 
          Number(dtStr) < Number(end_str)){
          ret.push(item);
        }
//console.log(dtStr);
      }
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, getMonthItem');
    }
  },
  getBeforeMonthStr: function(ym){
    try{
      let ret = "";
      const target = new Date(ym + "-01" + TIME_INIT_STR) ;
      const start = moment(target);
      const end = start.add(-1, 'month');
      ret = end.format("YYYY-MM");
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, getMonthItem');
    }
  },
  getNextMonthStr: function(ym){
    try{
      let ret = "";
      const target = new Date(ym + "-01" + TIME_INIT_STR) ;
      const start = moment(target);
      const end = start.add(1, 'month');
      ret = end.format("YYYY-MM");
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, getMonthItem');
    }
  },    
}
export default LibMeasure
