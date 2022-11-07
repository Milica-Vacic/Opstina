<template>
<div class="main-details-div">
 <div v-if="request">
    <button @click="$emit('close')">X</button>
    <div v-if="request.zah_status==='одбијено'" class="reject-msg-div">
        <span>Разлог одбијања:</span><br>
        <span>{{request.zah_error}}</span>
    </div>
    <p>
        <span>Удружење: </span>
        <span>{{request.udr_ime}}</span>
    </p>
    <p>
        <span>Пројекат: </span>
        <span>{{request.pro_ime}}</span>
    </p>
    <p>
        <span>Буџетска ставка: </span>
        <span>{{request.stv_ime}}</span>
    </p>
    <p v-if="request.stv_dobijeno || request.stv_dobijeno===0">
        <span>Одобрено: </span>
        <span>{{request.stv_dobijeno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} РСД</span>
    </p>
    <p v-if="request.stv_potroseno || request.stv_potroseno===0">
        <span>Потрошено: </span>
        <span>{{request.stv_potroseno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} РСД</span>
    </p>
    <p v-if="request.stv_licno || request.stv_licno===0">
        <span>Сопствена средства: </span>
        <span>{{request.stv_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} РСД</span>
    </p>
    <p v-if="request.zah_suma || request.zah_suma===0">
        <span>Додатак на потрошено: </span>
        <span>{{request.zah_suma.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} РСД</span>
    </p>
    <p>
        <span>Додатак на сопствена средства: </span>
        <span>{{request.zah_licno.toLocaleString('en-US', {maximumFractionDigits:2, minimumFractionDigits:2})}} РСД</span>
    </p>
    <p>
        <span>Број рачуна: </span>
        <span>{{request.zah_racun_broj}}</span>
    </p>
    <p>
        <span>Датум издавања рачуна: </span>
        <span>{{request.zah_racun_datum}}</span>
    </p>
    <p>
        <span>Број извода из банке: </span>
        <span>{{request.zah_izvod_broj}}</span>
    </p>

     <div>
        <label for="racun">Слика рачуна</label>
        <div class="img-div" :style="{'background-image': 'url('+request.img_racun+')'}" id="racun">
            <a :href="request.img_racun" target="_blank"><i class="fas fa-search-plus"></i></a>
        </div>
     </div>
     
     <div>
        <label for="izvod">Слика извода из банке</label>
        <div class="img-div" :style="{'background-image': 'url('+request.img_izvod+')'}" id="izvod">
            <a :href="request.img_izvod" target="_blank"><i class="fas fa-search-plus"></i></a>
        </div>
     </div>
     
 </div>
</div>
</template>

<script>
export default {
    props:{
        personal:{
            type:Boolean,
            default:false
        },
        request:Object
    }

}
</script>

<style lang="scss" scoped>
    .main-details-div{
        @include PopupStyling();
        >div{
            position: relative;
        }
        button{
            @include ButtonStyling();
            position: absolute;
            top: 3px;
            right: 10px;
        }
        p{
            display: flex;
            justify-content: space-between;
            align-items: center;
            &:hover{
                background-color: rgba(0, 0, 255, 0.205);
            }
        }
        >div>div{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        }
    }
    .reject-msg-div{
        border: 1px solid red;
        color: red;
        border-radius: 5px;
        text-align: center;
        justify-content: center;
        padding: 5px;
    }
    img{
        width: 200px;
        cursor: pointer;
    }
    .img-div{
        height: 200px;
        width: 200px;
        border-radius: 5px;
        background-position: center;
        background-size: cover;
        position: relative;
        display: inline-block;
        a{
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            height: 100%;
            width: 100%;
            background-color: transparent;
            justify-content: center;
            align-items: center;
            color: transparent;
            font-size: 5rem;
            &:hover{
                background-color: rgba(0, 0, 0, 0.500);
                color: #fff;
            }
        }
    }
</style>