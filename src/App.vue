<template>
  <nav>
    <router-link to="/">MUGU-你的學分精算師</router-link>
  </nav>
  <router-view/>
</template>

<style>
nav {
  @apply p-4 font-contentFont;
}

nav a {
  @apply text-custom-brown no-underline;
}

</style>
