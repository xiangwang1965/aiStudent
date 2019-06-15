<template>
    <div class="studentManage">
        <div class="top"></div>
        <div class="left-item">
            <div class="h3">现有班级</div>
            <ul class="students">
                <li v-for="item in datalist" :class="{active:currentClass=== item.id}" @click="setRight(item)" :key="item.id">
                    <div>
                        <p>{{item.courseName}}</p>
                        <p style="margin-top:4px;">时间：{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</p>
                    </div>
                    <i class="el-icon-delete" @click="showDeleteConfirm(item)"></i>
                </li>
            </ul>
            <div class="info" @click="handleCreate">
                <el-button type="default" class="cac-button-one">创建新班级</el-button>
            </div>
        </div>
        <div class="right-item">
            <div class="h3">班级信息</div>
            <div class="infoCon">
                <ul>
                    <li>
                        <p><span>班级</span>：{{className}}</p>
                        <p><span>课程</span>：{{course}}</p>
                        <p><span>机构</span>：{{school}}</p>
                        <p><span>教师</span>：{{teacher}}</p>
                    </li>
                </ul>
            </div>
            <div class="save">
                <el-button type="default" class="cac-button-one">保存</el-button>
            </div>
        </div>
        <el-dialog append-to-body width="80%" title="创建班级" :visible.sync="showCreate">
            <createClass ref="child"></createClass>
        </el-dialog>
    </div>
</template>
<script>
import createClass from "./createClass";
import classApi from '../../services/classroom';
export default {
    props:['datalist','currentIndex'],
    data(){
        return {
            defaultImg:require('../../../static/img/student.png'),
            showCreate:false,
            currentClass:'',
            className:'',
            course:'',
            school:'',
            teacher:''
        }
    },
    components:{
        createClass
    },
    mounted(){
        this.setRight(this.datalist[this.currentIndex]);
    },
    methods:{
        setRight(data){
            if(!data){
                this.className = '';
                this.course = '';
                this.school = '';
                this.teacher = '';
                return;
            }
            this.currentClass = data.id;
            this.className = data.name;
            this.course = data.courseName;
            this.school = data.schoolName;
            this.teacher = data.teacherName;
        },
        handleCreate(){
            this.showCreate = true;
            if(this.$refs.child){
                this.$refs.child.reset();
            }
            this.className = '';
            this.teacherName = '';
        },
        showDeleteConfirm(item){
            this.$confirm('确定删除该班级吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center:false,
            }).then(() => {
                let params = {
                    clsId:item.id
                }
                classApi.deleteClass(params).then(res => {
                    this.datalist.forEach((cla,index) => {
                        if(cla.id === item.id){
                            this.datalist.splice(index,1);
                        }
                    });
                    this.setRight(this.datalist[0]);
                    this.$emit('refresh',this.datalist);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>
<style lang="less" scoped>
    @bottom:1px solid #979797;
    .el-icon-delete{
        cursor: pointer;
        color:cornflowerblue;
    }
    .top{width:100%;height:5px;border-bottom:@bottom}
    .h3{
        width:100%;
        height:44px;
        line-height:44px;
        border-bottom:@bottom;
        color:#000;
        text-align: center;
    }
    .studentManage{
        height:50vh;
        margin:0;
        padding:0;
        .left-item{
            position:relative;
            float:left;
            width:30vw;
            height:100%;
            border-right:@bottom;
            ul{
                margin:0 auto;
                padding:0 5px;
                height:240px;
                overflow: auto;
                li{
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    div{
                        float:left;
                        margin-left:0px;
                        width:280px;
                        p{font-size:12px;}
                    }
                    i{
                        margin-top:15px;
                        margin-right:0px;
                    }
                    &.active{
                        background:rgba(#F3F6FC);
                    }

                }
            }
            .info {
                position:fixed;
                top:70vh;
                left:20vw;
                height:60px;
            }
        }
        .right-item{
            float:left;
            width:45vw;
            height:100%;
            ul li{
                width:450px;
                padding:10px 5px;
                background: #F3F6FC;
                border-radius: 12px;
                margin-left:10px;
                margin-top:10px;
                min-height:60px;
                overflow: auto;
                overflow-x:hidden;
                line-height:100%;
                p{
                    float:left;
                    width:100%;
                    margin-left:18px;
                    margin-top:10px;
                    span{
                        color:#9b9b9b;
                    }
                }
            }
            .save {
                position:fixed;
                top:70vh;
                left:60vw;
                height:60px;
            }
        }
    }
</style>


