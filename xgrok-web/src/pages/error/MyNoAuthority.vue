<template>
  <div class="myNotFound">
<!--    <NoAuthority1 :link="link" @goHome="goHome"/>-->
  </div>
</template>

<script>
// import {NoAuthority1} from "xxweb-box"
export default {
  name: "MyNoAuthority",
  components:{
    // NoAuthority1
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
