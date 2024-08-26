<template>
  <div>
    {{ compTest }}
  </div>
</template>

<script setup>

// #tovel::msg variable message
const msg = 'File Testing Tovel'
// #tovel::testRef variable dynamic
const testRef = ref('test')
// #tovel::reactiveTest variable reactive object
const reactiveTest = reactive({
  test: 'test'
})

// #tovel::fnTest that use testRef
function fnTest() {
  console.log('fnTest', testRef.value)
}

// #tovel::fnTestArrow arrow function fnTestArrow that use msg
const fnTestArrow = () => {
  console.log('fnTestArrow', msg)
}

// #tovel::compTest computed variable compTest that use msg
const compTest = computed(() => {
  return msg
})


// watch
watch(() => reactiveTest, (val) => {
  console.log('watch', val)
})
// Lifecycle
onMounted(() => {
  console.log('onMounted')
  fnTest()
  fnTestArrow()
})
</script>
