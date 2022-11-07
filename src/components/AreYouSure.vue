<template>
<div>
    <div class="are-you-sure-wrap">
        <div>
            <p>{{message}}</p>
            <p class="button-wraper">
                <button @click="yes">Да</button>
                <button @click="no">Не</button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        message: String,
        resData: Object,
        resGuid: String
    },
    methods:{
        yes(){
            this.$emit("response",true,this.resData);
        },
        no(){
            this.$emit("response",false);
        },
    }
}
</script>

<style lang="scss" scoped>
    .are-you-sure-wrap{
        @include PopupStyling();
        div{
            padding: 20px 50px;
            p{
                text-align: center;
            }
        }
        .button-wraper{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        button{
            @include ButtonStyling();
            width: 40%;
        }
    }
</style>