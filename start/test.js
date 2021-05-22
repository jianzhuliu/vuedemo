var obj = {
    name: "jianzhu",
    age: 21,
    x: 10,
    y: 12,
    watchXMsg: "",
    isDisabled: true,
    eventname: "click",
    inputMsg: "",
    numbers: [1, 2, 3, 4, 5]

}
// readonly 只读
//Object.freeze(obj)

var app1 = new Vue({
    el: "#app1",
    data: obj,
    sizeOption: 10,

    beforeCreate: function () {
        console.log("[beforeCreate]", "name is " + this.name + " sizeOption=" + this.$options.sizeOption);
    },
    created: function () {
        console.log("[created]", "name is " + this.name + " sizeOption=" + this.$options.sizeOption);
    },
    computed: {
        reverseInputMsg: function () {
            return this.inputMsg.split('').reverse().join('');
        },
        evenNumbers: function () {
            return this.numbers.filter(function (n) {
                return n % 2 == 0
            })
        }
    },
    watch: {
        x: function (newVal, oldVal) {
            this.watchXMsg = 'newVal=' + newVal + ', oldVal=' + oldVal;
            console.log('[watch|x]' + this.watchXMsg);

        }
    }
})

app1.$watch('name', function (newVal, oldVal) {
    console.log("[name changed]", "newVal=" + newVal + ", oldVal=" + oldVal);
})


var unwatch = app1.$watch(function () {
    return this.x + this.y;
}, function (newVal, oldVal) {
    console.log("[watch]", "newVal=" + newVal + ", oldVal=" + oldVal + ", x=" + this.x + ", y=" + this.y);
    if (unwatch) {
        unwatch();
    }
})

var app0 = new Vue({
    el: "#app0",
    data: {
        name: "bob"
    },
    sizeOption: 10,
    beforeCreate: function () {
        console.log("[beforeCreate]", "name is " + this.name + " sizeOption=" + this.$options.sizeOption);
    },
    created: function () {
        console.log("[created]", "name is " + this.name + " sizeOption=" + this.$options.sizeOption);
    },
    beforeMount: function () {
        console.log("[beforeMount]");
    },
    mounted: function () {
        console.log("[mounted]");
    },
    beforeUpdate: function () {
        console.log("[beforeUpdate]");
    },
    updated: function () {
        console.log("[updated]");
    },
    beforeDestroy: function () {
        console.log("[beforeDestroy]");
    },
    destroyed: function () {
        console.log("[destroyed]");
    }
})

// app0.$destory()