<template>
<div class="pass-change-master">
    <div class="change-pass-wrap">
        <p>Унесите стару лозинку:</p>
        <p><input type="text" v-model="oldPass" :maxlength="inputLength"></p>
        <p>Унесите нову лозинку:</p>
        <p><input type="text" v-model="newPass" :maxlength="inputLength"></p>
        <p>
            <button @click="changePass">Потврди</button>
            <button @click="close">Одустани</button>
        </p>
    </div>

    <success-popup
        v-if="successPopupOpened"
        @close="closeSuccessPopup">
      </success-popup>

    <error-msg v-if="displayError" @close="displayError=false" :msgText="errMsg" :fatal="isFatal"/>
</div>
  
</template>

<script>
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
     components:{
        SuccessPopup,
        ErrorMsg
    },
    data(){
        return {
            oldPass:"",
            newPass:"",
            inputLength:200,
            successPopupOpened: false,
            errMsg:'',
            displayError:false,
            isFatal:false
        }
    },
    methods:{
        closeSuccessPopup(){
            this.successPopupOpened=!this.successPopupOpened;
            this.close();
        },
        close(){
            this.$emit("close");
        },
        changePass(){
            if(this.checkInputs()){return;}
            let userId=sessionStorage.getItem("userId")
            let adress= "http://125k122.e2.mars-hosting.com/API/union/"+userId;
            let admin=JSON.parse(sessionStorage.getItem("admin"))
            console.log(admin)
            if(admin){
                adress= "http://125k122.e2.mars-hosting.com/API/admin";
            }
            axios.patch(adress,{
                sid: sessionStorage.getItem("sid"),
                oldPassword: this.oldPass,
                newPassword: this.newPass
            }).then((res)=>{
                console.log(res.data.err);
                if(res.data.err){
                    this.errMsg=res.data.err;
                    this.displayError=true;
                    if (res.data.err==="Нисте улоговани") this.isFatal=true;
                    return;
                }
                this.successPopupOpened=true;
            }).catch(e => {
                console.log(e)
                this.errMsg="Дошло је до проблема при конектовању на сервер"
                this.displayError=true
                this.isFatal=true
            })
        },
        showInputError(msg){
            this.errMsg=msg;
            this.isFatal=false;
            this.displayError=true;
        },
        checkInputs(){
            if(this.oldPass.trim().length===0){this.showInputError('Морате унети стару лозинку'); return true;}
            if(this.newPass.trim().length<4){this.showInputError('Нова лозинка мора имати бар 4 карактера'); return true;}
            return false;
        },
    }
}
</script>

<style lang="scss" scoped>
    .pass-change-master{
        @include PopupStyling();
        text-align: center;
        button{
            @include ButtonStyling();
            margin: 0 20px;
        }
        >div{
            background-color: rgba(0, 0, 0, 0.500);
            max-height: 100%;
        }
        >.change-pass-wrap{
            background-color: #fff;
            max-height: 90%;
        }
    }
</style>