<template>
    <div class="error-msg-master">
        <div>
            <p v-text="msgText"></p>
            <p>
                <button @click='handleError'>У реду</button>
            </p>
        </div>
    </div>
</template>

<script>
export default {
props:{
    msgText:String,
    fatal:{
            type:Boolean,
            default:false
        }
},
methods:{
    handleError(){
        if (!this.fatal){
            this.$emit('close')
            return
        }
        this.$router.push('/')
    }
}
}
</script>

<style lang="scss" scoped>
    .error-msg-master{
        @include PopupStyling();
        p{
            text-align: center;
            button{
                @include ButtonStyling();
            }
        }
    }
</style>