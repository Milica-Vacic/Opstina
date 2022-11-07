<template>
  <div class="display-single-project-master">
      <p><button @click="close">&larr; Назад</button></p>
      <h2>{{projectData.pro_ime}}--{{projectData.pro_datum}}</h2>
      <p>
          Назив удружења: {{projectData.udr_ime}}
          <button @click="openSingleUnion(projectData.udr_id)">О Удружењу</button>
      </p>
      <div v-for="(i,idx) in labelsData" :key="'mainCat'+idx">
          <p>{{idx+1}} -- {{i.name}} (
            {{catSum[idx].toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} - 
            {{catSpent[idx].toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            )</p>
          <display-single-project-label
            :labelData="i.data"
            :indexToDisplay="(idx+1)+''">
          </display-single-project-label>
      </div>

      <div class="all-together-stats">
        <h3>
          <span>Укупно одобрено: </span>
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

      <div class="all-requests-div">
          <h2>Историјат Захтева:</h2>
          <h3 v-if="!allReqData || allReqData.length===0"><i>Нема забележених захтева</i></h3>
          <p v-for="(i, idx) in allReqData" :key="'request'+idx">
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
      </div>

  </div>
</template>

<script>
import DisplaySingleProjectLabel from '@/components/DisplaySingleProjectLabel.vue'
import RequestDetails from '../components/RequestDetails'

export default {
    props:{
        projectData: Object
    },
    components:{
        DisplaySingleProjectLabel,
        RequestDetails
    },
    data(){
        return {
            showDetails:-1,
            showDetailsPersonal:-1
        }
    },
    computed:{
        labelsData(){ return [
        {
            name:"Људски Ресурси",
            data: this.projectData.cat1,
            sum: null
        },
        {
            name:"Трошкови Пројектних Активности",
            data: this.projectData.cat2,
            sum: null
        },
        {
            name:"Публицитет",
            data: this.projectData.cat3,
            sum: null
        },
        {
            name:"Текући Трошкови Пројекта",
            data: this.projectData.cat4,
            sum: null
        }
      ]},
      allReqData(){
        let toReturn=[];
        for(let i=0; i<this.projectData.zahtevi.length; i++){
            toReturn.push(this.projectData.zahtevi[i]);
        }
        for(let i=0; i<this.projectData.zahtevi_licno.length; i++){
            toReturn.push(this.projectData.zahtevi_licno[i]);
        }
        toReturn.sort((a,b)=>{
            return new Date(b.zah_datum) -new Date(a.zah_datum);
        });
        return toReturn;
      },
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
    methods:{
        openSingleUnion(id){
            sessionStorage.setItem("selectedUser", id);
            this.$router.push("/admin/udruzenja");
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
        close(){
            this.$emit("close");
        }
    }
}
</script>

<style lang="scss" scoped>
.display-single-project-master{
  h2{
    text-align: center;
  }
  >p:first-of-type{
      button{
          @include ButtonStyling();
      }
  }
  >p:last-of-type{
      button{
          @include miniButtonStyling();
      }
  }
}
.all-requests-div{
    text-align: center;
    margin: 20px 0;
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