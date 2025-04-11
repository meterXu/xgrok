<template>
  <div class="myNotFound">
<!--    <NotFound :link="link" @goHome="goHome"/>-->
  </div>
</template>

<script>
// import {NotFound} from "xxweb-box"
export default {
  name: "MyNotFound",
  components:{
    // NotFound
  },
  data(){
    return {
      link:{
        home: window.location.pathname
      }
    }
  },
  methods:{
    goHome(){
      this.$router.replace({path:"/"})
    }
  }
}
</script>
