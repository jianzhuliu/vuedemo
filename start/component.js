Vue.component("todo-item", {
    props: ['todo'],
    template: `<li @click="$emit('show', todo)">{{todo.id}}、{{todo.text}}</li>`
})

Vue.component("magic-eight-ball", {
    data: function () {
        return {
            possibleAdvice: ['Yes', 'No', 'Maybe']
        }
    },
    methods: {
        giveAdvice: function () {
            var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length);
            this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex]);
        }
    },
    template: `
    <button @click="giveAdvice">Click me for advice</button>
    `

})

var app1 = new Vue({
    el: "#app1",
    data: {
        todos: [
            { id: 1, text: "吃饭" },
            { id: 2, text: "睡觉" },
            { id: 3, text: "喝水" }
        ],
        todoMsg:"",
        advice: ""
    },
    methods: {
        show: function (todo) {
           this.todoMsg = "going to " + todo.text;
        },
        showAdvice: function (advice) {
            this.advice = advice;
        }
    }


})

Vue.component("tpl-todo", {
    props:['title'],
    template: `
    <li>{{title}}   <button @click="$emit('remove')">删除</button></li>
    `
})

var app2 = new Vue({
    el:"#app2",
    data:{
        newTodo:"",
        todos:[],
        nextId:1
    },
    methods:{
        addNewTodo: function(){
            this.todos.push({
                id:this.nextId++,
                title:this.newTodo
            });
            this.newTodo = "";
        },
        clearAll:function(){
            this.todos = [];
            this.nextId = 1;
        }
    }
})