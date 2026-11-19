/* ==========================================================
   优选商城 · 登录注册页脚本 login.js
   姓名：陈伊静　学号：20251091078
   做的事：登录 / 注册两个表单来回切、密码显示、输入校验，
          提交成功后把用户信息存到本地，回到首页
   购物车角标、轻提示这些小工具直接用 index.js 里的 YX
   ========================================================== */
(function () {
  'use strict';

  var YX = window.YX;
  var USER_KEY = 'yx_user';      // 登录状态，和首页共用同一个键
  var PHONE_KEY = 'yx_phone';     // 记住了手机号，下次自动填

  /* ---------- 取元素 ---------- */
  var tabLogin = document.getElementById('tabLogin');
  var tabReg = document.getElementById('tabReg');
  var loginForm = document.getElementById('loginForm');
  var regForm = document.getElementById('regForm');

  if (!tabLogin || !loginForm || !regForm) return;

  /* ---------- 一、登录 / 注册切换 ---------- */
  var isLogin = true;

  function switchTab(toLogin) {
    isLogin = toLogin;
    tabLogin.classList.toggle('on', toLogin);
    tabReg.classList.toggle('on', !toLogin);
    tabLogin.setAttribute('aria-selected', toLogin);
    tabReg.setAttribute('aria-selected', !toLogin);
    loginForm.classList.toggle('hide', !toLogin);
    regForm.classList.toggle('hide', toLogin);
    // 切过去的时候把光标放到第一个输入框，少点一次
    var first = toLogin ? document.getElementById('loginPhone') : document.getElementById('regName');
    if (first) first.focus();
  }

  tabLogin.addEventListener('click', function () { switchTab(true); });
  tabReg.addEventListener('click', function () { switchTab(false); });

  // 表单里那两行“免费注册 / 直接登录”的文字链接
  var toReg = document.querySelector('[data-to-reg]');
  var toLogin = document.querySelector('[data-to-login]');
  if (toReg) toReg.addEventListener('click', function (e) { e.preventDefault(); switchTab(false); });
  if (toLogin) toLogin.addEventListener('click', function (e) { e.preventDefault(); switchTab(true); });

  /* ---------- 二、密码显示 / 隐藏 ---------- */
  var eyes = document.querySelectorAll('[data-eye]');
  Array.prototype.forEach.call(eyes, function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-eye'));
      if (!input) return;
      var shown = input.type === 'text';
      input.type = shown ? 'password' : 'text';
      btn.textContent = shown ? '显示' : '隐藏';
    });
  });

  /* ---------- 三、格式校验 ---------- */
  function isPhone(v) {
    return /^1[3-9]\d{9}$/.test(v);
  }

  function tip(text) {
    if (YX && YX.toast) YX.toast(text);
    else alert(text);
  }

  /* ---------- 四、登录提交 ---------- */
  var remember = document.getElementById('remember');
  var loginPhone = document.getElementById('loginPhone');

  // 上次勾了“记住手机号”，这次进来就直接填好
  try {
    var saved = localStorage.getItem(PHONE_KEY);
    if (saved && loginPhone) loginPhone.value = saved;
  } catch (e) { /* 存储不可用时忽略 */ }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var phone = loginPhone.value.trim();
    var pwd = document.getElementById('loginPwd').value.trim();

    if (!isPhone(phone)) { tip('请输入正确的 11 位手机号'); loginPhone.focus(); return; }
    if (pwd.length < 6) { tip('密码至少 6 位'); return; }

    // 这门课没有后台，登录状态就记在浏览器里
    var user = { name: '用户' + phone.slice(-4), phone: phone, at: Date.now() };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (remember && remember.checked) localStorage.setItem(PHONE_KEY, phone);
      else localStorage.removeItem(PHONE_KEY);
    } catch (err) { /* 浏览器禁用存储时照常跳转 */ }

    tip('登录成功，正在返回首页…');
    setTimeout(function () { location.href = 'index.html'; }, 900);
  });

  /* ---------- 五、注册提交 ---------- */
  regForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('regName').value.trim();
    var phone = document.getElementById('regPhone').value.trim();
    var pwd = document.getElementById('regPwd').value.trim();
    var pwd2 = document.getElementById('regPwd2').value.trim();

    if (name.length < 2 || name.length > 12) { tip('昵称请填 2-12 个字'); return; }
    if (!isPhone(phone)) { tip('请输入正确的 11 位手机号'); return; }
    if (pwd.length < 6) { tip('密码至少 6 位'); return; }
    if (pwd !== pwd2) { tip('两次输入的密码不一致'); return; }

    var user = { name: name, phone: phone, at: Date.now() };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(PHONE_KEY, phone);
    } catch (err) { /* 忽略 */ }

    tip('注册成功，欢迎 ' + name);
    setTimeout(function () { location.href = 'index.html'; }, 900);
  });

  /* ---------- 六、已经登录过就提示一下 ---------- */
  try {
    var old = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (old && old.name) {
      var tipLine = document.querySelector('.form-tip');
      if (tipLine) tipLine.innerHTML = '当前已登录：<b>' + old.name + '</b>　<a href="#" id="doLogout">退出</a>';
      var out = document.getElementById('doLogout');
      if (out) {
        out.addEventListener('click', function (e) {
          e.preventDefault();
          localStorage.removeItem(USER_KEY);
          tip('已退出登录');
          setTimeout(function () { location.reload(); }, 600);
        });
      }
    }
  } catch (e) { /* 忽略 */ }

})();
