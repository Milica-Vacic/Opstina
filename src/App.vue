<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  html{
    height: 100%;
    width: 100%;
  }
  body{
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    color: rgb(49, 64, 75);
    background-image: linear-gradient(to bottom, rgba(150, 191, 233, 0.822), rgba(246, 250, 255, 0.774)),
    url("./assets/3.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100%;
    height: 100%;
  }
  a{
    text-decoration: none;
  }
  textarea{
    font-family: 'Open Sans', sans-serif;
        font-weight: 600;
  }
  input{
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
  }
  button{
    cursor: pointer;
  }
</style>
