<template>
  <div class="master-div">
    <div class="labels-wrap" :class="{'given-label-adding':labelData.stv_dobijeno!==null}">
        <span class="label-name">{{indexToDisplay}} {{labelData.stv_ime}} : </span>

        <span 
            class="label-given"
            v-if="labelData.stv_dobijeno || labelData.stv_potroseno || labelData.stv_licno">
            {{labelData.stv_dobijeno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} 
        </span>
        
        <span 
            class="label-spent"
            v-if="labelData.stv_dobijeno || labelData.stv_potroseno || labelData.stv_licno">
            {{labelData.stv_potroseno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
        </span>
        
        <span 
            class="label-personal"
            v-if="labelData.stv_dobijeno || labelData.stv_potroseno || labelData.stv_licno">
            {{labelData.stv_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
        </span>

        <button 
            v-if="labelData.stv_dobijeno!==null" 
            @click="toggleSendRequestPopup(labelData.stv_id)">
        +</button>
    </div>
    <div v-for="(i, idx) in labelData.children" :key="'subLabData'+idx">
        <display-labels
            :labelData="i"
            :indexToDisplay="indexToDisplay+('.'+(idx+1))">
        </display-labels>
    </div>

    <sending-request 
        v-if="sendRequestPopup"
        :labelIdToChange="labelIdToChange" 
        @close="toggleSendRequestPopup(0)">
    </sending-request>

  </div>
</template>

<script>
import SendingRequest from '@/components/SendingRequest.vue'

export default {
    name:"DisplayLabels",
    components:{
        SendingRequest
    },
    props: {
        labelData: Object,
        indexToDisplay: String
    },
    data(){
        return {
            sendRequestPopup: false,
            addingPersonalLabelPopup: false,
            labelIdToChange: 0,
            labelNameToChange:""
        }
    },
    methods:{
        toggleSendRequestPopup(stvId){
            this.labelIdToChange=stvId
            this.sendRequestPopup=!this.sendRequestPopup;
        }
    }
}
</script>

<style lang="scss" scoped>
    .master-div{
        margin-left: 40px;
    }
    span{
        display: inline-flex;
        align-items: center;
        margin: 3px 0;
    }
    button{
        @include miniButtonStyling();
    }
    .labels-wrap{
        display: inline-block;
        cursor: default;
    }


    .label-given, .label-spent, .label-personal{
        display: inline-flex;
        justify-content: flex-end;
        padding: 0 4px;
        border-radius: 5px;
        margin-left: 3px;
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

    .given-label-adding{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
            flex-basis: 130px;
        }
        .label-name{
            flex-basis: 200px;
        }
        .label-given{
            margin-right: auto;
        }
        :last-of-type{
            margin-left: 10px;
        }
        &:hover{
            background-color: rgb(65, 105, 225);
        }
    }
</style>