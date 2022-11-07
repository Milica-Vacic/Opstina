<template>
  <div class="user-history-master">
      <h3 v-if="allData.length===0"><i>{{awaitingDataMsg}}</i></h3>
      <p v-for="(i, idx) in allData" :key="'request'+idx">
        <button @click="showDetails=idx">Детаљније</button>
        <span>
          {{i.zah_datum}} -- 
          {{i.stv_ime}}
        </span> 
        <span>
          <span v-if="!i.zah_suma">0.00</span>
          <span v-if="i.zah_suma">
            {{i.zah_suma.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
          </span>
           + 
          <span v-if="!i.zah_licno">0.00</span>
          <span v-if="i.zah_licno">
            {{i.zah_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} 
          </span>
        </span>
        <span 
          class="request-status"
          :class="{
            'accepted-request-color': i.zah_status==='прихваћено',
            'pending-request-color': i.zah_status==='необрађено',
            'declined-request-color': i.zah_status==='одбијено'
          }">
          {{i.zah_status}}
        </span>
        <request-details v-if="showDetails===idx" :request="i" @close="showDetails=-1"/>
      </p>

      <error-msg 
      v-if="errorPopup" 
      :msgText="errorMsgToShow" 
      :fatal="isItFatalError"
      @close="errorPopup=false"/>
  </div>
</template>

<script>
import RequestDetails from '../components/RequestDetails'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
  components:{
    RequestDetails,
    ErrorMsg
  },
  data(){
    return {
      allData:[],
      awaitingDataMsg:"Учитавање...",
      requestsData:[],
      personalReqData:[],
      showDetails:-1,
      showDetailsPersonal:-1,
      errorPopup: false,
      errorMsgToShow: "",
      isItFatalError: false
    }
  },
  mounted(){
    this.getUserRequests();
    this.getPersonalRequests();
  },
  methods:{
    getUserRequests(){
      let dataToSend=[];
      let projectsId=sessionStorage.getItem("projectsId")
      projectsId=JSON.parse(projectsId)
      for(let i=0; i<projectsId.length; i++){
        dataToSend.push(projectsId[i].pro_id);
      }
      console.log(dataToSend);
      dataToSend=JSON.stringify(dataToSend)
      axios.get("http://125k122.e2.mars-hosting.com/API/request",{
        params:{
          sid: sessionStorage.getItem("sid"),
          project: dataToSend
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
        this.requestsData=res.data.data
        this.orderData();
        this.requestsData.sort((a,b)=>{
          return new Date(b.zah_datum) -new Date(a.zah_datum);
        })
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    getPersonalRequests(){
      let dataToSend=[];
      let projectsId=sessionStorage.getItem("projectsId")
      projectsId=JSON.parse(projectsId)
      for(let i=0; i<projectsId.length; i++){
        dataToSend.push(projectsId[i].pro_id);
      }
      console.log(dataToSend);
      dataToSend=JSON.stringify(dataToSend)
      axios.get("http://125k122.e2.mars-hosting.com/API/request/personal",{
        params:{
          sid: sessionStorage.getItem("sid"),
          project: dataToSend
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
        this.personalReqData=res.data.data
        this.orderData();
        this.personalReqData.sort((a,b)=>{
          return new Date(b.zah_datum) -new Date(a.zah_datum);
        })
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    orderData(){
      this.allData=[];
      for(let i=0; i<this.requestsData.length; i++){
        this.allData.push(this.requestsData[i]);
      }
      for(let i=0; i<this.personalReqData.length; i++){
        this.allData.push(this.personalReqData[i]);
      }
      if(this.allData.length===0){this.awaitingDataMsg='Нема забележених захтева';}
      this.allData.sort((a,b)=>{
        return new Date(b.zah_datum) -new Date(a.zah_datum);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-history-master{
    background-color: rgba(0, 0, 243, 0.328);
    width: 70%;
    margin: 20px auto;
    text-align: center;
    color: #fff;
    border-radius: 10px;
    padding: 10px 80px;
    box-sizing: border-box;
    >p{
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover{
        background-color: rgb(65, 105, 225);
      }
    }
    button{
      @include ButtonStyling();
      font-weight: 400;
      margin: 0 4px;
      box-shadow: none;
      &:hover{
        box-shadow: none;
      }
    }
    span:nth-of-type(2n){
      margin-left: auto;
    }
    .request-status{
      flex-basis: 100px;
      margin-left: 15%;
      display: inline-block;
      border-radius: 5px;
      padding: 3px;
    }
  }
  .accepted-request-color{
    background-color: rgb(0, 128, 0);
  }
  .pending-request-color{
    background-color: rgb(216, 122, 2);
  }
  .declined-request-color{
    background-color: rgb(255, 0, 0);
  }
</style>