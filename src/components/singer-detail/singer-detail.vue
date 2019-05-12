<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { getVkay } from "api/getVkey"
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import musicList from "../music-list/music-list";

export default {
  components: {
    musicList
  },
  data() {
    return {
      songs: [],
      keyArray: [],
      original: []
    };
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({
          path: "/singer"
        });
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.original = res.data.list;
          this._getUrl(res.data.list);
        }
      });
    },
    _getVkay(mid) {
      getVkay(mid).then(res => {
        if (res.code === ERR_OK) {
          this.keyArray.push(res.data.items[0]);
        }
      });
    },
    _getUrl(list) {
      list.forEach(item => {
        this._getVkay(item.musicData.songmid);
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item, index) => {
        if (item.musicData.songid && item.musicData.albummid) {
          ret.push(createSong(item.musicData, this.keyArray[index].vkey));
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
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter {
  transform: translate3d(100%, 0, 0);
}

.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>