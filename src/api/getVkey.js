import { commonParams,options } from "./config";
import jsonp from "common/js/jsonp";
import axios from 'axios'

export function getVkay(mid){
  const url = '/api/vkey';
  const data = Object.assign({},commonParams,{
    songmid:mid,
    filename:'C400'+ mid+'.m4a',
    guid:2675335170,
    platform:'yqq',
    loginUin:0,
    hostUin: 0,
    needNewCode: 0,
    g_tk:5381,
    uin:0,
    cid:205361747,
    format: 'json'
  });
  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data);
  })
}