import storage from "good-storage";

//  本地缓存

const SEARCH_KEY = "__search__";
const  SEARCH_MAX_LENGTH = 15;


function insertArray (arr,val,compare,maxLen){
  const index = arr.findIndex(compare);
  if(index===0){
    return;
  }
  if(index > 0){
    arr.splice(index,1);
  }
  arr.unshift(val);
  if(maxLen && arr.length > maxLen){
    arr.pop();
  }
}

function deleteFromArray(arr,compare){
  const index = arr.findIndex(compare);
  if(index > -1){
    arr.splice(index,1);
  }
}

export function saveSearch(query){
  let searchs = storage.get(SEARCH_KEY,[]);
  insertArray(searchs,query,(item)=>{
    return item ===query;
  },SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY,searchs);
  return searchs;
}

export function loadSearch(){
  return storage.get(SEARCH_KEY,[]);
}

export function deleteSearch(query){
  let searchs = storage.get(SEARCH_KEY,[]);
  deleteFromArray(searchs,(item)=>{
    return item === query;
  });
  storage.set(SEARCH_KEY,searchs);
  return searchs;
}

export function clearSearch(){
  storage.remove(SEARCH_KEY);
  return [];
}