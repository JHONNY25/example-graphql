<template>
    <div class="modal fade" :id="idModal" tabindex="-1" role="dialog" aria-labelledby="taskModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="taskModalLabel">{{ titleModal }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <slot name="main"></slot>
            </div>
            
            <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['idModal','titleModal'],
    }
</script>
