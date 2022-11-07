<template>
  <div class="success-popup-master">
      <div>
          <h2>УСПЕШНО!</h2>
      </div>
  </div>
</template>

<script>
export default {
    mounted(){
        this.selfColse();
    },
    methods:{
        selfColse(){
            setTimeout(()=>{
                console.log('e')
                this.$emit("close");
            },1000);
        }
    }
}
</script>

<style lang="scss" scoped>
    .success-popup-master{
        @include PopupStyling();
        text-align: center;
    }
</style>