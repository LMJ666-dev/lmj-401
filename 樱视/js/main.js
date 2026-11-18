/* ============================================================
 * 项目：Bilibili 模仿网站 - 高级网页设计 I 期末作业
 * 姓名：梁铭巨    学号：24002120401
 * 文件：js/main.js
 * 说明：全站共享脚本。包含以下 JS 效果（>=6 个）：
 *   1) 导航栏滚动阴影
 *   2) Banner 自动轮播 + 圆点切换
 *   3) 回到顶部按钮
 *   4) fetch 加载 mock 数据并渲染视频卡片
 *   5) 栏目 Tab 切换
 *   6) 视频页弹幕滚动
 *   7) 点赞 / 投币 / 收藏交互计数
 *   8) 后台表格行删除
 *   9) 搜索框回车跳转搜索页
 * 变量 / 函数命名以 liang 开头。
 * ============================================================ */

/* ---------- 基路径：根据当前页面位置自动决定 ---------- */
const LIANG_BASE = location.pathname.includes("/pages/") ? "../" : "./";

/* ---------- 工具：fetch JSON（file:// 下自动用 window.liangData 兜底） ---------- */
async function liangFetchJSON(url) {
  try {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    return await resp.json();
  } catch (err) {
    console.warn("[liangFetchJSON] fetch 失败，使用本地兜底数据:", url, err);
    // 从 URL 里提取文件名（去掉路径和 .json），到 window.liangData._files 里找
    try {
      const m = url.match(/([^\/]+)\.json/);
      if (m && window.liangData && window.liangData._files && window.liangData._files[m[1]]) {
        return window.liangData._files[m[1]];
      }
    } catch (e) {}
    return null;
  }
}

/* ---------- 效果 1：导航栏滚动阴影 ---------- */
function liangInitNav() {
  const nav = document.querySelector(".liang-nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = "0 2px 12px rgba(0,0,0,.08)";
    } else {
      nav.style.boxShadow = "0 1px 0 var(--liang-line)";
    }
  });
}

/* ---------- 效果 9：搜索框回车跳转 ---------- */
function liangInitSearch() {
  const box = document.querySelector(".liang-nav__search");
  if (!box) return;
  const input = box.querySelector("input");
  box.querySelector("button").addEventListener("click", () => liangDoSearch(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") liangDoSearch(input.value);
  });
}
function liangDoSearch(kw) {
  kw = (kw || "").trim();
  if (!kw) return;
  const url = "search.html?kw=" + encodeURIComponent(kw);
  location.href = url;
}

/* ---------- 效果 3：回到顶部 ---------- */
function liangInitBackTop() {
  let btn = document.querySelector(".liang-backtop");
  if (!btn) {
    btn = document.createElement("div");
    btn.className = "liang-backtop";
    btn.innerHTML = "▲";
    document.body.appendChild(btn);
  }
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 效果 2：Banner 轮播 ---------- */
async function liangInitBanner() {
  const box = document.querySelector(".liang-banner");
  if (!box) return;
  const data = await liangFetchJSON(LIANG_BASE + "data/banner.json");
  if (!data || !data.list) return;
  box.innerHTML = "";
  const dots = document.createElement("div");
  dots.className = "liang-banner__dots";
  data.list.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "liang-banner__slide" + (i === 0 ? " active" : "");
    slide.style.background = item.color;
    slide.textContent = item.title;
    box.appendChild(slide);
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => liangBannerGo(box, dots, i));
    dots.appendChild(dot);
  });
  box.appendChild(dots);
  box._idx = 0;
  box._timer = setInterval(() => {
    const next = (box._idx + 1) % data.list.length;
    liangBannerGo(box, dots, next);
  }, 3500);
}
function liangBannerGo(box, dots, idx) {
  box._idx = idx;
  box.querySelectorAll(".liang-banner__slide").forEach((s, i) => {
    s.classList.toggle("active", i === idx);
  });
  dots.querySelectorAll("span").forEach((d, i) => {
    d.classList.toggle("active", i === idx);
  });
}

/* ---------- 效果 4：渲染视频卡片（fetch mock） ---------- */
async function liangRenderVideos(containerSelector, jsonUrl) {
  const box = document.querySelector(containerSelector);
  if (!box) return;
  const data = await liangFetchJSON(jsonUrl);
  if (!data || !data.list) return;
  box.innerHTML = "";
  data.list.forEach((v) => {
    const card = document.createElement("div");
    card.className = "liang-card";
    card.innerHTML = `
      <div class="liang-card__cover">
        <img src="${LIANG_BASE}images/cover_${v.cover}.svg" alt="${v.title}">
        <div class="liang-card__meta">
          <span>▶ ${v.play}</span>
          <span>💬 ${v.comment}</span>
        </div>
      </div>
      <div class="liang-card__body">
        <div class="liang-card__title">${v.title}</div>
        <div class="liang-card__up">@${v.up}</div>
      </div>`;
    card.addEventListener("click", () => {
      location.href = LIANG_BASE + "pages/video.html?id=" + v.id;
    });
    box.appendChild(card);
  });
}

/* ---------- 效果 5：Tab 切换 ---------- */
function liangInitTabs() {
  const tabs = document.querySelector(".liang-tabs");
  if (!tabs) return;
  tabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      tabs.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.cat;
      await liangRenderVideos("#liang-channel-grid", LIANG_BASE + "data/channel_" + cat + ".json");
    });
  });
}

/* ---------- 效果 6：弹幕 ---------- */
async function liangInitDanmaku() {
  const layer = document.querySelector(".liang-danmaku-layer");
  if (!layer) return;
  const data = await liangFetchJSON(LIANG_BASE + "data/danmaku.json");
  if (!data || !data.list) return;
  let i = 0;
  setInterval(() => {
    const text = data.list[i % data.list.length];
    i++;
    const d = document.createElement("div");
    d.className = "liang-danmaku-item";
    d.textContent = text;
    d.style.top = Math.floor(Math.random() * 80) + "%";
    d.style.animationDuration = (8 + Math.random() * 6) + "s";
    layer.appendChild(d);
    setTimeout(() => d.remove(), 14000);
  }, 1200);
}

/* ---------- 效果 7：点赞 / 投币 / 收藏 ---------- */
function liangInitLikeBar() {
  document.querySelectorAll("[data-like]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const span = btn.querySelector("span");
      let n = parseInt(span.dataset.n || span.textContent, 10);
      if (btn.dataset.done) {
        n--;
        btn.dataset.done = "";
        btn.style.color = "";
      } else {
        n++;
        btn.dataset.done = "1";
        btn.style.color = "#FB7299";
      }
      span.dataset.n = n;
      span.textContent = n;
    });
  });
}

/* ---------- 效果 8：后台表格删除行 ---------- */
function liangInitAdminTable() {
  const table = document.querySelector(".liang-table");
  if (!table) return;
  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("del")) {
      const tr = e.target.closest("tr");
      if (tr) tr.remove();
    }
  });
}

/* ---------- 入口 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  liangInitNav();
  liangInitBackTop();
  liangInitSearch();
  liangInitBanner();
  liangInitTabs();
  liangInitDanmaku();
  liangInitLikeBar();
  liangInitAdminTable();

  // 首页 / 栏目页 / 搜索页 / 排行页各自渲染
  if (document.querySelector("#liang-home-grid")) {
    liangRenderVideos("#liang-home-grid", LIANG_BASE + "data/home.json");
  }
  if (document.querySelector("#liang-channel-grid") && !window.__channelLoaded) {
    window.__channelLoaded = true;
    liangRenderVideos("#liang-channel-grid", LIANG_BASE + "data/channel_anime.json");
  }
  if (document.querySelector("#liang-rank-list")) {
    liangRenderRank();
  }
  if (document.querySelector("#liang-search-result")) {
    liangRenderSearch();
  }
});

/* ---------- 排行榜渲染 ---------- */
async function liangRenderRank() {
  const box = document.querySelector("#liang-rank-list");
  const data = await liangFetchJSON(LIANG_BASE + "data/rank.json");
  if (!data) return;
  box.innerHTML = "";
  data.list.forEach((v, i) => {
    const row = document.createElement("div");
    row.className = "liang-rank-item";
    row.innerHTML = `
      <div class="liang-rank-num">${i + 1}</div>
      <img src="${LIANG_BASE}images/cover_${v.cover}.svg" style="width:120px;border-radius:6px">
      <div>
        <div style="font-weight:600">${v.title}</div>
        <div style="color:#9499A0;font-size:12px;margin-top:4px">▶ ${v.play}　💬 ${v.comment}　@${v.up}</div>
      </div>`;
    box.appendChild(row);
  });
}

/* ---------- 搜索结果渲染 ---------- */
async function liangRenderSearch() {
  const box = document.querySelector("#liang-search-result");
  const kw = new URLSearchParams(location.search).get("kw") || "";
  const head = document.querySelector("#liang-search-kw");
  if (head) head.textContent = kw;
  const data = await liangFetchJSON(LIANG_BASE + "data/search.json");
  if (!data) return;
  const list = data.list.filter((v) => !kw || v.title.includes(kw) || v.up.includes(kw));
  box.innerHTML = "";
  list.forEach((v) => {
    const card = document.createElement("div");
    card.className = "liang-card";
    card.innerHTML = `
      <div class="liang-card__cover">
        <img src="${LIANG_BASE}images/cover_${v.cover}.svg" alt="">
        <div class="liang-card__meta"><span>▶ ${v.play}</span><span>💬 ${v.comment}</span></div>
      </div>
      <div class="liang-card__body">
        <div class="liang-card__title">${v.title}</div>
        <div class="liang-card__up">@${v.up}</div>
      </div>`;
    box.appendChild(card);
  });
  if (!list.length) box.innerHTML = "<p style='color:#9499A0'>没有找到相关结果</p>";
}
