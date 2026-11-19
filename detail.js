/* ==========================================================
   优选商城 · 商品详情页交互 detail.js
   姓名：蓝姹姹　学号：20251091083
   1. 按地址栏 id 取商品，填满整页（图片、价格、参数、评价）
   2. 规格切换、数量加减
   3. 加入购物车写进 localStorage，头部角标立刻变
   4. 立即购买：加购后直接跳购物车
   ========================================================== */
(function () {
  'use strict';

  var YX = window.YX;
  if (!YX) return;

  /* ---------- 取商品 ---------- */
  function param(name) {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  var id = param('id') || 'p1';
  var goods = YX.byId(id) || YX.products[0];
  if (!goods) return;

  var spec = '标准版';
  var qty = 1;

  /* ---------- 填内容 ---------- */
  var mainImg = document.getElementById('mainImg');
  if (goods.img) {
    mainImg.src = goods.img;
    mainImg.alt = goods.name;
  } else {
    mainImg.parentNode.innerHTML = '<span class="noimg">' + goods.name.slice(0, 2) + '</span>';
  }

  document.getElementById('goodsName').textContent = goods.name;
  document.getElementById('goodsSub').textContent = goods.sub;
  document.getElementById('priceNow').textContent = goods.price;
  document.getElementById('priceOld').textContent = '¥' + goods.old;
  document.getElementById('priceOff').textContent = '省 ' + (goods.old - goods.price) + ' 元';
  document.getElementById('crumbCat').textContent = YX.catName(goods.cat);
  document.getElementById('crumbCat').href = 'category.html?cat=' + goods.cat;
  document.getElementById('crumbName').textContent = goods.name;
  document.getElementById('moreLink').href = 'category.html?cat=' + goods.cat;
  document.title = goods.name + ' - 优选商城';

  /* ---------- 参数表 ---------- */
  var table = document.getElementById('paramTable');
  table.innerHTML = goods.params.map(function (line) {
    var arr = line.split('：');
    return '<tr><th>' + (arr[0] || '参数') + '</th><td>' + (arr[1] || line) + '</td></tr>';
  }).join('');

  /* ---------- 评价 ---------- */
  var reviewBox = document.getElementById('reviewList');
  reviewBox.innerHTML = goods.reviews.map(function (r) {
    var star = '';
    for (var i = 0; i < 5; i++) star += i < r.s ? '★' : '☆';
    return '<div class="review-item">' +
      '<span class="review-user">' + r.u + '</span>' +
      '<span class="review-star">' + star + '</span>' +
      '<p class="review-text">' + r.t + '</p>' +
      '</div>';
  }).join('');

  /* ---------- 同类推荐 ---------- */
  var like = YX.byCat(goods.cat).filter(function (p) { return p.id !== goods.id; }).slice(0, 4);
  document.getElementById('likeGrid').innerHTML = like.map(YX.card).join('');

  /* ---------- 规格切换 ---------- */
  var specList = document.getElementById('specList');
  specList.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-spec]');
    if (!btn) return;
    spec = btn.dataset.spec;
    Array.prototype.forEach.call(specList.querySelectorAll('button'), function (b) {
      b.classList.toggle('on', b === btn);
    });
  });

  /* ---------- 数量加减 ---------- */
  var input = document.getElementById('qtyInput');
  var minusBtn = document.getElementById('minusBtn');
  var plusBtn = document.getElementById('plusBtn');

  function setQty(n) {
    qty = Math.min(99, Math.max(1, n));
    input.value = qty;
    minusBtn.disabled = qty <= 1;
    plusBtn.disabled = qty >= 99;
  }

  minusBtn.addEventListener('click', function () { setQty(qty - 1); });
  plusBtn.addEventListener('click', function () { setQty(qty + 1); });
  input.addEventListener('input', function () {
    input.value = input.value.replace(/[^\d]/g, '');
  });
  input.addEventListener('blur', function () {
    setQty(parseInt(input.value, 10) || 1);
  });

  /* ---------- 加入购物车 ---------- */
  function addToCart() {
    YX.store.add({
      id: goods.id,
      name: goods.name,
      spec: spec,
      price: goods.price,
      img: goods.img
    }, qty);
    YX.toast('已加入购物车 · ' + spec + ' × ' + qty);
  }

  document.getElementById('addBtn').addEventListener('click', addToCart);

  document.getElementById('buyBtn').addEventListener('click', function () {
    YX.store.add({
      id: goods.id, name: goods.name, spec: spec, price: goods.price, img: goods.img
    }, qty);
    location.href = 'cart.html';
  });

  /* ---------- 选项卡 ---------- */
  var tabs = document.getElementById('tabs');
  var panelParam = document.getElementById('panelParam');
  var panelReview = document.getElementById('panelReview');

  tabs.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
      b.classList.toggle('on', b === btn);
    });
    var isParam = btn.dataset.tab === 'param';
    panelParam.hidden = !isParam;
    panelReview.hidden = isParam;
  });

  /* ---------- 初始化 ---------- */
  setQty(1);
})();
