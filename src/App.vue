<template>
  <nav>
    <router-link to="/">MUGU-你的學分精算師</router-link>
  </nav>
  <div class="pt-16">
    <router-view/>
  </div>
</template>

<style>
nav {
  @apply fixed top-0 left-0 w-full p-4 z-20 bg-white/80 backdrop-blur-md font-contentFont;
}

nav a {
  @apply text-custom-brown no-underline;
}

</style>
