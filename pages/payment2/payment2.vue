<template>
  <div class="payment-container">
    <!-- 顶部收款人信息区域 -->
    <div class="payee-info">
      <img 
        class="avatar" 
        src="https://via.placeholder.com/80/4299e1/ffffff?text=收款方" 
        alt="收款人头像"
      >
      <div class="info">
        <div class="name">张三</div>
        <div class="account">收款账号：zhangsan@example.com</div>
      </div>
    </div>

    <!-- 金额输入区域 -->
    <div class="amount-section">
      <div class="label">请输入支付金额</div>
      <div class="amount-input">
        <span class="currency">¥</span>
        <input 
          v-model="amount" 
          type="text" 
          placeholder="0.00" 
          @focus="hideKeyboard = false"
          @blur="hideKeyboard = true"
        >
      </div>
    </div>

    <!-- 收款码展示 -->
    <div class="qrcode-section">
      <div class="qrcode">
        <img 
          src="https://via.placeholder.com/200/4299e1/ffffff?text=收款码" 
          alt="收款码"
        >
      </div>
      <div class="tip">请使用付款码扫码支付</div>
    </div>

    <!-- 数字键盘 -->
    <div class="number-keyboard" :class="{ hidden: hideKeyboard }">
      <div class="keyboard-row">
        <button class="key" @click="appendNumber('1')">1</button>
        <button class="key" @click="appendNumber('2')">2</button>
        <button class="key" @click="appendNumber('3')">3</button>
      </div>
      <div class="keyboard-row">
        <button class="key" @click="appendNumber('4')">4</button>
        <button class="key" @click="appendNumber('5')">5</button>
        <button class="key" @click="appendNumber('6')">6</button>
      </div>
      <div class="keyboard-row">
        <button class="key" @click="appendNumber('7')">7</button>
        <button class="key" @click="appendNumber('8')">8</button>
        <button class="key" @click="appendNumber('9')">9</button>
      </div>
      <div class="keyboard-row">
        <button class="key" @click="appendNumber('.')">.</button>
        <button class="key" @click="appendNumber('0')">0</button>
        <button class="key delete" @click="deleteNumber">删除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 金额数据绑定
const amount = ref('')
// 控制数字键盘显示隐藏
const hideKeyboard = ref(false)

// 格式化金额输入
const formatAmount = (val) => {
  // 去除非数字和小数点的字符
  let str = val.replace(/[^\d.]/g, '')
  // 只保留一个小数点
  str = str.replace(/\.{2,}/g, '.')
  // 小数点后最多保留两位
  str = str.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  str = str.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  // 处理开头为0的情况
  if (str.indexOf('.') === 0) str = '0' + str
  if (str.split('.')[0].length > 1 && str.split('.')[0].indexOf('0') === 0) {
    str = str.substring(1)
  }
  return str
}

// 追加数字
const appendNumber = (num) => {
  amount.value = formatAmount(amount.value + num)
}

// 删除数字
const deleteNumber = () => {
  amount.value = formatAmount(amount.value.slice(0, -1))
}

// 监听金额变化，确保格式正确
watch(amount, (newVal) => {
  amount.value = formatAmount(newVal)
})
</script>

<style scoped>
.payment-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 收款人信息样式 */
.payee-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.account {
  font-size: 14px;
  color: #666;
}

/* 金额输入区域样式 */
.amount-section {
  margin-bottom: 30px;
}

.label {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  padding-left: 5px;
}

.amount-input {
  display: flex;
  align-items: flex-end;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.currency {
  font-size: 24px;
  color: #333;
  margin-right: 8px;
  margin-bottom: 4px;
}

.amount-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 32px;
  font-weight: 600;
  color: #333;
  text-align: left;
  padding: 0;
}

.amount-input input::placeholder {
  color: #ccc;
}

/* 收款码区域样式 */
.qrcode-section {
  text-align: center;
  margin-bottom: 20px;
}

.qrcode {
  display: inline-block;
  padding: 15px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.qrcode img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.tip {
  font-size: 14px;
  color: #666;
}

/* 数字键盘样式 */
.number-keyboard {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
}

.number-keyboard.hidden {
  display: none;
}

.keyboard-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.key {
  width: 30%;
  height: 60px;
  border: none;
  border-radius: 8px;
  background: #fff;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.key:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.delete {
  background: #e9ecef;
  color: #4299e1;
}

/* 响应式适配 */
@media (max-width: 375px) {
  .key {
    height: 50px;
    font-size: 20px;
  }
  
  .amount-input input {
    font-size: 28px;
  }
}
</style>