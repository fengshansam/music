<template>
  <scroll ref="suggest" class="suggest" 
  :data = result 
  :pullup="pullup"
  @scrollToEnd="searchMore" 
  @beforeScroll = "listScroll"
  :beforeScroll="beforeScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading  title="" v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from "api/search";
import { ERR_OK } from "api/config"; 
import { createSong } from "common/js/song";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import Singer from "common/js/singer";
import NoResult from "base/no-result/no-result";
import {mapMutations,mapActions} from "vuex";
const TYPE_SINGER = 'singer';
const perpage = 20;
export default {
  components:{
    scroll,
    loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup:true,
      hasMore:true,
      beforeScroll:true
    };
  },
  methods: {
    _search() {
      this.hasMore = true;
      this.page = 1;
      search(this.query, this.showSinger, this.page,perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.genResult(res.data);
          this.checkMore(res.data);
        }
      });
    },
    searchMore(){
      if(!this.hasMore){
        return;
      }
      this.page++;
       search(this.query, this.showSinger, this.page,perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this.genResult(res.data));
          this.checkMore(res.data);
        }
      });
    },
    checkMore(data){
      const song = data.song;
      if(!song.list.length||(song.curnum+song.curpage*perpage)>song.totalnum){
        this.hasMore = false;
      }
    },
    genResult(data){
      var ret = [];
      if(data.zhida&&data.zhida.singerid){
          ret.push({...data.zhida,...{"type":TYPE_SINGER}});
      };
      if(data.song){
        ret = ret.concat(this.normallizeSong(data.song.list));
      };
      return ret;
    },
    normallizeSong(list){
      let  ret = [];
      list.forEach((musicData) => {
        if(musicData.songid&&musicData.albumid){
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    getIconCls(item){
      if(item.type===TYPE_SINGER){
        return 'icon-mine';
      }else{
        return 'icon-music';
      }

    },
    getDisplayName(item){
      if(item.type===TYPE_SINGER){
        return item.singername;
      }else{
        return `${item.name}-${item.singer}`
      }
    },
    selectItem(item){
     if(item.type == TYPE_SINGER){
       const singer = new Singer({
          id:item.singermid,
          name:item.singername
       });
       this.$router.push({
         path:`/search/${singer.id}`
       });
       this.setSinger(singer);
     }else{
       this.insertSong(item);
     }
     this.$emit('select');
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    ...mapActions([
      "insertSong"
    ]),
    listScroll(){
      this.$emit("listScroll");
    }
  },
  watch: {
    query() {
      this._search();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>