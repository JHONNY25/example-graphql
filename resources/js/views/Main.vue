<template>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ title }}</div>

                <div class="card-body">
                    <div class="mb-3">
                        <button type="button" class="btn btn-success text-white" data-toggle="modal" :data-target="'#'+idModal">Agregar</button>

                        <modal-component :idModal="idModal" :titleModal="titleModal">
                            <template v-slot:main>
                                <form>
                                    <div class="form-group">
                                        <label for="user">User: </label>
                                        <select class="form-control" id="user" v-model="taskObject.user_id">
                                            <option value="0">Seleccione un usuario</option>
                                            <option v-for="(user,index) in users" :value="user.id" :key="index">{{ user.name }}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="name" class="col-form-label">Nombre de la tarea:</label>
                                        <input type="text" class="form-control" id="name" v-model="taskObject.name">
                                    </div>
                                    <div class="form-group">
                                        <label for="delivery_date" class="col-form-label">Fecha de entrega:</label>
                                        <input type="date" class="form-control" id="delivery_date" v-model="taskObject.delivery_date">
                                    </div>
                                    <div class="form-group">
                                        <label for="task" class="col-form-label">Tarea:</label>
                                        <textarea class="form-control" id="task" v-model="taskObject.task"></textarea>
                                    </div>
                                </form>
                            </template>

                            <template v-slot:footer>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="saveTask">Guardar</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                </div>
                            </template>
                        </modal-component>
                    </div>
                    <table-component :headers="headers">
                        <template v-slot:table-content>
                            <tr v-for="(item,index) in tasks" :key="index">
                                <td>{{ item.name }}</td>
                                <td>{{ item.task }}</td>
                                <td>{{ item.user.name }}</td>
                                <td>
                                    <button type="button" class="btn btn-info text-white">Editar</button>
                                    <button type="button" class="btn btn-danger text-white">Eliminar</button>
                                </td>
                            </tr>
                        </template>


                    </table-component>

                    <sliding-pagination
                        style="text-align: center !important;
                        margin: 1.5em 0 !important;"
                        :current="parseInt(pagination.currentPage)"
                        :total="parseInt(pagination.lastPage)"
                        @page-change="pageChangeHandler"
                    ></sliding-pagination>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import gql from 'graphql-tag'
    import TableComponent from '../components/TableComponent.vue'
    import ModalComponent from '../components/ModalComponent.vue'
    import SlidingPagination from 'vue-sliding-pagination'

    export default {
        data(){
            return {
                title: 'Tasks',
                tasks: [],
                users: [],
                headers:[
                    {
                        text: 'Nombre', value: 'name'
                    },
                    {
                        text: 'Tarea', value: 'task'
                    },
                    {
                        text: 'Usuario', value: 'user.name'
                    },
                    {
                        text: 'Acciones', value: ''
                    },
                ],
                idModal: 'taskModal',
                titleModal: 'Agregar Tarea',
                taskObject :{
                    name: "",
                    task: "",
                    delivery_date: "",
                    user_id: null
                },
                emmptyTaskObject :{
                    name: "",
                    task: "",
                    delivery_date: "",
                    user_id: null
                },
                pagination: {},
            }
        },
        components:{
            TableComponent,
            SlidingPagination
        },
        methods: {
            pageChangeHandler(selectedPage) {
                this.pagination.currentPage = selectedPage
                this.getTasks()
            },
            async getTasks(){
                const response = await this.$apollo.query({
                    query: gql(`query($page: Int!){
                        tasks(first:1,page:$page){
                            paginatorInfo{
                                count,
                                currentPage,
                                firstItem,
                                hasMorePages,
                                lastItem,
                                lastPage,
                                perPage,
                                total
                            },
                            data{
                                name,
                                task,
                                user{
                                    name
                                }
                            }
                        }
                    }`),
                    variables: {
                        page: this.pagination.currentPage ? parseInt(this.pagination.currentPage) : 1
                    },
                })

                this.tasks = response.data.tasks.data
                this.pagination = response.data.tasks.paginatorInfo
            },
            async getUsers(){
                const response = await this.$apollo.query({
                    query: gql(`{
                        users{
                            data{
                                id,
                                name,
                            }
                        }
                    }`)
                })

                this.users = response.data.users.data
            },
            async saveTask(){
                const task = await this.$apollo.mutate({
                    mutation: gql`
                mutation($name: String!,
                    $task: String!,
                    $delivery_date: Date!,
                    $user_id: ID!){
                    createTask(input: {
                        name: $name,
                        task: $task,
                        delivery_date: $delivery_date,
                        user_id: $user_id
                    }){
                        name
                    }
                }`,
                variables: {
                    name: this.taskObject.name,
                    task: this.taskObject.task,
                    delivery_date: this.taskObject.delivery_date,
                    user_id: this.taskObject.user_id
                },
                }).then((data) => {
                    this.getTasks()
                    this.$swal({
                        icon: 'success',
                        title: 'Agrego nueva tarea',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }).catch((error) => {
                    this.$swal({
                        icon: 'error',
                        title: 'Hubo un error al guardar la tarea',
                        showConfirmButton: true,
                    })
                })


                this.taskObject = Object.assign({}, this.emptyTaskObject)

            },
            async deleteTask(){
                this.$swal({
                    title: 'Estas seguro que quieres eliminarlo?',
                    text: "No podras revertir los cambios!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!'
                }).then((result) => {
                    if (result.value) {
                        this.deleteProduct()
                        this.snackbar = true
                        this.text = 'Se elimino correctamente'
                        this.cancelar()
                    }
                })
            }
        },
        created() {
            this.getTasks()
            this.getUsers()
        },
    }
</script>

