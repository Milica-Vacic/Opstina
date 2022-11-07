<template>
  <div class="create-project-master">
      <p class="new-project-nav">
        <button 
            @click="toggleOpenProject()" 
            :disabled="!createProjectOpened"
            :class="{'active-inner-page': !createProjectOpened}">
            Регистрација Новог Удружења
        </button>
        <button 
            @click="toggleOpenProject()" 
            :disabled="createProjectOpened" 
            :class="{'active-inner-page': createProjectOpened}">
            Креирање Новог Пројекта
        </button>
      </p>

      <div v-if="!createProjectOpened" class="creating-user-div">
          <h3>Податци о Удружењу</h3>
          <p>Име Удружења: <input type="text" v-model="userNameInput" :maxlength="inputLength"></p>
          <p>Лозинка: <button @click="generateNewPassword">Генериши Лозинку</button> {{generatedPassword}}</p>
          <p>Електронкса Пошта: <input type="text" v-model="emailInput" :maxlength="inputLength"></p>
          <p><button @click="toggleConfUserPop">Пошаљи</button></p>
      </div>

      <div v-if="createProjectOpened" class="creating-project-div">
          <h3>Податци о Пројекту</h3>
          <p>Име Пројекта <input type="text" v-model="projectNameInput" :maxlength="inputLength"></p>
          <p>
              Власник Пројекта 
              <select v-model="selectedUser">
                <option v-for="(i,idx) in allUsers" :key="'user'+idx" 
                    :value="i.udr_id">{{i.udr_ime}}</option>
              </select>
          </p>
          <h3>Ставке</h3>
          <div>
              <div v-for="(i,idx) in labelsData" :key="'labelsData'+idx">
                <adding-new-label-comp 
                        :index="idx"
                        :indexToDisplay="(idx+1)+''"
                        :labelData="i"
                        :firstComp="true"
                        @buttonLabelChange="handleButtonLabelChange"
                        @addingLabel="handleAddingLabel"
                        @deletingLabel="handleDeletingLabel">
                </adding-new-label-comp>
            </div>
          </div>
          <p>
            <button @click="activeAreYouSure">Пошаљи</button>
          </p>
      </div>
      
      <create-user-confirm
        v-if="confirmUserCreationPopup"
        :name="userNameInput" 
        :pass="generatedPassword" 
        :email="emailInput" 
        @accept="handleConfUserPop" 
        @close="toggleConfUserPop">
      </create-user-confirm>

      <are-you-sure
        v-if="areYouSurePopup"
        :message="areYouSureMsg" 
        @response="handleAreYouSure">
        </are-you-sure>

      <success-popup
        v-if="successPopupOpened"
        @close="toggleSuccessPopup">
      </success-popup>

      <error-msg 
        v-if="errorPopup" 
        :msgText="errorMsgToShow" 
        :fatal="isItFatalError"
        @close="errorPopup=false"/>
  </div>
</template>

<script>
import addingNewLabelComp from '@/components/addingNewLabelComp.vue'
import CreateUserConfirm from '@/components/CreateUserConfirm.vue'
import AreYouSure from '@/components/AreYouSure.vue'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
    components:{
        addingNewLabelComp,
        CreateUserConfirm,
        AreYouSure,
        SuccessPopup,
        ErrorMsg
    },
    data(){
        return {
           allUsers:[],
           projectNameInput: "",
           userNameInput: "",
           emailInput: "",
           generatedPassword: "",
           selectedUser:"",
           labelsData: [
               {
                   name:"Људски Ресурси",
                   inputStatus:1,
                   data:[],
                   sum: null
               },
               {
                   name:"Трошкови Пројектних Активности",
                   inputStatus:1,
                   data:[],
                   sum: null
               },
               {
                   name:"Публицитет",
                   inputStatus:1,
                   data:[],
                   sum: null
               },
               {
                   name:"Текући Трошкови Пројекта",
                   inputStatus:1,
                   data:[],
                   sum: null
               }
           ],
            inputLength:200,
            createProjectOpened: true,
            confirmUserCreationPopup: false,
            areYouSurePopup: false,
            areYouSureMsg: "Да ли сте сигурни?",
            successPopupOpened: false,
            errorPopup: false,
            errorMsgToShow: "",
            isItFatalError: false
        }
    },
    mounted(){
        this.getAllUsers();
    },
    methods:{
        getAllUsers(){
            axios.get("http://125k122.e2.mars-hosting.com/API/union",{
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
                this.allUsers=res.data.data
            }).catch(()=>{
                this.isItFatalError=true;
                this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
                this.errorPopup=true;
            })
        },
        createNewProject(){
            if(this.checkProjectInputs()){return;}
            console.log(sessionStorage.getItem("sid"))
            axios.post("http://125k122.e2.mars-hosting.com/API/project",{
                sid: sessionStorage.getItem("sid"),
                projectName: this.projectNameInput,
                unionId: this.selectedUser,
                email: this.emailInput,
                labelsData: this.labelsData
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
                this.toggleSuccessPopup();
                this.projectNameInput='';
                this.selectedUser='';
                this.labelsData[0].data=[];
                this.labelsData[1].data=[];
                this.labelsData[2].data=[];
                this.labelsData[3].data=[];
            }).catch(()=>{
                this.isItFatalError=true;
                this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
                this.errorPopup=true;
            })
        },
        createNewUser(){
            if(this.checkUserInputs()){return;}
            axios.post("http://125k122.e2.mars-hosting.com/API/union",{
                sid: sessionStorage.getItem("sid"),
                unionName: this.userNameInput,
                unionEmail: this.emailInput,
                unionPass: this.generatedPassword
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
                this.toggleSuccessPopup();
                this.userNameInput='';
                this.emailInput='';
                this.generatedPassword='';
            }).catch(()=>{
                this.isItFatalError=true;
                this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
                this.errorPopup=true;
            })
        },
        generateNewPassword(){
            let charactersForBuildingPass="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            this.generatedPassword="";
            for(let i=0; i<10; i++){
                let randomNumber=Math.floor(Math.random()*charactersForBuildingPass.length);
                this.generatedPassword+=charactersForBuildingPass[randomNumber];
            }
        },
        handleButtonLabelChange(n, childIndex){
            let currentItem=this.labelsData[childIndex[0]];
            for(let i=1; i<childIndex.length; i++){
                currentItem=currentItem.data[childIndex[i]];
            }
            currentItem.inputStatus=n;
        },
        handleAddingLabel(name, sum,  childIndex){
            let currentItem=this.labelsData[childIndex[0]];
            for(let i=1; i<childIndex.length; i++){
                currentItem=currentItem.data[childIndex[i]];
            }
            currentItem.data.push({
                name: name,
                inputStatus:1,
                data:[],
                sum: sum
            });
            currentItem.inputStatus=1;
        },
        handleDeletingLabel(childIndex){
            let currentItem=this.labelsData[childIndex[0]];
            for(let i=1; i<childIndex.length-1; i++){
                currentItem=currentItem.data[childIndex[i]];
            }
            currentItem.data.splice(childIndex[childIndex.length-1],1);
        },
        showInputError(msg){
            this.errorMsgToShow=msg;
            this.isItFatalError=false;
            this.errorPopup=true;
        },
        checkProjectInputs(){
            if(this.projectNameInput.trim().length<5){this.showInputError('Име мора имати бар 5 слова'); return true;}
            if(this.selectedUser.length===0){this.showInputError('Морате изабрати власника пројекта'); return true;}
            return false;
        },
        checkUserInputs(){
            if(this.userNameInput.trim().length<5){this.showInputError('Име мора имати бар 5 слова'); return true;}
            if(this.generatedPassword.trim().length===0){this.showInputError('Морате генерисати лозинку'); return true;}
            if(this.emailInput.trim().length<4){this.showInputError('Морате унети електронску пошту'); return true;}
            return false;
        },
        toggleOpenProject(){
            this.createProjectOpened=!this.createProjectOpened;
        },
        toggleConfUserPop(){
            this.confirmUserCreationPopup=!this.confirmUserCreationPopup
        },
        toggleSuccessPopup(){
            this.successPopupOpened=!this.successPopupOpened;
        },
        handleConfUserPop(){
            this.createNewUser();
            this.toggleConfUserPop();
        },
        activeAreYouSure(){
            this.areYouSurePopup=true;
            console.log(this.labelsData)
        },
        closeAreYouSure(){
            this.areYouSurePopup=false;
        },
        handleAreYouSure(response){
            if(response){
                this.createNewProject();
                this.closeAreYouSure();
            }
            else{
                this.closeAreYouSure();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .create-project-master{
        border-radius: 5px;
        margin: 20px auto;
        background-color: rgba(0, 0, 243, 0.328);
        width: 70%;
        color: #fff;
        padding: 20px;
        box-sizing: border-box;
        h3{
            text-align: center;
        }
    }
    .new-project-nav{
        text-align: center;
        button{
            @include ButtonStyling();
            font-weight: 400;
            &:nth-of-type(2n+1){
                border-radius: 10px 0 0 10px;
            }
            &:nth-of-type(2n){
                border-radius: 0 10px 10px 0;
            }
        }
        >.active-inner-page{
            background-color: rgb(182, 182, 182);
            box-shadow: none;
            opacity: 0.7;
            &:hover{
                cursor: default;
                box-shadow: none;
            }
        }
    }
    .creating-user-div{
        >p{
            width: 40%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px auto;
            &:nth-of-type(2n){
                button{
                    margin-right: auto;
                    margin-left: 5px;
                }
            }
            &:last-of-type{
                button{
                    @include ButtonStyling();
                    margin-top: 70px;
                    width: 100%;
                }
            }
        }
    }
    .creating-project-div{
        >p{
            width: 40%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px auto;
            select{
                width: 204.8px;
                padding: 1px;
                box-sizing: border-box;
            }
            &:last-of-type{
                button{
                    @include ButtonStyling();
                    margin-top: 70px;
                    width: 100%;
                }
            }
        }
        >div{
            padding: 20px 50px;
            border-radius: 5px;
            border: 1px solid #fff;
        }
        button{
            @include miniButtonStyling();
        }
    }
    
</style>