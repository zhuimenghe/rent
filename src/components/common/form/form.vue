<template lang="">
  <div>
    <slot></slot>
  </div>
</template>
<script>
import Schema from 'async-validator';
export default {
  props:{
    model:Object,
    rules :Object
  },
  computed:{
    validator(){
      const validator = this.rules ? new Schema(this.rules) : null;
      return validator
    }
  },
  methods:{
    validate(){
      return new Promise((resolve, reject) => { 
        this.validator.validate(this.model).then(_=>{
          resolve()
        }).catch(({errors,fields})=>{
          resolve({errors,fields})
        })
      })
    }
  }
}
</script>
<style lang="">
  
</style>