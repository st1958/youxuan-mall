/* ==========================================================
   优选商城 · 购物车页交互 cart.js
   姓名：叶文昊　学号：20251091070
   只做本页需要的几件事：
   1. 数量加减与手动输入，限制在 1-99
   2. 勾选商品后实时算小计、总额、优惠、应付
   3. 全选框与单选联动
   4. 删除单件、删除选中，购物车空了给提示
   全程原生 JS，不依赖任何库
   ========================================================== */
(function () {
  'use strict';

  var rowsBox = document.getElementById('cartRows');
  var emptyBox = document.getElementById('emptyBox');
  var checkAll = document.getElementById('checkAll');
  var checkAll2 = document.getElementById('checkAll2');
  var delSel = document.getElementById('delSel');
  var payBtn = document.getElementById('payBtn');

  /* ---------- 购物车数据：从本地存储读，读不到就先放几件演示商品 ---------- */
  var YX = window.YX;

  var DEMO = [
    { id: 'p1',  name: '无线降噪蓝牙耳机 半入耳式 运动长续航', spec: '月光米 · 蓝牙 6.0', price: 199, img: '图片素材/p01.jpg', qty: 1 },
    { id: 'p7',  name: '美的空气炸锅 12L 大容量 可视化免翻面', spec: '米白 · 12L · 触控彩屏', price: 329, img: '图片素材/p07.jpg', qty: 1 },
    { id: 'p12', name: 'TCELLARS 彩虹渐变慢跑鞋 半掌碳板', spec: '白粉蓝渐变 · 42 码', price: 179, img: '图片素材/p12.jpg', qty: 1 }
  ];

  // 一行商品的结构，和 cart.html 里原来手写的三行保持一致
  function rowHtml(it) {
    var cls = it.img ? 'thumb t-img' : 'thumb t-blue';
    var pic = it.img
      ? '<img src="' + it.img + '" alt="' + it.name + '">'
      : '<i>' + (it.name || '').slice(0, 4) + '</i>';
    return '' +
      '<article class="row" data-id="' + it.id + '" data-spec="' + it.spec + '" data-price="' + it.price + '">' +
        '<label class="ck row-ck"><input type="checkbox" checked><span class="ck-box" aria-hidden="true"></span></label>' +
        '<div class="goods">' +
          '<a class="' + cls + '" href="detail.html?id=' + it.id + '">' + pic + '</a>' +
          '<div class="goods-bd">' +
            '<h3><a href="detail.html?id=' + it.id + '">' + it.name + '</a></h3>' +
            '<p class="spec">' + it.spec + '</p>' +
            '<p class="tags"><em>满减</em><em>包邮</em></p>' +
          '</div>' +
        '</div>' +
        '<span class="price">¥' + money(it.price) + '</span>' +
        '<div class="qty">' +
          '<button type="button" class="qty-minus" aria-label="减少数量">－</button>' +
          '<input type="text" value="' + it.qty + '" inputmode="numeric" aria-label="商品数量">' +
          '<button type="button" class="qty-plus" aria-label="增加数量">＋</button>' +
        '</div>' +
        '<span class="sub">¥' + money(it.qty * it.price) + '</span>' +
        '<a href="#" class="del">删除</a>' +
      '</article>';
  }

  function renderFromStore() {
    var list = YX ? YX.store.read() : [];
    if (!list.length) {
      list = DEMO;
      if (YX) YX.store.write(list);   // 顺手存一份，后面改数量、删除都基于它
    }
    rowsBox.innerHTML = list.map(rowHtml).join('');
  }

  /* ---------- 金额工具 ---------- */
  // 阶梯优惠：按选中商品的总额决定减多少，取能用的最高一档
  function discountOf(total) {
    if (total >= 999) return 100;
    if (total >= 499) return 50;
    if (total >= 199) return 20;
    return 0;
  }

  function money(n) {
    return n.toFixed(2);
  }

  function rows() {
    return Array.prototype.slice.call(rowsBox.querySelectorAll('.row'));
  }

  function qtyOf(row) {
    var n = parseInt(row.querySelector('.qty input').value, 10);
    return isNaN(n) ? 1 : Math.min(99, Math.max(1, n));
  }

  function priceOf(row) {
    return parseFloat(row.dataset.price) || 0;
  }

  /* ---------- 重算整页 ---------- */
  function refresh() {
    var list = rows();
    var totalGoods = 0;   // 选中商品总额
    var selCount = 0;     // 选中件数
    var allCount = 0;     // 全部件数，用于角标

    list.forEach(function (row) {
      var qty = qtyOf(row);
      var price = priceOf(row);
      var sub = qty * price;
      row.querySelector('.sub').textContent = '¥' + money(sub);

      allCount += qty;

      if (row.querySelector('.row-ck input').checked) {
        totalGoods += sub;
        selCount += qty;
      }
    });

    var off = discountOf(totalGoods);
    var pay = Math.max(0, totalGoods - off);

    document.getElementById('sumGoods').textContent = money(totalGoods);
    document.getElementById('sumOff').textContent = money(off);
    document.getElementById('sumPay').textContent = money(pay);
    document.getElementById('selNum').textContent = selCount;
    document.getElementById('selNumTop').textContent = selCount;
    document.getElementById('payNum').textContent = selCount;
    document.getElementById('totalNum').textContent = allCount;

    // 顶部和导航里的购物车角标跟着走
    document.querySelectorAll('[data-cart-num]').forEach(function (el) {
      el.textContent = allCount;
    });

    // 一件都没选的时候，结算按钮不可点
    payBtn.disabled = selCount === 0;

    // 全选框状态：全选了就打勾，一个没选就取消，选一部分是横线（这里用未勾选表示）
    var checkedCount = list.filter(function (r) {
      return r.querySelector('.row-ck input').checked;
    }).length;
    var isAll = list.length > 0 && checkedCount === list.length;
    checkAll.checked = isAll;
    checkAll2.checked = isAll;

    // 空购物车
    var isEmpty = list.length === 0;
    emptyBox.hidden = !isEmpty;
    rowsBox.style.display = isEmpty ? 'none' : '';
  }

  /* ---------- 数量加减 ---------- */
  function step(row, delta) {
    var input = row.querySelector('.qty input');
    var next = Math.min(99, Math.max(1, qtyOf(row) + delta));
    input.value = next;
    syncStepBtn(row);
    if (YX) YX.store.setQty(row.dataset.id, row.dataset.spec, next);
    refresh();
  }

  // 到 1 或 99 时把按钮置灰，点了没反应
  function syncStepBtn(row) {
    var qty = qtyOf(row);
    row.querySelector('.qty-minus').disabled = qty <= 1;
    row.querySelector('.qty-plus').disabled = qty >= 99;
  }

  /* ---------- 删除 ---------- */
  function removeRow(row) {
    if (YX) YX.store.remove(row.dataset.id, row.dataset.spec);
    row.remove();
    refresh();
  }

  /* ---------- 事件绑定：用事件代理，删了行也不用重新挂 ---------- */
  rowsBox.addEventListener('click', function (e) {
    var row = e.target.closest('.row');
    if (!row) return;

    if (e.target.closest('.qty-plus')) { step(row, 1); return; }
    if (e.target.closest('.qty-minus')) { step(row, -1); return; }
    if (e.target.closest('.del')) { e.preventDefault(); removeRow(row); }
  });

  // 手输数量：失焦或回车时纠正到 1-99
  rowsBox.addEventListener('input', function (e) {
    if (e.target.matches('.qty input')) {
      var row = e.target.closest('.row');
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      refresh();
    }
  });

  rowsBox.addEventListener('blur', function (e) {
    if (e.target.matches('.qty input')) {
      var row = e.target.closest('.row');
      e.target.value = qtyOf(row);
      syncStepBtn(row);
      refresh();
    }
  }, true);

  // 勾选商品
  rowsBox.addEventListener('change', function (e) {
    if (e.target.matches('.row-ck input')) refresh();
  });

  // 全选（两个都监听）
  [checkAll, checkAll2].forEach(function (box) {
    box.addEventListener('change', function () {
      rows().forEach(function (row) {
        row.querySelector('.row-ck input').checked = box.checked;
      });
      refresh();
    });
  });

  // 删除选中
  delSel.addEventListener('click', function (e) {
    e.preventDefault();
    rows().forEach(function (row) {
      if (row.querySelector('.row-ck input').checked) {
        if (YX) YX.store.remove(row.dataset.id, row.dataset.spec);
        row.remove();
      }
    });
    refresh();
  });

  // 结算：课程演示里只做提示，不跳页
  payBtn.addEventListener('click', function () {
    if (payBtn.disabled) return;
    var pay = document.getElementById('sumPay').textContent;
    alert('演示页面：本次应付 ¥' + pay + '，下一步会进入订单确认页。');
  });

  /* ---------- 猜你喜欢：从全站商品里随机抽 4 件，点“换一批”重新抽 ---------- */
  var likeBox = document.getElementById('likeGrid');

  function renderLike() {
    if (!likeBox || !YX || !YX.products) return;
    var pool = YX.products.slice();
    var pick = [];
    while (pick.length < 4 && pool.length) {
      pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    likeBox.innerHTML = pick.map(function (p) {
      var pic = p.img
        ? '<img src="' + p.img + '" alt="' + p.name + '">'
        : '<i>' + p.name.slice(0, 4) + '</i>';
      return '<a class="like-card" href="detail.html?id=' + p.id + '">' +
               '<span class="like-img t-img">' + pic + '</span>' +
               '<p class="like-name">' + p.name + '</p>' +
               '<p class="like-price">¥ ' + money(p.price) + '</p>' +
             '</a>';
    }).join('');
  }

  var moreBtn = document.getElementById('likeMore');
  if (moreBtn) moreBtn.addEventListener('click', renderLike);

  /* ---------- 初始 ---------- */
  renderFromStore();                 // 先把购物车里的商品画出来
  renderLike();
  rows().forEach(syncStepBtn);
  refresh();
})();
