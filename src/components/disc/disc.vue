<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import {mapGetters} from 'vuex';
import {getSongList} from 'api/recommend';
import { ERR_OK } from "api/config";
import {createSong} from 'common/js/song'
import { getVkay } from "api/getVkey"
export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs:[],
      original: [],
      keyArray:[]
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList(){
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return;
      }
      getSongList(this.disc.dissid).then((res)=>{
        if(res.code===ERR_OK){
          this.original = res.cdlist[0].songlist;
          this._getUrl(res.cdlist[0].songlist);
        }
      })
    },
    _getUrl(list) {
      list.forEach(item => {
        this._getVkay(item.songmid);
      });
    },
    _getVkay(mid) {
      getVkay(mid).then(res => {
        if (res.code === ERR_OK) {
          this.keyArray.push(res.data.items[0]);
        }
      });
    },
    _normalizeSongs(list){
      let ret = [];
      list.forEach((musicData,index)=>{
        if(musicData.songid && musicData.albummid){
          ret.push(createSong(musicData,this.keyArray[index].vkey))
        }
      });
      this.songs = ret;
    }
  },
  watch:{
    keyArray(newVal) {
      if (newVal.length === this.original.length) {
        this._normalizeSongs(this.original);
      }
    }
  },
  computed: {
    title(){
      return this.disc.dissname;
    },
    bgImage(){
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>