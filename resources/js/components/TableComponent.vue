<template>
    <div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header" >{{ header.text }}</th>
                </tr>
            </thead>
            <tbody>
                <slot name="table-content"></slot>
            </tbody>
        </table>
    </div>
</template>

<script>
import { argsToArgsConfig } from 'graphql/type/definition';

    export default {
        props:{
            headers: []
        },
    }
</script>
