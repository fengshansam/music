import { commonParams,options } from "./config";
import jsonp from "common/js/jsonp";
import axios from 'axios'

export function getSingerList(){
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({},commonParams,{
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk:1664029744
  });
  return jsonp(url, data, options);
}

export function getSingerDetail(singerId){
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  const data = Object.assign({},commonParams,{
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    order: 'listen',
    begin: 0,
    num:30,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options);
}

// export function getVkay(mid){
//   const url = '/api/vkey';
//   const data = Object.assign({},commonParams,{
//     songmid:mid,
//     filename:'C400'+ mid+'.m4a',
//     guid:2675335170,
//     platform:'yqq',
//     loginUin:0,
//     hostUin: 0,
//     needNewCode: 0,
//     g_tk:5381,
//     uin:0,
//     cid:205361747,
//     format: 'json'
//   });
//   return axios.get(url,{
//     params:data
//   }).then((res)=>{
//     return Promise.resolve(res.data);
//   })
// }