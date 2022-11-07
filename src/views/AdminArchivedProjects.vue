<template>
  <div class="admin-archived-projects-master">
    <h3>Архива</h3>
    <div v-if="!projectToDisplay" class="all-archived-projects-div">
      <p>Pretraga <input type="text" v-model="searchInfo" @keyup="getAllProjects"></p>
      <div v-for="(i,idx) in allArchived" :key="'archived'+idx">
        <button @click="getSingleProject(i.pro_id)">Опширније</button>
        <a :href="'http://125k122.e2.mars-hosting.com/API/print/'+i.pro_id+'?sid='+currentUserSid" target="_blank">
          <button>PDF</button>
        </a>
        <span>{{i.udr_ime}} -- {{i.pro_ime}}</span>
        <span>{{i.pro_datum}}</span>
        <button @click="activeAreYouSure(i.pro_id)">Активирај Пројекат</button>
      </div>
    </div>
    
    <display-single-project
      v-else
      :projectData="projectToDisplay"
      @close="closeSingleProject">
    </display-single-project>

    <are-you-sure
      v-if="areYouSurePopup"
      :message="areYouSureMsg" 
      :resData="areYouSureData"
      @response="handleAreYouSure">
    </are-you-sure>

    <error-msg 
    v-if="errorPopup" 
    :msgText="errorMsgToShow" 
    :fatal="isItFatalError"
    @close="errorPopup=false"/>
  </div>
</template>

<script>
import DisplaySingleProject from '@/components/DisplaySingleProject.vue'
import AreYouSure from '@/components/AreYouSure.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
  components:{
    DisplaySingleProject,
    AreYouSure,
    ErrorMsg
  },
  data(){
    return {
      allArchived:[],
      searchInfo:"",
      projectToDisplay:null,
      areYouSurePopup: false,
      areYouSureMsg: "Da li ste sigurni da zelite da ponovo aktivirate projekat?",
      areYouSureData:null,
      errorPopup: false,
      errorMsgToShow: "",
      isItFatalError: false
    }
  },
  computed:{
    currentUserSid(){
      return sessionStorage.getItem("sid");
    }
  },
  mounted(){
    this.getAllProjects();
    let selectedArchived=sessionStorage.getItem("selectedArchived");
    if(selectedArchived){
      this.getSingleProject(selectedArchived);
    }
  },
  methods:{
    getAllProjects(){
      axios.get("http://125k122.e2.mars-hosting.com/API/project",{
        params:{
          sid: sessionStorage.getItem("sid"),
          completed: true,
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
        this.allArchived=res.data.data
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    activateProject(id){
      axios.patch("http://125k122.e2.mars-hosting.com/API/project/"+id,{
        sid: sessionStorage.getItem("sid"),
        status: 'активан'
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
        this.getAllProjects();
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    getSingleProject(id){
      axios.get("http://125k122.e2.mars-hosting.com/API/project/"+id,{
        params:{
          sid: sessionStorage.getItem("sid")
        }
      }).then((res)=>{
        if(res.data.res==='err'){
          if(res.data.msg==='Нисте улоговани'){
            this.isItFatalError=true;
          }
          this.errorMsgToShow=res.data.msg;
          this.errorPopup=true;
          return;
        }
        console.log(res);
        this.projectToDisplay=res.data.data;
        sessionStorage.setItem("selectedArchived", id);
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    closeSingleProject(){
      this.projectToDisplay=null;
      sessionStorage.removeItem("selectedArchived");
    },
    activeAreYouSure(id){
      this.areYouSureData={id:id}
      this.areYouSurePopup=true;
    },
    closeAreYouSure(){
      this.areYouSurePopup=false;
      this.areYouSureData=null
    },
    handleAreYouSure(response, data){
      console.log(data)
      if(response){
        this.activateProject(data.id);
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
  .admin-archived-projects-master{
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
  .all-archived-projects-div{
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
        &:first-of-type{
          margin-right: 5px;
        }
      }
    }
  }
</style>