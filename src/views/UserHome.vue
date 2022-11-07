<template>
  <div class="user-home-master">
    <h3 class="awaiting-msg-div" v-if="allProjects.length===0"><i>{{awaitingDataMsg}}</i></h3>
    <div 
      v-for="(i, idx) in allProjects" 
      :key="'singlePro'+idx" 
      :class="{
        'selected-project': projectData && projectData.pro_id===i.pro_id,
        'no-selected-project':!(projectData && projectData.pro_id===i.pro_id),
        'first-project': idx===0,
        'last-project': idx===allProjects.length-1,
        'only-project': allProjects.length-1===0
      }"
      class="singleProjectSelector">

      <h2 @click="getProjectData(i.pro_id)">{{i.pro_ime}} || {{i.pro_datum}}</h2>

      <div v-if="projectData && projectData.pro_id===i.pro_id">
        <div v-for="(i, idx) in labelsData" :key="'displayLabel'+idx">
          <p class="add-personal-label-wrap">
            {{idx+1}} -- {{i.name}} (
              {{catSum[idx].toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} - 
              {{catSpent[idx].toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            )
            <button 
              @click="toggleAddingPersonalLabelPopup(i.name)" 
              class="add-personal-label-button">
              Додај Личну Ставку</button>
          </p>
          <div v-for="(j, jidx) in i.data" :key="'subLabData'+jidx">
            <display-labels
              :labelData="j"
              :indexToDisplay="''+(idx+1)+'.'+(jidx+1)">
            </display-labels>
          </div>
        </div>
        <div class="all-together-stats">
          <h3>
            <span>Укупно одобрено:</span>
            <span class="label-given">
              {{sumAll.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
          </h3>
          <h3>
            <span>Укупно потрошено: </span>
            <span class="label-spent">
              {{spentAll.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
          </h3>
          <h3>
            <span>Укупна сопствена средства: </span>
            <span class="label-personal">
              {{personalAll.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
          </h3>
          <h3>
            <span>Разлика одобреног и потрошеног: </span>
            <span class="label-difference">
              {{sumSpentDiff.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
          </h3>
        </div>
      </div>
    </div>

    <div class="legend-div">
      <h3>Легенда</h3>
      <p>
        Одобрена средства:
        <span class="legend-box given-box"></span>
      </p>
      <p>
        Потрошена средства:
        <span class="legend-box spent-box"></span>
      </p>
      <p>
        Сопствена средства:
        <span class="legend-box personal-box"></span>
      </p>
    </div>
    

    <adding-personal-label
        v-if="addingPersonalLabelPopup"
        :labelNameToChange="labelNameToChange" 
        :projectId="projectData.pro_id" 
        @close="toggleAddingPersonalLabelPopup('')">
    </adding-personal-label>

    <error-msg 
    v-if="errorPopup" 
    :msgText="errorMsgToShow" 
    :fatal="isItFatalError"
    @close="errorPopup=false"/>
  </div>
</template>

<script>
import DisplayLabels from '@/components/DisplayLabels.vue'
import AddingPersonalLabel from '@/components/AddingPersonalLabel.vue'
import ErrorMsg from '../components/ErrorMsg'
import axios from 'axios'

export default {
  components:{
    DisplayLabels,
    AddingPersonalLabel,
    ErrorMsg
  },
  data(){
    return {
      singleLoad:false,
      projectData:null,
      allProjects:[],
      awaitingDataMsg:'Учитавање...',
      addingPersonalLabelPopup: false,
      labelNameToChange:"",
      labelsData:[
        {
            name:"Људски Ресурси",
            data:[],
            sum: null
        },
        {
            name:"Трошкови Пројектних Активности",
            data:[],
            sum: null
        },
        {
            name:"Публицитет",
            data:[],
            sum: null
        },
        {
            name:"Текући Трошкови Пројекта",
            data:[],
            sum: null
        }
      ],
      errorPopup: false,
      errorMsgToShow: "",
      isItFatalError: false
    }
  },
  computed:{
    catSum(){
      return [
        this.catSumCount(0),
        this.catSumCount(1),
        this.catSumCount(2),
        this.catSumCount(3)
      ];
    },
    catSpent(){
      return [
        this.catSpentCount(0),
        this.catSpentCount(1),
        this.catSpentCount(2),
        this.catSpentCount(3)
      ]
    },
    sumAll(){
      return (
        this.catSumCount(0)+
        this.catSumCount(1)+
        this.catSumCount(2)+
        this.catSumCount(3)
        )
    },
    spentAll(){
      return (
        this.catSpentCount(0)+
        this.catSpentCount(1)+
        this.catSpentCount(2)+
        this.catSpentCount(3)
      )
    },
    personalAll(){
      return (
        this.personalCount(0)+
        this.personalCount(1)+
        this.personalCount(2)+
        this.personalCount(3)
      )
    },
    sumSpentDiff(){
      return (
        this.catSumCount(0)+
        this.catSumCount(1)+
        this.catSumCount(2)+
        this.catSumCount(3)
        )-(
        this.catSpentCount(0)+
        this.catSpentCount(1)+
        this.catSpentCount(2)+
        this.catSpentCount(3)
        )
    }
  },
  mounted(){
    this.getAllProjects();
  },
  methods:{
    getAllProjects(){
      let id=sessionStorage.getItem("userId")
      axios.get("http://125k122.e2.mars-hosting.com/API/union/"+id,{
        params:{
          sid: sessionStorage.getItem("sid")
        }
      }).then((res)=>{
        console.log(res.data.projects);
        if(res.data.res==='err'){
          if(res.data.msg==='Нисте улоговани'){
            this.isItFatalError=true;
          }
          this.errorMsgToShow=res.data.msg;
          this.errorPopup=true;
          return;
        }
        this.allProjects=res.data.projects
        let selectedProId= sessionStorage.getItem("selectedProId");
        if(this.allProjects.length===1){
          this.getProjectData(this.allProjects[0].pro_id);
        }
        else if(selectedProId){
          this.getProjectData(selectedProId);
        }
        this.awaitingDataMsg="Нема активних пројеката"
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    getProjectData(id){
      if(this.singleLoad){return;}
      if(this.projectData && this.projectData.pro_id===id){
        this.projectData=null;
        sessionStorage.removeItem("selectedProId"); 
        return;
      }
      axios.get("http://125k122.e2.mars-hosting.com/API/project/"+id,{
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
        this.projectData=res.data.data
        this.labelsData[0].data=res.data.data.cat1;
        this.labelsData[1].data=res.data.data.cat2;
        this.labelsData[2].data=res.data.data.cat3;
        this.labelsData[3].data=res.data.data.cat4;
        sessionStorage.setItem("selectedProId", id);
        if(this.allProjects.length===1){
          this.singleLoad=true;
        }
      }).catch(()=>{
        this.isItFatalError=true;
        this.errorMsgToShow="Дошло је до проблема при конектовању на сервер";
        this.errorPopup=true;
      })
    },
    catSumCount(n){
      let sum=0;
      let allLabelsToCheck=[];
      for(let i=0; i<this.labelsData[n].data.length; i++){
        allLabelsToCheck.push(this.labelsData[n].data[i]);
      }
      for(let i=0; i<allLabelsToCheck.length; i++){
        if(allLabelsToCheck[i].stv_dobijeno){
          sum+=allLabelsToCheck[i].stv_dobijeno;
        }
        if(allLabelsToCheck[i].children){
          for(let j=0; j<allLabelsToCheck[i].children.length; j++){
            allLabelsToCheck.push(allLabelsToCheck[i].children[j]);
          }
        }
      }
      return sum;
    },
    catSpentCount(n){
      let sum=0;
      let allLabelsToCheck=[];
      for(let i=0; i<this.labelsData[n].data.length; i++){
        allLabelsToCheck.push(this.labelsData[n].data[i]);
      }
      for(let i=0; i<allLabelsToCheck.length; i++){
        if(allLabelsToCheck[i].stv_potroseno){
          sum+=allLabelsToCheck[i].stv_potroseno;
        }
        if(allLabelsToCheck[i].children){
          for(let j=0; j<allLabelsToCheck[i].children.length; j++){
            allLabelsToCheck.push(allLabelsToCheck[i].children[j]);
          }
        }
      }
      return sum;
    },
    personalCount(n){
      let sum=0;
      let allLabelsToCheck=[];
      for(let i=0; i<this.labelsData[n].data.length; i++){
        allLabelsToCheck.push(this.labelsData[n].data[i]);
      }
      for(let i=0; i<allLabelsToCheck.length; i++){
        if(allLabelsToCheck[i].stv_licno){
          sum+=allLabelsToCheck[i].stv_licno;
        }
        if(allLabelsToCheck[i].children){
          for(let j=0; j<allLabelsToCheck[i].children.length; j++){
            allLabelsToCheck.push(allLabelsToCheck[i].children[j]);
          }
        }
      }
      return sum;
    },
    toggleAddingPersonalLabelPopup(catName){
      this.labelNameToChange=catName
      this.addingPersonalLabelPopup=!this.addingPersonalLabelPopup;
    }
  }
}
</script>

<style  lang="scss" scoped>
  .user-home-master{
    margin: 20px 0;
    h2{
      margin: 0;
      padding: 20px 0;
    }
    .awaiting-msg-div{
      background-color: rgba(0, 0, 243, 0.328);
      width: 70%;
      padding: 20px 0;
      margin: 0 auto;
      text-align: center;
      color: #fff;
      border-radius: 5px;
    }
  }
  .first-project{
    border-radius: 10px 10px 0 0;
  }
  .last-project{
    border-radius: 0 0 10px 10px;
  }
  .only-project{
    border-radius: 10px;
  }
  .singleProjectSelector{
    background-color: rgba(0, 0, 243, 0.328);
    width: 70%;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    >h2{
      cursor: pointer;
    }
    >div{
      text-align: left;
      padding: 20px 80px;
    }
  }
  .selected-project{
    background-color: rgba(0, 0, 243, 0.48);
  }
  .no-selected-project:hover{
    opacity: 0.7;
  }
  .add-personal-label-button{
    @include TransparentButtonStyling();
  }
  .add-personal-label-wrap{
    font-size: 1.1rem;
    display: inline-flex;
    cursor: default;
    button{
      margin-left: 10px;
    }
  }

  .label-given{
    background-color: rgb(9, 104, 9);
  }
  .label-spent{
    background-color: rgb(179, 58, 58);
  }
  .label-personal{
    background-color: rgb(156, 86, 39);
  }
  .label-difference{
    background-color: #fff;
    color: #000;
  }
.all-together-stats{
    h3{
      &:first-of-type{
        margin-top: 25px;
      }
      margin: 8px 0;
      padding: 0 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover{
        background-color: rgb(65, 105, 225);
      }
      >span:nth-of-type(2n){
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 4px;
        flex-basis: 180px;
        border-radius: 5px;
      }
    }
  }
  .legend-div{
    position: fixed;
    top: 40%;
    right: 0;
    width: 12%;
    padding: 10px;
    font-size: 0.85rem;
    background-color: rgba(0, 0, 243, 0.328);
    color: #fff;
    border-radius: 10px 0 0 10px;
    h3{
      font-size: 1.1rem;
    }
    p{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .legend-box{
      display: inline-block;
      height: 20px;
      width: 20px;
      border: 1px solid #fff;
      flex-shrink: 0;
    }
    .given-box{
      background-color: rgb(9, 104, 9);
    }
    .spent-box{
      background-color: rgb(179, 58, 58);
    }
    .personal-box{
      background-color: rgb(156, 86, 39);
    }
  }
</style>