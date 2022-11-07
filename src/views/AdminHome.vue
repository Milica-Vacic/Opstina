<template>
  <div class="master-div">
    <div class="wrapper-div">
      <h3 v-if="!loadStatus.reqLoaded && !loadStatus.persReqLoaded"><i>Учитавање...</i></h3>
      <h3 v-if="
        pendingRequests.length===0 && 
        pendingPersonalReqs.length===0 &&
        loadStatus.reqLoaded && loadStatus.persReqLoaded">
      <i>Нема нових захтева</i></h3>
      <div v-for="(i, idx) in pendingRequests" :key="'request'+idx"
        class="single-request">
        <button @click="showDetails=idx">Детаљније</button>
        <p><span>Назив:</span>{{i.stv_ime}}</p>
        <p><span>Удружење:</span>{{i.udr_ime}}</p>
        <p><span>Датум:</span>{{i.zah_datum}}</p>
        <p v-if="i.zah_suma || i.zah_suma===0">
          <span>Количина Новца:</span>
          {{i.zah_suma.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
        </p>
        <p v-if="i.zah_licno || i.zah_licno===0">
          <span>Лична средства:</span>
          {{i.zah_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
        </p>
        <p class="button-wrap">
          <button @click="activeAreYouSure('acceptRequest', i.zah_id, 'прихваћено')">Прихвати</button>
          <button @click="toggleRejectPopup('acceptRequest', i.zah_id, 'одбијено')">Одбиј</button>
        </p>
        <request-details v-if="showDetails===idx" :request="i" @close="showDetails=-1"/>
      </div>

      <div v-for="(i, idx) in pendingPersonalReqs" :key="'personalReq'+idx"
        class="single-request">
        <button @click="showDetailsPersonal=idx">Детаљније</button>
        <p><span>Назив:</span>{{i.stv_ime}}</p>
        <p><span>Удружење:</span>{{i.udr_ime}}</p>
        <p><span>Датум:</span>{{i.zah_datum}}</p>
        <p><span>Количина Новца:</span>{{i.zah_suma}}</p>
        <p><span>Лична средства:</span>{{i.zah_licno}}</p>
        <p class="button-wrap">
          <button @click="activeAreYouSure('acceptPersonalReq', i.zah_id, 'прихваћено')">Прихвати</button>
          <button @click="toggleRejectPopup('acceptPersonalReq', i.zah_id, 'одбијено', rejectMsg)">Одбиј</button>
        </p>
        <request-details v-if="showDetailsPersonal===idx" :request="i" :personal="true" @close="showDetailsPersonal=-1"/>
      </div>
    </div>

    <div
      v-if="rejectPopup" 
      class="are-you-sure-reject-popup">
      <div>
        <p>Унесите образложење зашто одбијате захтев.</p>
        <p><textarea v-model="rejectMsg"></textarea></p>
          <p class="buttons-wrap">
              <button @click="rejectYes">Потврди</button>
              <button @click="toggleRejectPopup">Одустани</button>
          </p>
      </div>
    </div>
    
    <are-you-sure
      v-if="areYouSurePopup"
      :message="areYouSureMsg" 
      :resData="areYouSureData"
      @response="handleAreYouSure">
    </are-you-sure>

    <success-popup
      v-if="successPopupOpened"
      @close="closeSuccessPopup">
    </success-popup>

    <error-msg 
    v-if="errorPopup" 
    :msgText="errorMsgToShow" 
    :fatal="isItFatalError"
    @close="errorPopup=false"/>
  </div>
</template>

<script>
import AreYouSure from '@/components/AreYouSure.vue'
import RequestDetails from '../components/RequestDetails'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
  components:{
    AreYouSure,
    RequestDetails,
    SuccessPopup,
    ErrorMsg
  },
  data(){
    return {
      pendingRequests:[],
      pendingPersonalReqs:[],
      rejectMsg: "",
      loadStatus:{
        reqLoaded:false,
        persReqLoaded:false,
      },
      areYouSurePopup: false,
      areYouSureMsg: "Да ли сте сигурни?",
      areYouSureData:null,
      showDetails:-1,
      showDetailsPersonal:-1,
      rejectPopup:false,
      rejectData:{},
      successPopupOpened: false,
      errorPopup: false,
      errorMsgToShow: "",
      isItFatalError: false
    }
  },
  mounted(){
    this.getPendingRequests();
    this.getPendingPersonalReq();
  },
  methods:{
    getPendingRequests(){
      axios.get("http://125k122.e2.mars-hosting.com/API/request",{
        params:{
          sid: sessionStorage.getItem("sid"),
          pending: true
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
        this.pendingRequests=res.data.data
        this.pendingRequests.sort((a,b)=>{
          return new Date(b.zah_datum) -new Date(a.zah_datum);
        });
        this.loadStatus.reqLoaded=true;
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    getPendingPersonalReq(){
      axios.get("http://125k122.e2.mars-hosting.com/API/request/personal",{
        params:{
          sid: sessionStorage.getItem("sid"),
          pending: true
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
        this.pendingPersonalReqs=res.data.data
        this.pendingPersonalReqs.sort((a,b)=>{
          return new Date(b.zah_datum) -new Date(a.zah_datum);
        });
        this.loadStatus.persReqLoaded=true;
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    acceptRequest(id, response, msg){
      axios.patch("http://125k122.e2.mars-hosting.com/API/request/"+id,{
        sid: sessionStorage.getItem("sid"),
        status: response,
        errMsg: msg
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
        this.rejectMsg="";
        this.successPopupOpened=true;
        this.getPendingRequests();
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    acceptPersonalReq(id, response, msg){
      axios.patch("http://125k122.e2.mars-hosting.com/API/request/personal/"+id,{
        sid: sessionStorage.getItem("sid"),
        status: response,
        errMsg: msg
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
        this.rejectMsg="";
        this.successPopupOpened=true;
        this.getPendingPersonalReq();
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    activeAreYouSure(guid, id, status, msg){
      this.areYouSureData={
        guid:guid,
        id:id,
        status: status,
        msg: msg
      };
      this.areYouSureGuid=guid;
      this.areYouSurePopup=true;
    },
    closeAreYouSure(){
      this.areYouSurePopup=false;
      this.areYouSureGuid="";
      this.areYouSureData=null
    },
    handleAreYouSure(response, data){
      console.log(data)
      if(response){
        if(data.guid==='acceptRequest'){
          this.acceptRequest(data.id, data.status, data.msg);
        }
        else{
          this.acceptPersonalReq(data.id, data.status, data.msg);
        }
        this.closeAreYouSure();
      }
      else{
        this.closeAreYouSure();
      }
    },
    toggleRejectPopup(guid, id, response){
      this.rejectData={
        guid: guid,
        id:id,
        response: response
      };
      this.rejectPopup=!this.rejectPopup;
    },
    rejectYes(){
      if(this.rejectMsg.trim().length<10){
        this.isItFatalError=false;
        this.errorMsgToShow="Морате унети образложење за одбијање од бар 10 карактера";
        this.errorPopup=true;
        return;
      }
      if(this.rejectData.guid==='acceptRequest'){
        this.acceptRequest(this.rejectData.id, this.rejectData.response, this.rejectMsg);
      }
      if(this.rejectData.guid==='acceptPersonalReq'){
        this.acceptPersonalReq(this.rejectData.id, this.rejectData.response, this.rejectMsg);
      }
      this.toggleRejectPopup();
    },
    closeSuccessPopup(){
      console.log(this.successPopupOpened);
      this.successPopupOpened=!this.successPopupOpened;
    },
  }
}
</script>

<style lang="scss" scoped>
  .wrapper-div{
    background-color: rgba(0, 0, 243, 0.328);
    padding: 20px;
    width: 70%;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-radius: 5px;
    h3{
      text-align: center;
      color: #fff;
      margin: 0 auto;
    }
  }
  .single-request{
    @include BoxStyling();
  }
  .are-you-sure-reject-popup{
    @include PopupStyling();
    textarea{
      resize: none;
      height: 50px;
      width: 100%;
      box-sizing: border-box;
    }
    .buttons-wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      button{
        @include ButtonStyling();
        width: 40%;
      }
    }
  }
</style>