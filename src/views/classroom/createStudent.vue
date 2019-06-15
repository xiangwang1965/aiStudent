<template>
    <div class="studentWrape">
        <div class="top"></div>
        <el-form ref="form" align=left :rules="formRules" :model="form"  size="mini">
            <el-form-item label-width="120px" prop="name" label-position="center" label="姓名">
                <el-input style="width:240px" placeholder="请输入姓名" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" label-width="120px">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label-position="center" prop="birthday" label-width="120px" label="出生年月">
                <el-date-picker
                    v-model="form.birthday"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label-position="center" prop="phone" label-width="120px" label="手机号">
                <el-input v-model="form.phone" style="width:176px;"></el-input>
            </el-form-item>
            <el-form-item label-position="center" prop="passwd" label-width="120px" label="密码">
                <el-input v-model="form.passwd" style="width:176px;"></el-input>
            </el-form-item>
            <el-form-item label-position="center" prop="verificode"  label-width="120px" label="验证码">
                <el-input v-model="form.verificode" style="width:176px;">
                </el-input>
                <el-button style="border:none" type="default" @click="getCode">{{codeTxt}}</el-button>
            </el-form-item>
            <el-form-item label-position="center" prop="is_cdk" label-width="120px" label="激活码">
                <el-input v-show="false" v-model="form.is_cdk"></el-input>
                <el-autocomplete
                    class="inline-input"
                    v-model.trim="form.cdk"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    clearable
                ></el-autocomplete>
            </el-form-item>
        </el-form>
        <el-button type="default" @click="submit" class="cac-button-one">创建</el-button>
        <el-dialog class="confirmWrap" width="80%" center append-to-body title="创建学生信息" :visible.sync="showConfirm">
            <ul class="confirmList">
                <li>
                    <span>姓名:</span>
                    <span>{{form.name}}</span>
                </li>
                <li>
                    <span>性别:</span>
                    <span>{{form.sex === 2 ? '女' : '男'}}</span>
                </li>
                <li>
                    <span>出生年月:</span>
                    <span>{{form.birthday}}</span>
                </li>
                <li>
                    <span>手机号:</span>
                    <span>{{form.phone}}</span>
                </li>
                <li>
                    <span>密码:</span>
                    <span>{{form.passwd}}</span>
                </li>
                <li>
                    <span>激活码:</span>
                    <span>{{form.cdk}}</span>
                </li>
            </ul>
            <p>确定信息无误，创建新学生？</p>
            <el-button type="default" class="cac-button-one">取消</el-button>
            <el-button type="default" @click="createStudent" class="cac-button-one">确定</el-button>
        </el-dialog>
    </div>
</template>
<script>
import classApi from '../../services/classroom'
import utils from '../../utils'
export default {
    props:['currentType','currentClass','codeOptions'],
    data(){
        return {
            value:'',
            value1:'',
            showConfirm:false,
            code:'',
            form:{
                clsId:'',
                sex:1,
                name:'',
                phone:'',
                birthday:'',
                cdk:'',
                courseId:'',
                verificode:'',
                passwd:'',
                is_cdk:''
            },
            timer:'',
            codeTime:60,
            codeTxt:'获取验证码',
            classTime:'',
            formRules:{
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                sex:[
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                phone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                is_cdk:[
                    {required:true, message:'请选择或者输入激活码',trigger:'change'}
                ],
                birthday:[
                    { required: true, message: '请选择出生日期', trigger: 'blur' }
                ],
                verificode:[
                    { required: true, message: '请填写验证码', trigger: 'blur' }
                ],
                passwd:[
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            }
        }
        
    },
    watch:{
        'form.cdk'(){
            this.form.is_cdk = this.form.cdk;
        }
    },
    created(){
       
    },
    methods:{
        handleSelect(item){
           this.form.is_cdk = item.id;
        },
        querySearch(queryString, cb) {
            const options = this.codeOptions;
            let results = queryString ? options.filter(this.createFilter(queryString)) : options;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (option) => {
                return (option.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        reset(){
            this.form = {
                clsId:'',
                sex:1,
                name:'',
                phone:'',
                birthday:'',
                cdk:'',
                courseId:'',
                verificode:''
            }
            this.$refs.form.resetFields();
        },
        setCodeOptions(data){
            debugger;
            this.codeOptions = data;
        },
        getCode(){
          if(this.timer){
              return;
          }
          this.$refs.form.validateField('phone',valid=>{
              if(!valid){
                  let params = {
                      phone:this.form.phone
                  }
                  classApi.getVerificode(params).then(res => {
                    if(res.code === '001'){
                        this.$message({
                            message: '发送验证码成功，请查收！',
                            type: 'success'
                        });
                        this.timer = setInterval(() => {
                            this.codeTime--;
                            this.codeTxt= this.codeTime + 's后重新发送';
                            if(this.codeTime === 0){
                                clearInterval(this.timer);
                                this.timer = '';
                                this.codeTime = 60;
                                this.codeTxt = '重新发送';
                            }
                        }, 1000);
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                  }).catch(err => {
                      this.$message({
                            message: '发送验证码失败，请重试！',
                            type: 'error'
                        });
                  })
              }else{
                  return false;
              }
          })
        },
        submit(){
            this.$refs.form.validate(valid => {
                if(valid){
                    this.showConfirm = true;
                }else{
                    return false;
                }
            })
        },
        createStudent(){
            this.form.clsId = this.currentClass.id;
            this.form.courseId = this.currentType;
            classApi.createStudent(this.form).then(res => {
                if(res.code === '001'){
                    this.showConfirm = false;
                    this.$message({
                        message: '创建学生信息成功！',
                        type: 'success'
                    });
                    this.$router.push('/class');
                }else{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
                console.log(res);
            }).catch(err => {
                this.$message({
                    message: '创建学生信息失败！',
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
    .studentWrap{
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


