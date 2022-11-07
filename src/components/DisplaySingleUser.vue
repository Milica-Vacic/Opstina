<template>
    <div class="display-single-user-master">
        <p><button @click="close">&larr; Назад</button></p>
        <h2>{{userData.union.udr_ime}}</h2>
        <p>Електронска пошта: {{userData.union.udr_email}}</p>
        <h3>Пројекти:</h3>
        <h3 v-if="!userData.projects || userData.projects.length===0"><i>Нема забележених пројеката</i></h3>
        <div v-for="(i,idx) in userData.projects" :key="'userProject'+idx">
            <span>{{i.pro_ime}}</span>
            <span>{{i.pro_datum}}</span>
            <span class="status-span"
                :class="{
                    'project-active-color':i.pro_status==='активан',
                    'project-archived-color':i.pro_status!=='активан'
                }"
            >{{i.pro_status}} </span>
            <button @click="openSingleProject(i.pro_id, i.pro_status)">Детаљније</button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        userData:Object
    },
    methods:{
        openSingleProject(id, status){
            if(status==="активан"){
                sessionStorage.setItem("selectedProject", id);
                this.$router.push("/admin/projekti");
            }
            else{
                sessionStorage.setItem("selectedArchived", id);
                this.$router.push("/admin/arhiva");
            }
        },
        close(){
            this.$emit("close");
        }
    }
}
</script>

<style lang="scss" scoped>
    .display-single-user-master{
        >p{
            button{
                @include ButtonStyling();
            }
            &:nth-of-type(2n){
                text-align: center;
            }
        }
        h2, h3{
            text-align: center;
        }
        div{
            border-radius: 5px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:hover{
                background-color: rgba(0, 0, 243, 0.23);
            }
            .status-span{
                flex-basis: 100px;
                display: inline-flex;
                border-radius: 5px;
                padding: 3px;
                justify-content: center;
                align-items: center;
            }
            >span:nth-of-type(2n+1){
                margin: 0 10px;
            }
            >span:nth-of-type(2n){
                margin-left: auto;
                margin-right: 20px;
            }
            button{
                @include ButtonStyling();
                margin: 0;
                font-weight: 400;
            }
        }
    }
    .project-active-color{
        background-color: green;
    }
    .project-archived-color{
        background-color: red;
    }
</style>