/* ==========================================================
   优选商城 · 公共脚本 index.js
   姓名：吴渝　学号：20251091098
   本文件做三件事：
   1. 存放全站商品数据（首页、分类页、详情页、购物车共用一份）
   2. 封装购物车的本地存储（localStorage），实现跨页联动
   3. 公共小工具：购物车角标、搜索跳转、轻提示、回到顶部
   全部原生 JS，不引入任何框架与库
   ========================================================== */
(function (global) {
  'use strict';

  /* ---------- 一、商品分类 ---------- */
  var CATS = [
    { id: 'digital', name: '手机数码', desc: '耳机 · 键盘 · 数码配件' },
    { id: 'home',    name: '家用电器', desc: '厨房小电 · 生活电器' },
    { id: 'clothes', name: '服饰鞋包', desc: '运动鞋 · 通勤穿搭' },
    { id: 'food',    name: '食品生鲜', desc: '坚果 · 咖啡 · 零食' }
  ];

  /* ---------- 二、商品数据 ----------
     img 为图片素材文件夹里的文件名，空字符串表示用 CSS 渐变占位
     价格统一用整数，方便计算                                       */
  var PRODUCTS = [
    {
      id: 'p1', name: '无线降噪蓝牙耳机 半入耳式 运动长续航',
      sub: '月光米 · 蓝牙 6.0 · IPX7 防水', cat: 'digital',
      price: 199, old: 299, img: '图片素材/p01.jpg', tag: '爆款', sales: '137万',
      params: ['蓝牙版本：6.0', '佩戴方式：半入耳式', '防水等级：IPX7', '驱动单元：13mm', '续航：约 50 小时（含充电仓）'],
      reviews: [
        { u: '林**', s: 5, t: '连着开黑两小时没掉线，延迟确实低，耳朵也不闷。' },
        { u: '陈**', s: 5, t: '充电仓很轻，放口袋没负担，通勤党够用。' },
        { u: '周**', s: 4, t: '音质在这个价位没得挑，就是白色外壳容易沾指纹。' }
      ]
    },
    {
      id: 'p2', name: '联想真无线降噪耳机 入耳式 高清音频',
      sub: '云岩白 · 入耳式 · LDAC 高清音频', cat: 'digital',
      price: 159, old: 229, img: '图片素材/p02.jpg', tag: '降噪', sales: '45万',
      params: ['蓝牙版本：5.4', '佩戴方式：入耳式', '音频编码：LDAC', '防水等级：IPX4', '充电接口：Type-C'],
      reviews: [
        { u: '赵**', s: 5, t: '地铁里开降噪，报站声还能听见，安全又好用。' },
        { u: '吴**', s: 4, t: '戴久了耳朵有点胀，音质没话说。' }
      ]
    },
    {
      id: 'p3', name: '惠普小方糖半入耳耳机 智能降噪',
      sub: '象牙白 · 半入耳 · 26 小时续航', cat: 'digital',
      price: 129, old: 189, img: '图片素材/p03.jpg', tag: '学生价', sales: '7万',
      params: ['蓝牙版本：6.0', '佩戴方式：半入耳式', '续航：单次 5 小时 / 综合 26 小时', '防水等级：IPX4', '充电接口：Type-C'],
      reviews: [
        { u: '黄**', s: 5, t: '颜值很高，白色壳子配校服也不违和。' },
        { u: '郑**', s: 4, t: '音量偏小一点，听歌够用，打游戏也还成。' }
      ]
    },
    {
      id: 'p4', name: '狼蛛 S3005 机械手感键盘 104 键 彩虹灯效',
      sub: '白色 · 104 键 · 磁轴 · 多媒体键', cat: 'digital',
      price: 189, old: 259, img: '图片素材/p04.jpg', tag: '热卖', sales: '13万',
      params: ['连接方式：USB 有线', '键数：104 键', '轴体：磁轴', '键帽：ABS', '线长：1.5m'],
      reviews: [
        { u: '李**', s: 5, t: '敲代码手感很稳，灯效可以关，宿舍里也不刺眼。' },
        { u: '孙**', s: 4, t: '键帽略滑，用惯了还行，价格真香。' }
      ]
    },
    {
      id: 'p5', name: '狼途 L1 冰蓝背光机械键盘 全键无冲',
      sub: '白色冰蓝 · 全键 · 环绕灯带', cat: 'digital',
      price: 239, old: 329, img: '图片素材/p05.jpg', tag: '颜值', sales: '18万',
      params: ['连接方式：USB 有线', '键数：全键', '背光：环绕 LED 灯带', '键帽：双色注塑', '面板：金属拉丝'],
      reviews: [
        { u: '周**', s: 5, t: '冰蓝灯一开，桌面氛围直接拉满。' },
        { u: '刘**', s: 5, t: '声音偏闷，办公室用不吵同事。' }
      ]
    },
    {
      id: 'p6', name: '机械手感键鼠套装 蓝白配色 USB 即插即用',
      sub: '蓝白 · 104 键 + 鼠标 · 办公游戏通用', cat: 'digital',
      price: 199, old: 289, img: '图片素材/p06.jpg', tag: '套装', sales: '9千',
      params: ['连接方式：USB 有线', '套装内容：键盘 ×1 鼠标 ×1', '键数：104 键', '灯效：七色呼吸灯', '是否防水：正面防水'],
      reviews: [
        { u: '杨**', s: 5, t: '一套配齐省心，蓝白配色比全黑好看很多。' },
        { u: '许**', s: 4, t: '鼠标手感一般，键盘很值。' }
      ]
    },
    {
      id: 'p7', name: '美的空气炸锅 12L 大容量 可视化免翻面',
      sub: '米白 · 12L · 触控彩屏 · 12 大菜单', cat: 'home',
      price: 329, old: 459, img: '图片素材/p07.jpg', tag: '厨房神器', sales: '81万',
      params: ['容量：12L', '控温范围：80-200℃', '定时范围：1-60 分钟', '控制方式：触控彩屏', '特色功能：断电记忆 / 免翻面'],
      reviews: [
        { u: '何**', s: 5, t: '一次能烤两只鸡，宿舍楼里聚餐全靠它。' },
        { u: '吕**', s: 5, t: '可视化窗口很实用，不用反复拉开门看。' },
        { u: '施**', s: 4, t: '体积比想的大，厨房小的要先量尺寸。' }
      ]
    },
    {
      id: 'p8', name: '荣事达空气炸烤箱 双层同烤 可视窗',
      sub: '月光白 · 双层 · 十大智能菜单', cat: 'home',
      price: 399, old: 529, img: '图片素材/p08.jpg', tag: '双层', sales: '4万',
      params: ['容量：10L 以上', '层数：双层', '功率：1350W', '控温范围：80-200℃', '配件：接油盘 ×1'],
      reviews: [
        { u: '张**', s: 5, t: '上下两层一起烤，做蛋挞和鸡翅不用等两轮。' },
        { u: '孔**', s: 4, t: '预热的提示音有点小，其他都好。' }
      ]
    },
    {
      id: 'p9', name: '德尔惠裂空碳板跑鞋 网面透气 竞速训练',
      sub: '粉白渐变 · 39-44 码 · 半掌碳板', cat: 'clothes',
      price: 299, old: 459, img: '图片素材/p09.jpg', tag: '碳板', sales: '2万',
      params: ['鞋面材质：飞织网面', '中底：爆米花中底', '鞋底：碳素橡胶', '适用场景：公路 / 跑道', '闭合方式：系带'],
      reviews: [
        { u: '罗**', s: 5, t: '体测穿着跑 800 米，回弹明显，脚不累。' },
        { u: '高**', s: 4, t: '颜色比图片更亮一点，女生穿也好看。' }
      ]
    },
    {
      id: 'p10', name: '回力透气网面跑步鞋 高弹缓震 防臭',
      sub: '白蓝橙 · 39-44 码 · 网面透气', cat: 'clothes',
      price: 189, old: 279, img: '图片素材/p10.jpg', tag: '国货', sales: '37万',
      params: ['鞋面材质：纺织品', '缓震：高弹缓震', '功能：透气 / 防臭', '鞋帮高度：低帮', '闭合方式：系带'],
      reviews: [
        { u: '任**', s: 5, t: '走了两万步脚不闷，白蓝橙配色很夏天。' },
        { u: '邓**', s: 4, t: '偏大半码，建议按平时运动鞋码买。' }
      ]
    },
    {
      id: 'p11', name: '乔丹清风 3.0 轻量跑步鞋 中考体测适用',
      sub: '浅雾蓝 · 39-44 码 · 网面超轻', cat: 'clothes',
      price: 219, old: 319, img: '图片素材/p11.jpg', tag: '体测', sales: '26万',
      params: ['鞋面材质：织物', '系列：清风 3.0', '功能：减震 / 透气', '适用地面：公路', '闭合方式：系带'],
      reviews: [
        { u: '梁**', s: 5, t: '很轻，跑完一节体育课脚也没什么感觉。' },
        { u: '宋**', s: 5, t: '浅蓝色很干净，配牛仔裤也能穿。' }
      ]
    },
    {
      id: 'p12', name: 'TCELLARS 彩虹渐变慢跑鞋 半掌碳板',
      sub: '白粉蓝渐变 · 39-44 码 · 日常慢跑', cat: 'clothes',
      price: 179, old: 259, img: '图片素材/p12.jpg', tag: '新色', sales: '1万',
      params: ['鞋面材质：密织布', '中底：超临界发泡', '碳板：半掌抗扭', '适用跑距：0-5km', '闭合方式：系带'],
      reviews: [
        { u: '谢**', s: 5, t: '粉蓝渐变太出片了，慢跑五公里很舒服。' },
        { u: '唐**', s: 4, t: '鞋楦偏窄，脚宽的选大一码。' }
      ]
    },
    {
      id: 'p13', name: '荣耀 X80 Pro Max 5G 手机 5500mAh 长续航',
      sub: '闪电红 · 12GB+512GB · 120Hz 直屏', cat: 'digital',
      price: 2599, old: 2999, img: '图片素材/p13-phone.jpg', tag: '长续航', sales: '24万',
      params: ['屏幕：6.8 英寸 120Hz 直屏', '电池：5500mAh 大电池，支持 66W 快充', '充电：90W 有线快充', '后置摄像头：5000 万像素', '网络：5G 双卡双待'],
      reviews: [
        { u: '秦**', s: 5, t: '电池是真能撑，两天一充，出门不带充电宝了。' },
        { u: '尤**', s: 5, t: '直屏手感好，看视频边框很窄。' },
        { u: '许**', s: 4, t: '机身有点重，放口袋里明显，其他都满意。' }
      ]
    },
    {
      id: 'p14', name: '15.6 英寸轻薄笔记本电脑 全金属机身',
      sub: '银灰 · 16GB+512GB · IPS 全高清屏', cat: 'digital',
      price: 2999, old: 3999, img: '图片素材/p14-laptop.jpg', tag: '学生本', sales: '1万',
      params: ['屏幕：15.6 英寸 IPS 1920×1080', '处理器：英特尔 N95', '内存：16GB', '硬盘：512GB 固态', '重量：约 1.6kg'],
      reviews: [
        { u: '施**', s: 5, t: '上网课写作业完全够，开机也快，风扇声音小。' },
        { u: '卫**', s: 4, t: '跑大一点的软件有点吃力，日常办公没问题。' }
      ]
    },
    {
      id: 'p15', name: '美的空气炸锅 7L 大容量 可视窗口',
      sub: '米白 · 7L · 2000W 双热源', cat: 'home',
      price: 299, old: 419, img: '图片素材/p15-fryer.jpg', tag: '高性价比', sales: '11万',
      params: ['容量：7L', '功率：2000W', '控温范围：80-200℃', '定时范围：1-60 分钟', '特色功能：可视窗口 / 双旋钮'],
      reviews: [
        { u: '韩**', s: 5, t: '烤鸡翅不用翻面，皮很脆，清洗也方便。' },
        { u: '杨**', s: 5, t: '旋钮操作比其他触屏的简单，家里老人也会用。' }
      ]
    },
    {
      id: 'p16', name: '李宁赤兔 9 男款竞速跑鞋 轻弹缓震',
      sub: '香槟白 · 39-45 码 · 网面透气', cat: 'clothes',
      price: 399, old: 499, img: '图片素材/p16-sneaker.jpg', tag: '竞速', sales: '10万',
      params: ['鞋面材质：织物网面', '中底：轻弹科技', '适用场景：竞速训练', '适用场地：跑道', '闭合方式：系带'],
      reviews: [
        { u: '罗**', s: 5, t: '五公里配速掉了半分钟，落地很干脆。' },
        { u: '朱**', s: 4, t: '配色干净，鞋楦偏窄，宽脚建议大半码。' }
      ]
    },
    {
      id: 'f1', name: '三只松鼠每日坚果礼盒 30 包混合装',
      sub: '混合果仁 · 30 包 · 独立小袋', cat: 'food',
      price: 99, old: 139, img: '图片素材/p17-nuts.jpg', tag: '囤货', sales: '12万',
      params: ['规格：30 包 / 盒', '配料：腰果 / 巴旦木 / 蔓越莓 / 核桃', '保质期：180 天', '储存方式：阴凉干燥处'],
      reviews: [
        { u: '崔**', s: 5, t: '每天一包刚好，办公室下午茶解决了。' },
        { u: '范**', s: 4, t: '果干偏甜，坚果很新鲜。' }
      ]
    },



  ];

  /* ---------- 三、小工具 ---------- */
  function money(n) {
    return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
  }

  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function byCat(cat) {
    return PRODUCTS.filter(function (p) { return p.cat === cat; });
  }

  function catName(id) {
    for (var i = 0; i < CATS.length; i++) {
      if (CATS[i].id === id) return CATS[i].name;
    }
    return '全部商品';
  }

  /* ---------- 四、购物车本地存储 ----------
     结构：[{ id, name, spec, price, img, qty }]                    */
  var KEY = 'yx_cart_v1';

  var store = {
    read: function () {
      try {
        var raw = localStorage.getItem(KEY);
        var list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list.filter(Boolean) : [];
      } catch (e) {
        return [];
      }
    },
    write: function (list) {
      try {
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch (e) {
        /* 浏览器禁用存储时静默失败，页面照常可用 */
      }
      refreshBadge();
    },
    add: function (item, qty) {
      var list = store.read();
      var n = Math.min(99, Math.max(1, parseInt(qty, 10) || 1));
      var hit = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === item.id && list[i].spec === item.spec) { hit = list[i]; break; }
      }
      if (hit) {
        hit.qty = Math.min(99, hit.qty + n);
      } else {
        list.push({
          id: item.id, name: item.name, spec: item.spec || '默认规格',
          price: Number(item.price) || 0, img: item.img || '', qty: n
        });
      }
      store.write(list);
      return list;
    },
    setQty: function (id, spec, qty) {
      var list = store.read();
      list.forEach(function (it) {
        if (it.id === id && it.spec === spec) it.qty = Math.min(99, Math.max(1, qty));
      });
      store.write(list);
    },
    remove: function (id, spec) {
      store.write(store.read().filter(function (it) {
        return !(it.id === id && it.spec === spec);
      }));
    },
    clear: function () { store.write([]); },
    count: function () {
      return store.read().reduce(function (s, it) { return s + (Number(it.qty) || 0); }, 0);
    }
  };

  /* ---------- 五、购物车角标 ---------- */
  function refreshBadge() {
    var n = store.count();
    var nodes = document.querySelectorAll('[data-cart-num]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = n;
      nodes[i].style.display = n > 0 ? '' : 'none';
    }
  }

  /* ---------- 六、轻提示（加入购物车成功后弹一下） ---------- */
  var toastTimer = null;
  function toast(text) {
    var box = document.getElementById('yxToast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'yxToast';
      box.className = 'yx-toast';
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove('show'); }, 1800);
  }

  /* ---------- 七、搜索框跳转分类页 ---------- */
  function bindSearch() {
    var inputs = document.querySelectorAll('.search');
    Array.prototype.forEach.call(inputs, function (form) {
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (!input || !btn) return;
      function go() {
        var kw = (input.value || '').trim();
        location.href = 'category.html' + (kw ? '?kw=' + encodeURIComponent(kw) : '');
      }
      btn.addEventListener('click', function (e) { e.preventDefault(); go(); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); go(); }
      });
    });
  }

  /* ---------- 八、回到顶部 ---------- */
  function bindTop() {
    var btn = document.getElementById('toTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.pageYOffset > 320);
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 九、页面初始化 ---------- */
  function init() {
    bindSearch();
    bindTop();
    refreshBadge();

    // 已登录时，顶部通栏换成昵称
    try {
      var user = JSON.parse(localStorage.getItem('yx_user') || 'null');
      if (user && user.name) {
        var welcome = document.querySelector('.tb-welcome');
        if (welcome) welcome.textContent = '您好，' + user.name;
      }
    } catch (e) { /* 忽略 */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- 十、对外暴露 ---------- */
  global.YX = {
    cats: CATS,
    products: PRODUCTS,
    byId: byId,
    byCat: byCat,
    catName: catName,
    money: money,
    store: store,
    refreshBadge: refreshBadge,
    toast: toast
  };

})(window);

/* ==========================================================
   首页专属逻辑：商品卡渲染 + 轮播 Banner
   （放在同一个 index.js 里，页面没有对应元素时自动不执行）
   ========================================================== */
(function () {
  'use strict';

  var YX = window.YX;
  if (!YX) return;

  /* ---------- 商品卡模板 ---------- */
  function card(p) {
    var pic = p.img
      ? '<img src="' + p.img + '" alt="' + p.name + '">'
      : '<span class="noimg">' + p.name.slice(0, 2) + '</span>';
    var tag = p.tag ? '<span class="gc-tag">' + p.tag + '</span>' : '';
    return '' +
      '<a class="goods-card" href="detail.html?id=' + p.id + '">' +
        '<span class="gc-img">' + tag + pic + '</span>' +
        '<span class="gc-body">' +
          '<span class="gc-name">' + p.name + '</span>' +
          '<span class="gc-sales">已售 ' + p.sales + ' 件</span>' +
          '<span class="gc-foot">' +
            '<span class="gc-price"><i>¥</i>' + p.price + '</span>' +
            '<span class="gc-old">¥' + p.old + '</span>' +
          '</span>' +
        '</span>' +
      '</a>';
  }

  function fill(id, list) {
    var box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = list.map(card).join('');
  }

  // 分类页与详情页复用同一套卡片模板
  YX.card = card;

  /* ---------- 首页三个区块 ---------- */
  fill('hotGrid', ['p13', 'p1', 'p14', 'p7', 'p16', 'p9', 'p15', 'f1'].map(YX.byId).filter(Boolean));
  fill('digitalGrid', ['p1', 'p13', 'p2', 'p14'].map(YX.byId).filter(Boolean));
  fill('clothGrid', ['p9', 'p16', 'p10', 'p11'].map(YX.byId).filter(Boolean));
  fill('lifeGrid', ['p7', 'p15', 'p8', 'f1'].map(YX.byId).filter(Boolean));

  /* ---------- 轮播 ---------- */
  var banner = document.querySelector('.banner');
  if (!banner) return;

  var slides = banner.querySelectorAll('.slide');
  var dots = banner.querySelectorAll('.bn-dots button');
  var cur = 0;
  var timer = null;

  function show(i) {
    cur = (i + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      slides[k].classList.toggle('active', k === cur);
    }
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('on', d === cur);
    }
  }

  function play() {
    stop();
    timer = setInterval(function () { show(cur + 1); }, 5200);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  banner.querySelector('.bn-prev').addEventListener('click', function (e) {
    e.preventDefault();
    show(cur - 1);
    play();
  });

  banner.querySelector('.bn-next').addEventListener('click', function (e) {
    e.preventDefault();
    show(cur + 1);
    play();
  });

  Array.prototype.forEach.call(dots, function (dot, i) {
    dot.addEventListener('click', function () { show(i); play(); });
  });

  banner.addEventListener('mouseenter', stop);
  banner.addEventListener('mouseleave', play);

  // 手机上滑动切换
  var startX = 0;
  banner.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  banner.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      show(dx < 0 ? cur + 1 : cur - 1);
      play();
    }
  }, { passive: true });

  play();
})();
