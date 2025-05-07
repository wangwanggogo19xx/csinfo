<template>
	<view class="custom-navbar">
	  <view class="navbar-title" >{{title}}</view>
	</view>
	<view class="content">
		<view class="service-list">
			<view v-for="(item,index) in services" :key="index">
				<view class="service-card" @click="onclick">
					<!-- <view class="icon">数字化建设</view> -->
					<view class="service-content">
					  <text class="title">{{item.title}}</text>
					  <text class="description">{{item.description}}</text>
					  <image class="service-image" mode="heightFix" :src="item.image">	</image>
					</view>
				</view>	
			</view>

		</view>
	</view>
	    <!-- 底部备案信息 -->
<!-- 	    <view class="footer">
	      <text class="footer-text">
	        © 2025 阐数信息技术服务有限责任公司. 保留所有权利。
	      </text>
	      <text class="footer-text">
	        川公网安备51015602001213号
	      </text>
		  <text class="footer-text">
		    蜀ICP备2024057957号-2	
		  </text>
	    </view> -->
</template>

<script>
	export default {
		data() {
			return {
				title: '阐数科技',
				services:[
					{
						title:"数字化建设",
						description:"提供高效、安全的IT基础设施与系统集成服务",
						image:"/static/images/shuzihua.jfif"
					},
					{
						title:"聚合支付",
						description:"一站式支付解决方案,安全便捷",
						image:"/static/images/juhezhifu.jfif"
					},
					{
						title:"微信红包封面定制",
						description:"提升品牌和个人形象，增加互动体验",
						image:"/static/images/redPacketCover.jpg"
					},
					{
						title:"联系我们",
						description:"",
						image:"/static/images/lianxiwo.png"
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			onclick(){
				// uni.navigateTo({
				// 	url: "/pages/payment/payment"
				// })
		}
		}
	}
</script>

<style>
	@import './index.css';

</style>
