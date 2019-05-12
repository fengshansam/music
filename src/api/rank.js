import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

export function getTopList() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign ({},commonParams,{
    platform:'h5',
    uin:0,
    needNewCode:1,
    notice: 0
  });
  return jsonp (url,data,options);
}

export function getMusicList(topid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign ({},commonParams,{
    topid,
    platform:'h5',
    uin:0,
    needNewCode:1,
    notice: 0,
    format: 'json',
    tpl: 3,
    page: 'detail',
    type: 'top'
  });
  return jsonp (url,data,options);
}