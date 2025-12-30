<template>
	<view>
		<view class="flex_r_c top">

			<view class="flex_r_c user">
				<view class="flex1 user-r">
					<view class="text_weight_bold text_34 user-r-title">
						转账给 测试商户
					</view>
					<view class="text_30 user-r-text text_colour_7">
						微信号：pan_888888
					</view>
				</view>
				<view class="user-img">
					<image class="wh_100" src="./WechatIMG27.jpg" mode="aspectFill"></image>
				</view>
			</view>

		</view>

		<view class="money-box">
			<view class="text_colour_3 money-box-title">转账金额</view>
			<view class="flex_r_c text_50 text_weight_bold money-box-row">
				<view class="money-box-row-">￥</view>
				<view class="flex1 flex_r fa_c money">
					{{keyboard.valueToLocaleString}}
					<view class="cursor"></view>
					<!-- <view class="text_26 color__ money-text">
						{{keyboard.valueText}}
					</view> -->
				</view>
			</view>
			<view class="line">
			</view>
			<view class="text_28 money-box-text">
				<text style="color: #686B8A">添加转账说明</text>
			</view>
		</view>

		<view class="keyboard">
			<pan-keyboard ref="panKeyboardRef" :maxValue="maxValue" :isCheck='checkValue' @onSubmit='onSubmit' @onChange="onChange"
				@onError="onErrorx"></pan-keyboard>
				<view class="placeholder" :style="placeholderStyle"></view>
		</view>

	</view>
</template>

<script>
	import axios from 'axios';
	import CryptoJS from 'crypto-js'; // 需安装：npm install crypto-js

	export default {
		data() {
			return {
				client: '',
				apiKey:"UcKm5Sm7EadxcNQIWNLA1jhDuT8EDcqTpssr3Wcq5WzGmUG8rqRD1MeZ0ak4Lpq3FHh4JgxNc9kv52AKmAFjuSmCc1m6Q9jlrv1R2aC8q4mlQm7j9eLXYQfpYDtB3Due",
				isShake: false,
				isMaxValueShake: false,
				pageData: {},
				keyboard: {},
				payFlag: false,
				bankCard: {},
				maxValue: 10000,
				payParams: {
				        mchNo: 'M1765350181', // 商户号（请替换为实际商户号）
				        wayCode: 'ALI_WAP', // 支付方式编码
				        amount: 1, // 金额（单位：分）
				        subject: '静态支付', // 商品标题
				        body: '静态支付收款码', // 商品描述
				     }
				// payParams: {
				//         mchNo: 'M1765350181', // 商户号（请替换为实际商户号）
				//         appId: '69391b251b6ef9b1e3fe3f2c', // 应用ID（请替换为实际应用ID）
				//         mchOrderNo: '', // 商户订单号
				//         wayCode: 'ALI_WAP', // 支付方式编码
				//         amount: 1, // 金额（单位：分）
				//         currency: 'CNY', // 币种
				//         subject: '测试商品', // 商品标题
				//         body: '测试商品描述', // 商品描述
				//         signType: 'MD5', // 签名类型（支持MD5、RSA256）
				// 		version: '1.0',
				// 		reqTime: '',
				//         // extra: {} // 额外参数（根据支付方式需要）
				//      }
			};
		},
		onLoad() {
			// 用这个方式设置初始值；不设置默认为空
			setTimeout(()=>{
				this.$refs.panKeyboardRef.setKeyboard(100)
			},100)
				// detect running client: wechat / alipay / browser
				this.client = this.detectClient();
				console.log('当前运行环境：', this.client);
		},
		mounted() {
			    // this.generateOrderNo();
		},
		computed: {
			checkValue() {
				let valueNumber = this.keyboard.valueNumber

				// 可以在实时这里校验输入的值
				// if (valueNumber < 100) return false;
				// if (valueNumber % 10) return false;
				return true;
			},
			placeholderStyle() {
				const style = {}
				style.height = `${this.height}rpx`
				// #ifndef MP-WEIXIN
				const {
					safeAreaInsets
				} = uni.getSystemInfoSync()
				style.paddingBottom = `${safeAreaInsets.bottom}px`
				// #endif
				return style;
			}
		},
		methods: {
			// 检测当前运行环境（微信/支付宝/普通浏览器）
			detectClient() {
				const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
				if (/micromessenger/.test(ua)) return 'wechat';
				if (/alipayclient/.test(ua)) return 'alipay';
				return 'browser';
			},
			isWeChat() {
				return this.client === 'wechat' || (/micromessenger/.test((navigator.userAgent||'').toLowerCase()));
			},
			isAlipay() {
				return this.client === 'alipay' || (/alipayclient/.test((navigator.userAgent||'').toLowerCase()));
			},
			// 金额完成/打开验证码
			onSubmit(e) {
				this.keyboard = e
				console.log(this.keyboard.value)
				this.createPayment()
			},
			// 金额输入中
			onChange(e) {
				this.keyboard = e
			},
			onErrorx(){
				uni.showToast({
				title: '超过最大转账金额' + this.maxValue,
				duration: 2000
				});
				console.log('超过限制')
			},    /**
			 * 生成随机商户订单号（年月日时分秒+6位随机数）
			 */
			generateOrderNo() {
			  const date = new Date();
			  const prefix = date.toISOString().replace(/[-:\.T]/g, '').slice(0, 14);
			  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
			  this.payParams.mchOrderNo = `M${prefix}${random}`;
			  return this.payParams.mchOrderNo;
			},
			    
			    /**
			     * 生成签名（Jeepay签名规则）
			     * 规则：参数按ASCII排序 + 拼接apiKey + 加密（MD5/RSA）
			     */
			    generateSign(params) {
			      // 1. 过滤空值参数
			      const validParams = Object.entries(params).filter(([key, value]) => 
			        value !== undefined && value !== null && value !== '' 
			      );
			      
			      // 2. 按参数名ASCII升序排序
			      validParams.sort((a, b) => a[0].localeCompare(b[0]));
			      
			      // 3. 拼接为key=value&key=value格式
			      const signStr = validParams.map(([key, value]) => {
			        // 如果是对象/数组，转为JSON字符串
			        const val = typeof value === 'object' ? JSON.stringify(value) : value;
			        return `${key}=${val}`;
			      }).join('&');
			      
			      // 4. 拼接API密钥
			      const finalStr = `${signStr}&key=${this.apiKey}`;
			      console.log(finalStr)
			      // 5. 加密（根据signType选择加密方式）
			      if (this.payParams.signType === 'MD5') {
			        return CryptoJS.MD5(finalStr).toString().toUpperCase();
			      } else if (this.payParams.signType === 'RSA256') {
			        // RSA256签名逻辑（需替换为实际私钥）
			        const privateKey = 'your-rsa-private-key';
			        return CryptoJS.RSA.sign(finalStr, privateKey, {
			          hash: CryptoJS.algo.SHA256
			        }).toString();
			      }
			    },
			    
			    /**
			     * 发起支付请求
			     */
			    async createPayment() {
					// this.generateOrderNo();
			      try {
			        this.isLoading = true;
			        this.errorMsg = '';
			        this.paymentResult = null;
			        
			        // 1. 验证必填参数
			        // if (!this.payParams.mchNo || !this.payParams.appId) {
			        //   this.errorMsg = '请填写商户号和应用ID';
			        //   return;
			        // }
			        
			        if (this.amountYuan <= 0) {
			          this.errorMsg = '订单金额必须大于0';
			          return;
			        }
			        
			        // 2. 转换金额单位（元 -> 分）
			        // this.payParams.amount = Math.round(this.amountYuan * 100);
			        
			        this.payParams.amount =this.keyboard.valueNumber * 100;
					this.payParams.reqTime =  Date.now();
			        // 3. 生成签名
			        // const sign = this.generateSign(this.payParams);
			        // // 4. 构造最终请求参数
			        // const requestParams = {
			        //   ...this.payParams,
			        //   sign // 加入签名
			        // };
					
			        console.log(requestParams)
			        // 5. 发起接口请求
			        const response = await axios({
			          // url: 'https://pay.jeepay.vip/api/pay/unifiedOrder',
			          url: 'http://10.185.251.63:9216/api/pay/unifiedOrder',
			          // url: 'http://10.185.251.63:9216/api/v2/pay/unifiedOrder',
			          method: 'POST',
			          headers: {
			            'Content-Type': 'application/json;charset=UTF-8'
			          },
			          data: requestParams,
			          timeout: 10000 // 10秒超时
			        });
			        
			        const result = response.data;
			        console.log(result)
			        console.log(result.code === '0')
			        console.log(result.code == '0')
			        console.log(result.code == 0)
			        // 6. 处理响应结果
			        if (result.code == '0') {
			          this.paymentResult = result;
			          console.log('支付请求成功', result);
			          console.log('支付地址', result.data.payData);
					  uni.showToast({
					  	title: result.data.payData
					  })
					  uni.redirectTo({
					      url: result.data.payData
					  });
					  // alert(result.data.payData)
					  window.open(result.data.payData)
					  // uni.redirectTo({
					  //     url: result.data.payData
					  // });
					  // window.open("http://www.baidu.com")
			        } else {
			          this.errorMsg = `支付请求失败：${result.msg}（错误码：${result.code}）`;
			          console.error('支付请求失败', result);
			        }
			      } catch (error) {
			        this.errorMsg = error.message || '网络异常，请稍后重试';
			        console.error('支付请求异常', error);
			      } finally {
			        this.isLoading = false;
			      }
			    },
			    
			    /**
			     * 跳转H5支付页面
			     */
			    redirectToPayUrl() {
			      if (this.paymentResult?.data?.payUrl) {
			        window.location.href = this.paymentResult.data.payUrl;
			      }
			    }
		}
	};
</script>

<style scoped lang="scss">
	.placeholder {
		width: 100%;
		height: 20rpx;
		/* #ifdef MP-WEIXIN*/
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom); //适配底部
		padding-bottom: env(safe-area-inset-bottom);
		/*#endif*/
	
	}
	.top {
		width: 100%;
		height: 260rpx;
		background-color: #EDEDED;

		.user {
			width: calc(100% - 120rpx);
			height: 100rpx;
			margin-bottom: 20rpx;

			.user-r {
				.user-r-title {}

				.user-r-text {}
			}

			.user-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
		}

	}

	.money-box {
		position: relative;
		top: -30rpx;
		box-sizing: border-box;
		padding: 50rpx 55rpx;
		width: 100%;
		border-radius: 30rpx 30rpx 0 0;
		background-color: #fff;

		.line {
			width: calc(100% - 40rpx);
			margin-top: 40rpx;
			border-bottom: 1px solid #dcdcdc;
		}

		.money-box-title {
			width: 100%;
			height: 60rpx;
			margin-bottom: 10rpx;
		}

		.money-box-text {
			position: relative;
			margin-top: 30rpx;
			font-size: 30rpx;
			color: #616161;

			.money-box-text_ {
				position: absolute;
				left: 0;
			}
		}

		.money-box-row {
			width: 100%;
			height: 100rpx;
			font-size: 70rpx;

			.money {
				position: relative;
				font-size: 80rpx;

				.money-text {
					position: absolute;
					bottom: -30rpx;
					left: 0;
				}
			}


			.money-box-row- {
				margin-top: 4rpx;
			}

			.money-box-row-icon {}
		}
	}

	.keyboard {
		position: fixed;
		box-sizing: border-box;
		width: 100%;
		bottom: 0;
		padding: 20rpx;
		background-color: #f7f7f7;
	}

	.cursor {
		position: relative;
		top: 10rpx;
		display: inline-block;
		width: 2px;
		height: 100rpx;
		margin-left: 10rpx;
		animation-name: cursor;
		animation-duration: 0.8s;
		animation-iteration-count: infinite;
		z-index: 1;
		background-color: #178E57;
	}

	@keyframes cursor {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	.shake {
		animation: shake 800ms ease-in-out;
	}

	@keyframes shake {

		/* 水平抖动，核心代码 */
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}

		20%,
		80% {
			transform: translate3d(+2px, 0, 0);
		}

		30%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}

		40%,
		60% {
			transform: translate3d(+4px, 0, 0);
		}

		50% {
			transform: translate3d(-4px, 0, 0);
		}
	}
	
	
	
	// ---------------以下代码是作者的公共css（部分）, 可通过npm i pan_css下载完整版 在app.vue中引入；这里就简化使用直接复制进来----------------
	.wh_100 {
		width: 100%;
		height: 100%;
	}
	
	.z_index2 {
		position: relative;
		z-index: 2;
	}
	
	.text_colour_red {
		color: #ff0000;
	}
	
	.text_colour_white {
		color: #fff;
	}
	
	.text_colour_0 {
		color: #000;
	}
	
	.text_colour_1 {
		color: #111;
	}
	
	.text_colour_2 {
		color: #222;
	}
	
	.text_colour_3 {
		color: #333;
	}
	
	.text_colour_4 {
		color: #444;
	}
	
	.text_colour_5 {
		color: #555;
	}
	
	.text_colour_6 {
		color: #666;
	}
	
	.text_colour_7 {
		color: #777;
	}
	
	.text_colour_8 {
		color: #888;
	}
	
	.text_colour_9 {
		color: #999;
	}
	
	.flex_r {
		display: flex;
		flex-direction: row;
	}
	
	.flex_c {
		display: flex;
		flex-direction: column;
	}
	
	.fj_b {
		justify-content: space-between;
	}
	
	.fj_a {
		justify-content: space-around;
	}
	
	.fj_c {
		justify-content: center;
	}
	
	.fa_c {
		align-items: center;
	}
	
	.flex_c_c {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.flex_r_c {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	
	.flex1 {
		flex: 1;
	}
	
	.text_16 {
		font-size: 16rpx;
	}
	
	.text_17 {
		font-size: 17rpx;
	}
	
	.text_18 {
		font-size: 18rpx;
	}
	
	.text_19 {
		font-size: 19rpx;
	}
	
	.text_20 {
		font-size: 20rpx;
	}
	
	.text_21 {
		font-size: 21rpx;
	}
	
	.text_22 {
		font-size: 22rpx;
	}
	
	.text_23 {
		font-size: 23rpx;
	}
	
	.text_24 {
		font-size: 24rpx;
	}
	
	.text_25 {
		font-size: 25rpx;
	}
	
	.text_26 {
		font-size: 26rpx;
	}
	
	.text_27 {
		font-size: 27rpx;
	}
	
	.text_28 {
		font-size: 28rpx;
	}
	
	.text_29 {
		font-size: 29rpx;
	}
	
	.text_30 {
		font-size: 30rpx;
	}
	
	.text_31 {
		font-size: 31rpx;
	}
	
	.text_32 {
		font-size: 32rpx;
	}
	
	.text_33 {
		font-size: 33rpx;
	}
	
	.text_34 {
		font-size: 34rpx;
	}
	
	.text_35 {
		font-size: 35rpx;
	}
	
	.text_36 {
		font-size: 36rpx;
	}
	
	.text_37 {
		font-size: 37rpx;
	}
	
	.text_38 {
		font-size: 38rpx;
	}
	
	.text_39 {
		font-size: 39rpx;
	}
	
	.text_40 {
		font-size: 40rpx;
	}
	
	.text_41 {
		font-size: 41rpx;
	}
	
	.text_42 {
		font-size: 42rpx;
	}
	
	.text_43 {
		font-size: 43rpx;
	}
	
	.text_44 {
		font-size: 44rpx;
	}
	
	.text_45 {
		font-size: 45rpx;
	}
	
	.text_46 {
		font-size: 46rpx;
	}
	
	.text_weight_bold {
		font-weight: bold;
	}
</style>