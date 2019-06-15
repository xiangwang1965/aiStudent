<template>
    <div class="classWrape">
        <div class="top"></div>
        <el-form ref="form" :rules="formRules" :model="form"  size="mini">
            <el-form-item label-width="120px" prop="courseId" label-position="center" label="选择课程">
                <el-select value-key="course" v-model="courseName"  @change="changeCourse" placeholder="请选择">
                    <el-option
                    v-for="item in courseOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    <template>
                        <span>{{item.name}}</span>
                    </template>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="等级" prop="level" label-width="120px">
                <el-select v-model="form.level" placeholder="请选择">
                    <el-option
                    v-for="item in levelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-position="center" prop="time" label-width="120px" label="上课起始时间">
                <el-date-picker
                    v-model="form.time"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm"
                    :default-time="['12:00:00']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label-position="center" prop="name" label-width="120px" label="班级名称">
                <el-input v-model="form.name" style="width:176px;"></el-input>
            </el-form-item>
            <el-form-item label-position="center" prop="teacherId"  label-width="120px" label="教师">
                <el-select value-key="teacher" @change="changeTeacher" v-model="teacherName" filterable placeholder="请选择">
                    <el-option
                    v-for="item in teachersOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    <template>
                        <span>{{item.name}}</span>
                    </template>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="default" @click="submit" class="cac-button-one">创建</el-button>
        <el-dialog class="confirmWrap" width="80%" center append-to-body title="创建班级" :visible.sync="showConfirm">
            <ul class="confirmList">
                <li>
                    <span>课程类型:</span>
                    <span>{{courseName}}</span>
                </li>
                <li>
                    <span>等级:</span>
                    <span>等级{{form.level}}</span>
                </li>
                <li>
                    <span>上课时间:</span>
                    <span>{{classTime}}</span>
                </li>
                <li>
                    <span>班级名称:</span>
                    <span>{{form.name}}</span>
                </li>
                <li>
                    <span>教师:</span>
                    <span>{{teacherName}}</span>
                </li>
            </ul>
            <p>确定信息无误，创建新班级？</p>
            <el-button type="default" class="cac-button-one">取消</el-button>
            <el-button type="default" @click="createClass" class="cac-button-one">确定</el-button>
        </el-dialog>
    </div>
</template>
<script>
import classApi from '../../services/classroom'
import utils from '../../utils'
export default {
    data(){
        const levels = (() =>{
            let arr = [];
            for(let i =1;i<=12;i++){
                arr.push({
                    name:'等级' + i,
                    id:i
                })
            }
            return arr;
        })();
        return {
            courseOptions:[],
            levelOptions:levels,
            teachersOptions:[],
            value:'',
            value1:'',
            showConfirm:false,
            courseName:'',
            teacherName:'',
            form:{
                courseId:'',
                level:'',
                name:'',
                teacherId:'',
                time:''
            },
            classTime:'',
            formRules:{
                courseId:[
                    { required: true, message: '请选择课程类型', trigger: 'blur' }
                ],
                level:[
                    { required: true, message: '请选择等级', trigger: 'blur' }
                ],
                name:[
                    { required: true, message: '请填写班级名字', trigger: 'blur' }
                ],
                time:[
                    { required: true, message: '请选择上课时间', trigger: 'blur' }
                ],
                teacherId:[
                    { required: true, message: '请选择教师', trigger: 'blur' }
                ]
            }
        }
        
    },
    created(){
        this.getCourseOptions();
        this.getTeachersOptions();
    },
    methods:{
        reset(){
            this.form = {
                courseId:'',
                level:'',
                name:'',
                teacherId:'',
                time:''
            }
            this.$refs.form.resetFields();
        },
        getCourseOptions(){
            classApi.getCourseOptions().then(res => {
                this.courseOptions = res.data;
            })
        },
        getTeachersOptions(){
            let params = {
                searchTxt:''
            }
            classApi.getTeachersOptions(params).then(res => {
                this.teachersOptions = res.data;
            })
        },
        changeCourse(course){
            //debugger;
            this.courseName = course.name;
            this.form.courseId = course.id;
        },
        changeTeacher(teacher){
            this.teacherName = teacher.name;
            this.form.teacherId = teacher.id;
        },
        submit(){
            //debugger;
            this.$refs.form.validate(valid => {
                if(valid){
                    this.showConfirm = true;
                    let time = this.form.time;
                    let time1Arr = time[0].split(' ');
                    let time2Arr = time[1].split(' ');
                    console.log(time)
                    this.form.startDate = time1Arr[0];
                    this.form.stopDate = time2Arr[0];
                    this.form.startTime = time1Arr[1];
                    this.form.endTime = time2Arr[1];
                    this.classTime = this.form.startDate + '(' + this.form.startTime + ')' + '至' + this.form.stopDate + '(' + this.form.endTime + ')';
                }else{
                    return false;
                }
            })
        },
        createClass(){
            classApi.createClass(this.form).then(res => {
                if(res.code === '001'){
                    this.showConfirm = false;
                    this.$message({
                        message: '创建班级成功！',
                        type: 'success'
                    });
                    this.$emit('refresh',this.form.courseId);
                    this.$router.push('/class');
                }else{
                    this.$message({
                        message: '创建班级失败！',
                        type: 'error'
                    });
                }
                console.log(res);
            }).catch(err => {
                this.$message({
                    message: '创建班级失败！',
                    type: 'error'
                });
            })
        }
        
    }
}
</script>
<style lang="less" scoped>
    @bottom:1px solid #979797;
    .el-select{border-radius: 0;}
    .cac-button-one{margin-left:20vw;}
    .el-form-item{
        height:40px;
    }
    .classWrap{
         .top{width:100%;height:5px;border-bottom:@bottom}
    }
    .confirmWrap{
        .confirmList{
            margin-left:22vw;
            li{
                width:100%;
                height:44px;
                span:first-child{
                    display: inline-block;
                    width:100px;
                }
                span:last-child{
                    font-family: HYQiHei-FZS;
                    font-size: 18px;
                    color: #4994FD;
                    letter-spacing: 0;
                }
            }
        }
        p{
            font-family: 'HYQiHei-FZS';
            font-size: 20px;
            letter-spacing: 0;
            text-align: center;
        }
    }
</style>


