<template>
  <div class="login-master">
    <div class="log-in-div">

      <div>
          <div class="input-wrap">
          <label for="mailInput">Корисничко име:</label>
          <input id="mailInput" type="text" v-model="emailInput" @keyup.enter="logIn">
        </div>
        <div class="input-wrap">
          <label for="passInput">Лозинка:</label>
          <input id="passInput" type="password" v-model="passwordInput" @keyup.enter="logIn">
        </div>
        <button @click="logIn">Улогуј се</button>
      </div>
      
    </div>

    <error-msg 
    v-if="errorPopup" 
    :msgText="errorMsgToShow" 
    :fatal="isItFatalError"
    @close="errorPopup=false"/>

  </div>
</template>

<script>
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
  name: 'Login',
  components:{
    ErrorMsg
  },
  data(){
    return {
      emailInput: "",
      passwordInput: "",
      errorPopup: false,
      errorMsgToShow: "",
      isItFatalError: false
    }
  },
  methods:{
    logIn(){
      console.log(this.emailInput, this.passwordInput)
      axios.post("http://125k122.e2.mars-hosting.com/API/login",{
        email: this.emailInput,
        pass: this.passwordInput
      }).then((res)=>{
        console.log(res);
        if(res.data.res==='err'){throw res.data.msg}
        sessionStorage.setItem("sid", res.data.sid);
        sessionStorage.setItem("admin", res.data.admin);
        sessionStorage.setItem("userId", res.data.id);
        sessionStorage.setItem("projectsId", JSON.stringify(res.data.projects));
        if(res.data.admin){
          this.$router.push('/admin');
          return;
        }
        this.$router.push('/korisnik');
      }).catch((err)=>{
        console.log(err);
        this.errorMsgToShow=err;
        this.errorPopup=true;
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .login-master{
    p{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      input{
        margin-left: auto;
      }
    }
    button{
      @include ButtonStyling();
      width: 100%;
      box-sizing: border-box;
    }
  }

  .log-in-div{
    @include PopupStyling();
    background-color: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 40px;
  }

  .input-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
</style>
