<template>
  <div id="app">
    <!-- <router-link to="/pdf">pdf</router-link> -->
    <!-- <router-link to="/myMusic">myMusic</router-link>
    <router-link to="/friend">friend</router-link>
    <router-link to="/my">my</router-link> -->
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      pages: 0
    };
  },
  methods: {
   
  },
  created() {

  }
};
</script>
<style lang="less">
body * {
    outline: 1px solid yellow;
}
body{
  background-color: #171722;
  // background-color: #eeeeee;
}
#app {
    
  font-size: 16px;
}

</style>
