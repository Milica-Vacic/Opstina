<template>
  <div class="single-project-label-master">
      <div v-for="(i,idx) in labelData" :key="'singleLabel'+idx" :class="{'last-label':i.stv_dobijeno || i.stv_licno}">
            <span class="label-name">{{indexToDisplay+'.'+(idx+1)}} {{i.stv_ime}}:</span>
            <span 
                class="label-given"
                v-if="i.stv_dobijeno || i.stv_potroseno || i.stv_licno">
                {{i.stv_dobijeno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
            <span 
                class="label-spent"
                v-if="i.stv_dobijeno || i.stv_potroseno || i.stv_licno">
                {{i.stv_potroseno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
            <span 
                class="label-personal"
                v-if="i.stv_dobijeno || i.stv_potroseno || i.stv_licno">
                {{i.stv_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
            </span>
               
            <display-single-project-label
                :labelData="i.children"
                :indexToDisplay="indexToDisplay+'.'+(idx+1)">
            </display-single-project-label>
      </div>
  </div>
</template>

<script>
export default {
    name:"DisplaySingleProjectLabel",
    props:{
        labelData: Array,
        indexToDisplay: String
    }
}
</script>

<style lang="scss" scoped>
    .single-project-label-master{
        margin-left: 40px;
        >div{
            margin: 5px 0;
        }
    }
    .last-label{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
            flex-basis: 130px;
            display: inline-flex;
            justify-content: flex-end;
            padding: 0 4px;
        }
        .label-name{
            flex-basis: 200px;
            justify-content: flex-start;
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
    .label-given, .label-spent, .label-personal{
        justify-content: center;
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
</style>