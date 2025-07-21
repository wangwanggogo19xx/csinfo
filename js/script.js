// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 切换移动端菜单
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;

            // 简单的表单验证
            if (!name || !email || !service) {
                alert('请填写必填项目');
                return;
            }

            // 模拟表单提交
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            // 模拟异步提交
            setTimeout(() => {
                alert('感谢您的咨询！我们会尽快与您联系。');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // 数字动画效果
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-item h3');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
            }, 50);
        });
    }

    // 滚动到关于我们区块时触发数字动画
    const aboutSection = document.querySelector('.about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // 服务卡片悬停效果增强
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 页面加载动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .contact-item, .about-text, .about-image');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // 初始化动画元素
    const initAnimations = () => {
        const elements = document.querySelectorAll('.service-card, .contact-item, .about-text, .about-image');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
        });
    };

    initAnimations();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查

    // 返回顶部按钮
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'back-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
    };

    createBackToTopButton();
});