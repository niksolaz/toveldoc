<template>
  <div>
    {{ compTest }}
  </div>
</template>

<script setup>
const msg = 'File Testing Tovel'
const testRef = ref('test')

function fnTest() {
  console.log('fnTest', testRef.value)
}

// Arrow function
const fnTestArrow = () => {
  console.log('fnTestArrow', msg)
}

const compTest = computed(() => {
  return msg
})

onMounted(() => {
  console.log('onMounted')
  fnTest()
  fnTestArrow()
})
</script>
