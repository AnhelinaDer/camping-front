<template>

  <div id="app" class="min-h-screen bg-red-100 p-10">
    <head>
    </head>
    <h1>
      Hello world!
    </h1>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
