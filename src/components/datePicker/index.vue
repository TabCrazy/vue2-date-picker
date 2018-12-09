/*
 * @Author: tabtang
 * @Date: 2018-12-08 00:01:52
 * @Last Modified by: tabtang
 * @Last Modified time: 2018-12-09 10:46:41
 */
<template>
    <div class="picker-box">
        <div class="mask" @click="handleClickMask"></div>
        <div class="picker-box-con">
            <div class="picker-header">
                <div class="picker-prev" @click="preMon"> &lt;&lt; </div>
                <div class="picker-year">{{year}}年 {{month}}月</div>
                <div class="picker-next" @click="nextMon"> &gt;&gt; </div>
            </div>
            <div class="picker-content">
                <div class="picker-week">
                    <div class="picker-weekday">日</div>
                    <div class="picker-weekday">一</div>
                    <div class="picker-weekday">二</div>
                    <div class="picker-weekday">三</div>
                    <div class="picker-weekday">四</div>
                    <div class="picker-weekday">五</div>
                    <div class="picker-weekday">六</div>
                </div>
                <div class="picker-con">
                    <div
                    v-for="(pick, idx) in picker"
                    :key="`pick_${idx}`"
                    :class="{'outfocus': pick.outfocus, 'today': pick.showday, 'start': showStartSty(pick), 'end': showEndSty(pick), 'within': showWithinSty(pick), 'same-day': showSameDay(pick)} "
                    class="picker-day"
                    @click="handleClickDate(pick)"
                    >
                        {{pick.dateNum}}
                    </div>
                </div>
            </div>
            <div class="picker-footer">
                <div class="picker-button-today"><span></span>今天</div>
                <div class="picker-button-start"><span></span>开始</div>
                <div class="picker-button-end"><span></span>结束</div>
            </div>
            <div class="confim" @click="handleConfirm">确定</div>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        // 模式 [single]单选日期，[range]范围选择日期，[single-time]选择日期加时间
        mode: {
            type: String,
            default: 'single'
        },
        // 反选值开始【默认选择】
        start: {
            type: String
        },
        // 反选值结束【默认选择】
        end: {
            type: String
        },
        // 可选范围开始
        optionalStart: {
            type: String
        },
        // 可选范围结束
        optionalEnd: {
            type: String
        }
    },
    data () {
        return {
            year: '',
            month: '',
            startDate: '', // 开始日期
            endDate: '', // 结束日期
            today: '',
            picker: []
        }
    },
    created () {
        let date = new Date()
        this.year = date.getFullYear()
        this.month = date.getMonth() + 1
        this.today = date.getDate()
        this.createCalendar(this.year, this.month)
    },
    methods: {
        /**
         * 单月日历表生成方法
         * @param {year} 需要生成日历的年份
         * @param {month} 需要生成日历的月份
         */
        createCalendar (year, month) {
            this.picker = []
            let picks = []
            // 判断是否为当前月
            let currentMonth = ''
            if (new Date().getFullYear() === year && new Date().getMonth() + 1 === month) {
                currentMonth = true
            } else {
                currentMonth = false
            }
            // 获取当前月的第一天为星期几
            let monthStartDate = this.getFirstDay(year, month)
            // 获取需要日历月的上一个月最后一天日期
            let lastMonthRestDay = new Date(year, month - 1, 0).getDate()
            // 根据当前月第一天是星期几，以及上一个月最一天是多少号，得到上个月剩余多少天显示在本月
            let preYear = ''
            let preMonth = ''
            let nextYear = ''
            let nextMonth = ''
            if (month === 1) {
                preYear = year - 1
                preMonth = 12
                nextYear = year
                nextMonth = month + 1
            } else if (month === 12) {
                nextYear = year + 1
                nextMonth = 1
                preYear = year
                preMonth = month - 1
            } else {
                preYear = year
                nextYear = year
                preMonth = month - 1
                nextMonth = month + 1
            }
            for (let i = 0; i < monthStartDate; i++) {
                picks.unshift({
                    year: preYear,
                    month: preMonth,
                    dateNum: lastMonthRestDay,
                    outfocus: true
                })
                lastMonthRestDay--
            }
            // 获得当前月的天数
            let indexMoth = this.getMonthLen(year, month)
            // 根据当前月的天数循环得出显示对象
            for (let i = 1; i <= indexMoth; i++) {
                let showday = ''
                if (currentMonth) {
                    if (this.today === i) {
                        showday = true
                    } else {
                        showday = false
                    }
                }
                picks.push({
                    year: year,
                    month: month,
                    dateNum: i,
                    outfocus: false,
                    showday: showday
                })
            }
            // 7 * 6 日历网格里，剩余多少为下月显示在本月的天数
            let nextMonLen = 42 - picks.length
            // 循环添加下月显示的天数到数组
            for (let i = 1; i <= nextMonLen; i++) {
                picks.push({
                    ear: nextYear,
                    month: nextMonth,
                    dateNum: i,
                    outfocus: true
                })
            }
            this.picker = picks
        },
        /**
         * 上一月
         */
        preMon () {
            this.month -= 1
            if (this.month < 1) {
                this.year -= 1
                this.month = 12
            }
            this.createCalendar(this.year, this.month)
        },
        /**
         * 下一月
         */
        nextMon () {
            this.month += 1
            if (this.month > 12) {
                this.year = parseInt(this.year) + 1
                this.month = 1
            }
            this.createCalendar(this.year, this.month)
        },
        /**
         * 点击每日触发方法
         * @param {date} 点击日期的对象
         */
        handleClickDate (date) {
            let {outfocus} = date
            if (!outfocus) {
                if (this.mode === 'range') {
                    this.rangePickerDateRule(date)
                }
            }
        },
        /**
         * 范围选择日期选择规则
         */
        rangePickerDateRule (date) {
            let {year, month, dateNum} = date
            let checkDate = `${year}-${month}-${dateNum}`
            if (this.startDate && this.endDate) {
                this.startDate = checkDate
                this.endDate = ''
            } else if (this.startDate && this.dateCompare(checkDate, this.startDate) === 1) {
                this.endDate = checkDate
            } else {
                this.startDate = checkDate
            }
        },
        /**
         * 获得某个月天数
         * @param {year} 需要查询的年份
         * @param {month} 需要查询的月份
         */
        getMonthLen (year, month) {
            let nextMonth = new Date(year, month, 1)
            nextMonth.setHours(nextMonth.getHours() - 1)
            return nextMonth.getDate()
        },
        /**
         * 获得某个月第一天为星期几
         * 0：星期日，1：星期一
         * @param {year} 需要查询的年份
         * @param {month} 需要查询的月份
         */
        getFirstDay (year, month) {
            let firstDay = new Date(year, month - 1, 1)
            return firstDay.getDay()
        },
        /**
         * 确认按钮对应处理方法
         */
        handleConfirm () {
            this.$emit('showTimePicker')
            this.$emit('confirm', this.startDate, this.endDate)
        },
        /**
         * 比较两日期的大小
         */
        dateCompare (firstDate, secondDate) {
            let firstTime = this.unifiedDateFormat(firstDate)
            let secondTime = this.unifiedDateFormat(secondDate)
            firstTime = new Date(firstTime).getTime()
            secondTime = new Date(secondTime).getTime()
            if (firstTime === secondTime) {
                return 3
            } else {
                if (firstTime > secondTime) {
                    return 1
                } else if (firstTime > secondTime) {
                    return 0
                }
                return 0
            }
        },
        /**
         * 统一日期的月、日格式，小于10情况下格式均为  01、02、03、04……09格式
         * @param {date} 格式限定 2018-12-09，未增强代码健壮性，非此格式出错
         */
        unifiedDateFormat (date) {
            let tempArr = []
            tempArr = date.split('-')
            tempArr[1] = parseInt(tempArr[1]) > 9 ? tempArr[1] : `0${parseInt(tempArr[1])}`
            tempArr[2] = parseInt(tempArr[2]) > 9 ? tempArr[2] : `0${parseInt(tempArr[2])}`
            return tempArr.join('-')
        },
        /**
         * 日期范围开始日期样式
         */
        showStartSty (pick) {
            let {year, month, dateNum, outfocus} = pick
            if (!outfocus) {
                if (this.startDate === `${year}-${month}-${dateNum}`) {
                    return true
                } else {
                    return false
                }
            }
        },
        /**
         * 日期范围结束日期样式
         */
        showEndSty (pick) {
            let {year, month, dateNum, outfocus} = pick
            if (!outfocus) {
                if (this.endDate === `${year}-${month}-${dateNum}`) {
                    return true
                } else {
                    return false
                }
            }
        },
        /**
         * 日期范围内日期样式
         */
        showWithinSty (pick) {
            let {year, month, dateNum, outfocus} = pick
            if (!outfocus && this.startDate && this.endDate) {
                if (this.dateCompare(this.startDate, `${year}-${month}-${dateNum}`) === 0 &&
                    this.dateCompare(`${year}-${month}-${dateNum}`, this.endDate) === 0) {
                    return true
                } else {
                    return false
                }
            }
        },
        /**
         * 开始结束为同一天
         */
        showSameDay (pick) {
            let {year, month, dateNum, outfocus} = pick
            if (!outfocus) {
                if (this.startDate === `${year}-${month}-${dateNum}` && this.endDate === `${year}-${month}-${dateNum}`) {
                    return true
                } else {
                    return false
                }
            }
        },
        /**
         * 点击遮罩成执行的方法
         */
        handleClickMask () {
            this.$emit('hideDatePicker')
        }
    }
}
</script>

<style lang="scss" scoped>
@import './css/datePicker';
</style>
