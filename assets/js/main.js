// 菜单开合
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden');
    // toggle 返回的是操作后状态；我们需要设置相反的 aria-expanded
    menuButton.setAttribute('aria-expanded', (!isOpen).toString());
  });
}

// 返回顶部按钮
const backToTop = document.getElementById('backToTop');
const toggleBackToTop = () => {
  if (!backToTop) return;
  if (window.scrollY > 300) {
    backToTop.classList.remove('hidden');
  } else {
    backToTop.classList.add('hidden');
  }
};
window.addEventListener('scroll', toggleBackToTop, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 页脚年份
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// 表单校验（基础前端校验，后端仍需二次校验）
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 姓名
    if (!nameInput.value.trim()) {
      isValid = false;
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = '请填写姓名';
      nameError.classList.remove('hidden');
    } else {
      nameInput.removeAttribute('aria-invalid');
      nameError.textContent = '';
      nameError.classList.add('hidden');
    }

    // 邮箱
    if (!emailPattern.test(emailInput.value)) {
      isValid = false;
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.textContent = '请输入有效的邮箱地址';
      emailError.classList.remove('hidden');
    } else {
      emailInput.removeAttribute('aria-invalid');
      emailError.textContent = '';
      emailError.classList.add('hidden');
    }

    // 留言
    if (!messageInput.value.trim()) {
      isValid = false;
      messageInput.setAttribute('aria-invalid', 'true');
      messageError.textContent = '请填写留言';
      messageError.classList.remove('hidden');
    } else {
      messageInput.removeAttribute('aria-invalid');
      messageError.textContent = '';
      messageError.classList.add('hidden');
    }

    if (isValid) {
      formSuccess.textContent = '提交成功（示例）：请在后端接入真实提交逻辑。';
      formSuccess.classList.remove('hidden');
      contactForm.reset();
    }
  });
}

// 顶部导航背景渐显
(() => {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 12) header.classList.add('nav-backdrop');
    else header.classList.remove('nav-backdrop');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 卡片悬浮视差
(() => {
  const cards = Array.from(document.querySelectorAll('#projects article'));
  cards.forEach(card => {
    card.classList.add('card-tilt');
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const cx = e.clientX - r.left; // cursor x in card
      const cy = e.clientY - r.top;  // cursor y in card
      const rx = ((cy / r.height) - 0.5) * -8; // rotateX
      const ry = ((cx / r.width)  - 0.5) *  8; // rotateY
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
    };
    const reset = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur', reset, true);
  });
})();

// 滚动导航高亮（ScrollSpy）
(() => {
  const links = Array.from(document.querySelectorAll('a[data-nav]'));
  if (!links.length) return;
  const idFromHref = (href) => href && href.startsWith('#') ? href.slice(1) : href.split('#')[1];
  const sectionIds = links.map(a => idFromHref(a.getAttribute('href'))).filter(Boolean);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => {
    links.forEach(a => {
      const match = idFromHref(a.getAttribute('href')) === id;
      a.classList.toggle('text-white', match);
      a.classList.toggle('font-semibold', match);
      a.setAttribute('aria-current', match ? 'page' : 'false');
    });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.5, 1] });
  sections.forEach(sec => io.observe(sec));
})();

// 进入可视区域动效（淡入上移）
(() => {
  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if (!animated.length) return;
  animated.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.animationDelay = `${(animated.indexOf(el) % 6) * 80}ms`;
        el.classList.add('animate-fade-up');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  animated.forEach(el => io.observe(el));
})();

// 主题切换（深/浅）
(() => {
  const toggle = (explicit) => {
    const root = document.documentElement;
    const toDark = explicit ?? !root.classList.contains('dark');
    root.classList.toggle('dark', toDark);
    try { localStorage.setItem('theme', toDark ? 'dark' : 'light'); } catch(_) {}
    const btns = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
    btns.forEach(btn => btn && btn.setAttribute('aria-pressed', String(toDark)));
  };
  const bind = (id) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.addEventListener('click', () => toggle());
  };
  bind('themeToggle');
  bind('themeToggleMobile');
})();

// 自定义圆圈光标跟随鼠标
(() => {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // 平滑跟随动画
  const animate = () => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animate);
  };
  animate();
  
  // 悬浮效果
  const hoverElements = document.querySelectorAll('a, button, [data-animate]');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

