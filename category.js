/* ==========================================================
   优选商城 · 商品分类页交互 category.js
   姓名：李修赫　学号：20251091059
   1. 读地址栏参数（分类 cat、关键词 kw），进来就是筛好的状态
   2. 左侧分类、价格区间、快捷标签三级筛选
   3. 四种排序：综合、销量、价格升、价格降
   4. 顶部导航按当前分类高亮
   ========================================================== */
(function () {
  'use strict';

  var YX = window.YX;
  if (!YX) return;

  /* ---------- 页面参数 ---------- */
  function param(name) {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  var state = {
    cat: param('cat') || 'all',
    kw: param('kw') || '',
    min: 0,
    max: 99999,
    tag: '',
    sort: 'default'
  };

  /* ---------- 销量字符串转数字，用来排序 ---------- */
  function salesNum(s) {
    var v = String(s || '');
    if (v.indexOf('万') > -1) return parseFloat(v) * 10000;
    if (v.indexOf('千') > -1) return parseFloat(v) * 1000;
    return parseFloat(v) || 0;
  }

  /* ---------- 左侧分类列表 ---------- */
  var catList = document.getElementById('catList');
  var priceList = document.getElementById('priceList');
  var catGrid = document.getElementById('catGrid');
  var catEmpty = document.getElementById('catEmpty');
  var catTitle = document.getElementById('catTitle');
  var crumbCat = document.getElementById('crumbCat');
  var totalCount = document.getElementById('totalCount');
  var sortTip = document.getElementById('sortTip');

  function renderCats() {
    var html = '<li><a href="#" data-cat="all">全部商品</a></li>';
    YX.cats.forEach(function (c) {
      html += '<li><a href="#" data-cat="' + c.id + '">' + c.name + '</a></li>';
    });
    catList.innerHTML = html;
    syncCatOn();
  }

  function syncCatOn() {
    Array.prototype.forEach.call(catList.querySelectorAll('a'), function (a) {
      a.classList.toggle('on', a.dataset.cat === state.cat);
    });
    // 顶部导航同步高亮
    Array.prototype.forEach.call(document.querySelectorAll('.catnav-in a'), function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('on', state.cat !== 'all' && href.indexOf('cat=' + state.cat) > -1);
    });
  }

  /* ---------- 筛选与排序 ---------- */
  function filtered() {
    var list = YX.products.slice();

    if (state.cat !== 'all') {
      list = list.filter(function (p) { return p.cat === state.cat; });
    }

    if (state.kw) {
      var kw = state.kw.toLowerCase();
      list = list.filter(function (p) {
        return (p.name + p.sub + YX.catName(p.cat)).toLowerCase().indexOf(kw) > -1;
      });
    }

    list = list.filter(function (p) {
      return p.price >= state.min && p.price <= state.max;
    });

    if (state.tag === '包邮') {
      // 全站满 99 包邮，这里按价格做演示
      list = list.filter(function (p) { return p.price >= 99; });
    } else if (state.tag) {
      list = list.filter(function (p) { return p.tag === state.tag; });
    }

    if (state.sort === 'sales') {
      list.sort(function (a, b) { return salesNum(b.sales) - salesNum(a.sales); });
    } else if (state.sort === 'price-asc') {
      list.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sort === 'price-desc') {
      list.sort(function (a, b) { return b.price - a.price; });
    }

    return list;
  }

  function render() {
    var list = filtered();

    catTitle.textContent = state.kw ? '搜索“' + state.kw + '”' : YX.catName(state.cat);
    crumbCat.textContent = state.kw ? '搜索结果' : YX.catName(state.cat);
    totalCount.textContent = list.length;
    sortTip.textContent = list.length ? '正在展示 ' + list.length + ' 件商品' : '';

    catGrid.innerHTML = list.map(YX.card).join('');
    catGrid.style.display = list.length ? '' : 'none';
    catEmpty.hidden = list.length > 0;
  }

  /* ---------- 事件：分类 ---------- */
  catList.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-cat]');
    if (!a) return;
    e.preventDefault();
    state.cat = a.dataset.cat;
    state.kw = '';
    syncCatOn();
    render();
  });

  /* ---------- 事件：价格区间 ---------- */
  priceList.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-min]');
    if (!a) return;
    e.preventDefault();
    state.min = Number(a.dataset.min);
    state.max = Number(a.dataset.max);
    Array.prototype.forEach.call(priceList.querySelectorAll('a'), function (el) {
      el.classList.toggle('on', el === a);
    });
    render();
  });

  /* ---------- 事件：快捷标签 ---------- */
  var tagBox = document.querySelector('.filter-tags');
  if (tagBox) {
    tagBox.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-tag]');
      if (!a) return;
      e.preventDefault();
      var same = a.classList.contains('on');
      Array.prototype.forEach.call(tagBox.querySelectorAll('a'), function (el) {
        el.classList.remove('on');
      });
      state.tag = same ? '' : a.dataset.tag;
      if (!same) a.classList.add('on');
      render();
    });
  }

  /* ---------- 事件：排序 ---------- */
  var sortBox = document.querySelector('.sort-tabs');
  sortBox.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-sort]');
    if (!btn) return;
    state.sort = btn.dataset.sort;
    Array.prototype.forEach.call(sortBox.querySelectorAll('button'), function (b) {
      b.classList.toggle('on', b === btn);
    });
    render();
  });

  /* ---------- 初始 ---------- */
  renderCats();
  render();
})();
