<template>
<div class="send-request-master">
    <div class="send-request-wrap">
        <div>
            <h3>Унесите Податке: </h3>
            
            <p>
                Број рачуна: 
                <input type="text" v-model="receiptNumber" :maxlength="inputLength">
            </p>
            <p>
                Датум издавања рачуна:
                <input type="date" v-model="receiptDate">
            </p>
            <p>
                Број извода из банке: 
                <input type="text"  v-model="bankNumber" :maxlength="inputLength">
            </p>
            <p>
                Трошак финансиран од Општине (у динарима): 
                <input type="text" v-model="officialSpending" :maxlength="inputLength">
            </p>
            <p>
                Сопствени допринос (у динарима): 
                <input type="text" v-model="personalSpendings" :maxlength="inputLength">
            </p>
            <p>
                Фотографија рачуна: 
                <input type="file" ref="receiptImg">
            </p>
            <p>
                Фотографија извода из банке: 
                <input type="file" ref="bankImg">
            </p>
            <p>
                <button @click="sendingRequest">Потврди</button>
                <button @click="close">Одустани</button>
            </p>
        </div>
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

    props:{
        labelIdToChange: Number
    },
    data(){
        return {
            officialSpending: 0,
            personalSpendings: 0,
            receiptNumber:"",
            receiptDate:"",
            bankNumber:"",
            inputLength:200,
            successPopupOpened: false,
            errMsg:'',
            displayError:false,
            isFatal:false
        }
    },
    methods:{
        sendingRequest(){
            if(this.checkInputs()){return;}
            let formData = new FormData();
            formData.append('sid', sessionStorage.getItem("sid"));
            formData.append('racunSlika', this.$refs.receiptImg.files[0])
            formData.append('izvodSlika', this.$refs.bankImg.files[0])
            formData.append('racunBroj', this.receiptNumber);
            formData.append('racunDatum', this.receiptDate);
            formData.append('izvodBroj', this.bankNumber);
            formData.append('opstinsko', this.officialSpending);
            formData.append('licno', this.personalSpendings);
            formData.append('stavkaId', this.labelIdToChange);
            axios.post("http://125k122.e2.mars-hosting.com/API/request",formData).then((res)=>{
                if (res.data.res==="ok"){
                    this.errMsg=''
                    this.displayError=false
                    this.isFatal=false
                    console.log(res);
                    this.successPopupOpened=true;
                }
                else{
                    this.errMsg=res.data.msg
                    this.displayError=true
                    if (res.data.msg==="Нисте улоговани") this.isFatal=true
                }
            }).catch(e => {
                    console.log(e);
                    this.errMsg="Дошло је до проблема при конектовању на сервер";
                    this.isFatal=true;
                    this.displayError=true;
            })
        },
        showInputError(msg){
            this.errMsg=msg;
            this.isFatal=false;
            this.displayError=true;
        },
        checkInputs(){
            if(this.receiptNumber.trim().length===0){this.showInputError('Морате унети број рачуна'); return true;}
            if(this.receiptDate.trim().length===0){this.showInputError('Морате унети датум издавања рачуна'); return true;}
            if(this.bankNumber.trim().length===0){this.showInputError('Морате унети број извода из банке'); return true;}
            if(isNaN(parseFloat(this.officialSpending))){this.showInputError('Трошак финансиран од општине мора бити унет као број'); return true;}
            if(isNaN(parseFloat(this.personalSpendings))){this.showInputError('Сопствени допринос мора бити унет као број'); return true;}
            if(this.$refs.receiptImg.files.length===0){this.showInputError('Морате додати слику рачуна'); return true;}
            if(this.$refs.bankImg.files.length===0){this.showInputError('Морате додати слику извода из банке'); return true;}
            return false;
        },
        closeSuccessPopup(){
            this.successPopupOpened=!this.successPopupOpened;
            this.close();
        },
        close(){
            this.$emit("close");
        }
    }
}
</script>

<style lang="scss" scoped>
    .send-request-master{
        color: #000;
    }
    .send-request-wrap{
        @include PopupStyling();
        h3{
            text-align: center;
        }
        >div>p{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        input[type=text]{
            text-align: right;
            flex-basis: 220px;
            flex-shrink: 0;
        }
        input[type=date]{
            text-align: center;
            flex-basis: 220px;
            flex-shrink: 0;
        }
        input[type=file]{
            flex-basis: 234px;
            flex-shrink: 0;
            border: 1px solid #888;
            border-radius: 5px;
            cursor: pointer;
        }
        button{
            @include ButtonStyling();
        }
    }
</style>