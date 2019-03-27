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
                    &:hover{
                        background-color: #F2F8FC;
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
