<template>
  <transition name="slide">
    <music-list :title="title" :rank="rank" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { getVkay } from "api/getVkey";
import { createSong } from "common/js/song";
export default {
  components: {
    musicList
  },
  data() {
    return {
      songs: [],
      original: [],
      keyArray: [],
      rank:true
    };
  },
  created() {
    this._getMusicList();
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
     if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
    },
    ...mapGetters(["topList"])
  },
  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.original = res.songlist;
          this._getUrl(res.songlist);
        }
      });
    },
    _getUrl(list) {
      list.forEach(item => {
        this._getVkay(item.data.songmid);
      });
    },
    _getVkay(mid) {
      getVkay(mid).then(res => {
        if (res.code === ERR_OK) {
          this.keyArray.push(res.data.items[0]);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData, index) => {
        if (musicData.data.songid && musicData.data.albummid) {
          ret.push(createSong(musicData.data, this.keyArray[index].vkey));
        }
      });
      this.songs = ret;
    }
  },
  watch: {
    keyArray(newVal) {
      if (newVal.length === this.original.length) {
        this._normalizeSongs(this.original);
      }
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>