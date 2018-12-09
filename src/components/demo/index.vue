<template>
    <div class="demo">
        <input @click="showDatePicker" v-model="time" type="text" placeholder="请选择日期范围" readonly>
        <date-picker v-show="showPicker" mode="range" @confirm="confirm" @hide-time-picker="hideDatePicker"></date-picker>
    </div>
</template>

<script>
import DatePicker from '../datePicker/index'
export default {
    name: 'Demo',
    components: {
        DatePicker
    },
    data () {
        return {
            showPicker: false,
            time: ''
        }
    },
    methods: {
        showDatePicker () {
            this.showPicker = true
        },
        hideDatePicker () {
            this.showPicker = false
        },
        confirm (startDate, endDate) {
            this.time = `${startDate} to ${endDate}`
            this.showPicker = false
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
