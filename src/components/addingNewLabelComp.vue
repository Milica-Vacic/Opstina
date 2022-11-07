<template>
  <div class="adding-new-label-master" :class="{'non-first-comp':!firstComp}">
    <p>
        {{indexToDisplay}} {{labelData.name}} : 
        <span v-if="labelData.sum || labelData.sum===0">
            {{parseInt(labelData.sum).toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}}
        </span>
        <button v-if="!firstComp" @click="deletingLabel([])">-</button>
    </p>

    <adding-new-label-comp
        v-for="(i,idx) in labelData.data" :key="'label'+index+'-'+idx"
        :index="idx" 
        :indexToDisplay="indexToDisplay+'.'+(idx+1)"
        :labelData="i" 
        :firstComp="false" 
        @buttonLabelChange="buttonLabelChange"
        @addingLabel="addingLabel"
        @deletingLabel="deletingLabel">
    </adding-new-label-comp>

    <p v-if="!labelData.sum">
        <span v-if="labelData.inputStatus===1 && !labelData.sum">
            <button @click="toggleLabelInputStatus">+</button>
        </span>
        <span v-if="labelData.inputStatus===2">
            <button @click="labelInputBackTo(1)">&larr;</button>
            <button @click="toggleLabelInputNewCategoryStatus">Додај Под-категорију</button>
            <button @click="toggleLabelInpuNewLabelStatus">Додај Ставку</button>
        </span>
        <span v-if="labelData.inputStatus===3">
            <button @click="labelInputBackTo(2)">&larr;</button>
            Назив: <input type="text" v-model="newSubLabelText">
            <button @click="addingSubLabel">Додај</button>
        </span>
        <span v-if="labelData.inputStatus===4">
            <button @click="labelInputBackTo(2)">&larr;</button>
            Назив: <input type="text" v-model="newFinalLabelText">
            Сума: <input type="text" v-model="newFinalLabelSum">
            <button @click="addingFinalLabel">Додај</button>
        </span>
    </p>
  </div>
</template>

<script>

export default {
    name:"addingNewLabelComp",
    props: {
        labelData: Object,
        index: Number,
        firstComp: Boolean,
        indexToDisplay: String
    },
    data(){
        return {
            newSubLabelText:"",
            newFinalLabelText:"",
            newFinalLabelSum:""
        }
    },
    methods:{
        buttonLabelChange(number, childIndex){
            let newChildIndex=childIndex;
            newChildIndex.unshift(this.index);
            this.$emit("buttonLabelChange", number, newChildIndex);
        },
        addingLabel(labelName, labelSum, childIndex){
            let newChildIndex=childIndex;
            newChildIndex.unshift(this.index);
            this.$emit("addingLabel", labelName, labelSum, newChildIndex);
        },
        deletingLabel(childIndex){
            let newChildIndex=childIndex;
            newChildIndex.unshift(this.index);
            this.$emit("deletingLabel", newChildIndex);
        },
        toggleLabelInputStatus(){
            this.buttonLabelChange(2,[]);
        },
        toggleLabelInputNewCategoryStatus(){
            this.buttonLabelChange(3,[]);
        },
        toggleLabelInpuNewLabelStatus(){
            this.buttonLabelChange(4,[]);
        },
        labelInputBackTo(n){
            this.buttonLabelChange(n,[]);
        },
        addingSubLabel(){
            this.addingLabel(this.newSubLabelText, null, []);
            this.newSubLabelText="";
        },
        addingFinalLabel(){
            this.addingLabel(this.newFinalLabelText, this.newFinalLabelSum, []);
            this.newFinalLabelText="";
            this.newFinalLabelSum="";
        }
    }
}
</script>

<style lang="scss" scoped>
    .adding-new-label-master{
        background-color: rgba(0, 0, 243, 0.2);
        padding: 5px 0 5px 10px;
    }
    .non-first-comp{
        margin-left: 40px;
    }
    p{
        height: 22px;
        display: flex;
        align-items: center;
    }
    span{
        font-size: 0.95rem;
        margin: 0 5px;
    }
    button{
        @include miniButtonStyling();
        margin: 0 4px;
        padding: 3px 10px;
    }
    input{
        border: none;
        padding: none;
        font-size: 0.8rem;
    }
</style>