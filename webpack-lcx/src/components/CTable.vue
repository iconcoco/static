<template>
    <div class="CaresPay-table">
        <slot></slot>
    </div>
</template>


<style lang="scss" scoped>
    .CaresPay-table{
        table{
            width: 100%;
            th,td{
                font-size: 14px;
                font-weight: normal;
                color: #444;
                height: 50px;
                padding: 5px;
                padding-left: 10px;
                text-align: left;
            }
            th{
                height: 36px;
                background-color: rgba(248, 248, 248, 1);
                color: #999;
            }
            tbody{
                tr{
                    background-color: #fff;
                    border-bottom: 1px solid #F8F8F8;
                    transition: all .5s;
                    &:hover{
                        // rgba(234, 105, 0, .05);
                        background-color: #f0f0f0;
                        // background-color: rgba(242, 248, 252,.5);
                    }
                }
            }

             .empty{
                td{
                    text-align: center;
                    color: #aaa;
                }
            }
        }
    }
</style>
