<template>
  <div class="kvuex">
    <h1>This is an kvuex page</h1>
	<p @click="$store.commit('add')">counter: {{$store.state.counter}}</p>
	<p @click="$store.dispatch('add')">async counter: {{$store.state.counter}}</p>
  </div>
</template>
