<template>
  <div class="parent-master-div">
      <div class="main-menu">
        <div class="links-div">
        <router-link 
            class="link" 
            :class="{'active-page':$route.name==='AdminHome'}"
            to="/admin">
            Почетна Страна
        </router-link>
        <router-link 
            class="link" 
            :class="{'active-page':$route.name==='AdminCreateProject'}"
            to="/admin/novi-projekat">
            Нови Пројекат
        </router-link>
        <router-link 
            class="link" 
            :class="{'active-page':$route.name==='AdminActiveProjects'}"
            to="/admin/projekti">
            Актуелни Пројекти
        </router-link>
        <router-link class="link"
            :class="{'active-page':$route.name==='AdminAllUsersView'}" 
            to="/admin/udruzenja">
            Листа Удружења
        </router-link>
        <router-link class="link" 
        :class="{'active-page':$route.name==='AdminArchivedProjects'}" 
        to="/admin/arhiva">
            Архива
        </router-link>
        </div>
        <div class="main-buttons">
            <span @click="passChangePopupToggle">Промени Лозинку</span>
            <span @click="logOut">Излогуј се</span>
        </div>
      </div>
      <div>
        <router-view/>
      </div>

      <pass-change-popup-comp
        v-if="passChangePopup"
        @close="passChangePopupToggle">
      </pass-change-popup-comp>
  </div>
</template>

<script>
import PassChangePopupComp from '@/components/PassChangePopupComp'
import axios from 'axios'

export default {
    components:{
        PassChangePopupComp
    },
    data(){
        return {
            passChangePopup: false
        }
    },
    methods:{
        passChangePopupToggle(){
            this.passChangePopup=!this.passChangePopup
        },
        logOut(){
            axios.get("http://125k122.e2.mars-hosting.com/API/login",{
                params:{
                    sid: sessionStorage.getItem("sid")
                }
            }).then((res)=>{
                console.log(res);
                sessionStorage.removeItem("sid");
                sessionStorage.removeItem("admin");
                this.$router.push("/");
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .main-menu{
        background-color: $primaryColor;
        @include MainMenu();
    }
</style>