<template>  
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
const title = "Hello World";
const description = "This is a description";
// #tovel::getTitle function getTitle
const getTitle = () => title;
getTitle()
// #tovel::getDescription function getDescription
const getDescription = () => description;
getDescription()
</script>

<style>
h1 {
  color: red;
}
</style>