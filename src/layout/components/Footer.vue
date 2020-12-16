<template>
  <div class="footer">
    <hr style="height:0;border:none;border-top:1px solid #e0e0e0;margin: 0">
    <div style="height: 70px;width: 90%;margin: 0 auto;">
      <el-footer style="height: 70px">
        <el-row>
          <el-col :span="24" style="font-size: 14px;font-weight: bolder;color: #8b8b8b">
            <div class="grid-content">
              <div class="left">
                © 2020 GOJ
              </div>
              <div class="right">
                Crafted with <i class="el-icon-s-opportunity" style="color: red" /> by
                <a href="tencent://message/?uin=1790286512">
                  <img
                    src="http://wpa.qq.com/pa?p=1:1790286512:4"
                    border="0"
                    alt="提示"
                  >不如守中</a>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-footer>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer{
  height: 70px;
  overflow: hidden;
  position: relative;
}
.grid-content {
  min-height: 70px;
}
.left {
  float: left;
  height: 100%;
  line-height: 70px;
}
.right {
  float: right;
  height: 100%;
  line-height: 70px;
}
</style>
