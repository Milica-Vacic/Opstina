<template>
<div>
    <div class="create-user-confirm-master">
        <div>
            <p>Да ли желите де региструјете удружење са следећим податцима</p>
            <p>
                Назив: {{name}}
            </p>
            <p>
                Лозинка: {{pass}}
            </p>
            <p>
                Електронкса Пошта: {{email}}
            </p>
            <p>
                <button @click="accept">Да</button>
                <button @click="close">Не</button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props:{
        name: String,
        pass: String,
        email: String
    },
    methods:{
        accept(){
            this.$emit("accept");
        },
        close(){
            this.$emit("close");
        }
    }
}
</script>

<style lang="scss" scoped>
    .create-user-confirm-master{
        @include PopupStyling();
        >div{
            >p:last-of-type{
                display: flex;
                button{
                    @include ButtonStyling();
                    flex-basis: 40%;
                }
            }
        }
    }
</style>