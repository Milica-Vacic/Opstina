<template>
  <div class="admin-all-users-master">
      
      <div v-if="!selectedUser" class="all-users-div">
          <h3>Листа Удружења</h3>
          <p>Претрага: <input type="text" v-model="searchInfo" @keyup="getAllUsers"></p>
          <div v-for="(i,idx) in allUsers" :key="'user'+idx">
            <button @click="getSingleUser(i.udr_id)">Опширније</button>
            <span>{{i.udr_ime}}</span>
            <span>{{i.udr_email}}</span>
          </div>
      </div>
      

    <display-single-user
        v-else
        :userData="selectedUser"
        @close="closeSingleUser">
    </display-single-user>

    <error-msg 
    v-if="errorPopup" 
    :msgText="errorMsgToShow" 
    :fatal="isItFatalError"
    @close="errorPopup=false"/>
  </div>
</template>

<script>
import DisplaySingleUser from '@/components/DisplaySingleUser.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
    components:{
        DisplaySingleUser,
        ErrorMsg
    },
    data(){
        return {
            allUsers:[],
            searchInfo:"",
            selectedUser:null,
            errorPopup: false,
            errorMsgToShow: "",
            isItFatalError: false
        }
    },
    mounted(){
        this.getAllUsers();
        let selectedUser=sessionStorage.getItem("selectedUser");
        if(selectedUser){
        this.getSingleUser(selectedUser);
        }
    },
    methods:{
        getAllUsers(){
            axios.get("http://125k122.e2.mars-hosting.com/API/union",{
                params:{
                    sid: sessionStorage.getItem("sid"),
                    filter: this.searchInfo
                }
            }).then((res)=>{
                console.log(res);
                if(res.data.res==='err'){
                    if(res.data.msg==='Нисте улоговани'){
                        this.isItFatalError=true;
                    }
                    this.errorMsgToShow=res.data.msg;
                    this.errorPopup=true;
                    return;
                }
                this.allUsers=res.data.data
            }).catch(()=>{
                this.isItFatalError=true;
                this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
                this.errorPopup=true;
            })
        },
        getSingleUser(id){
            axios.get("http://125k122.e2.mars-hosting.com/API/union/"+id,{
                params:{
                    sid: sessionStorage.getItem("sid")
                }
            }).then((res)=>{
                console.log(res);
                if(res.data.res==='err'){
                    if(res.data.msg==='Нисте улоговани'){
                        this.isItFatalError=true;
                    }
                    this.errorMsgToShow=res.data.msg;
                    this.errorPopup=true;
                    return;
                }
                this.selectedUser=res.data;
                sessionStorage.setItem("selectedUser", id);
            }).catch(()=>{
                this.isItFatalError=true;
                this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
                this.errorPopup=true;
            })
        },
        closeSingleUser(){
            this.selectedUser=null;
            sessionStorage.removeItem("selectedUser");
        }
    }
}
</script>

<style lang="scss" scoped>
    .admin-all-users-master{
        background-color: rgba(0, 0, 243, 0.328);
        padding: 20px;
        width: 70%;
        margin: 20px auto;
        color: #fff;
        box-sizing: border-box;
        border-radius: 5px;
        h3{
        text-align: center;
        }
    }
    .all-users-div{
        >p{
        text-align: right;
        }
        >div{
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:hover{
                background-color: rgba(0, 0, 243, 0.23);
            }
            >span:nth-of-type(2n+1){
                margin-left: 20px;
            }
            >span:nth-of-type(2n){
                margin-left: auto;
                margin-right: 20px;
            }
            button{
                @include ButtonStyling();
                margin: 0;
                font-weight: 400;
            }
        }
    }
</style>