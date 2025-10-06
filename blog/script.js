// インデックスの開閉
function toggleIndex(element) {
    const ul = element.nextElementSibling;
    const toggle = element.querySelector('.index-toggle');
    
    if (ul.classList.contains('open')) {
        ul.classList.remove('open');
        toggle.textContent = '▶';
    } else {
        ul.classList.add('open');
        toggle.textContent = '▼';
    }
}

// サイドバーの開閉（スマホ用）
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    body.classList.toggle('sidebar-open');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    body.classList.remove('sidebar-open');
}

// 現在のページの階層レベルを取得
function getCurrentDepth() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    if (filename === 'top.html' || path.endsWith('/')) return 0;
    const parts = path.split('/').filter(p => p && p !== 'top.html');
    return parts.length - 1;
}

// 相対パスを生成
function getRelativePath(depth) {
    if (depth === 0) return '';
    return '../'.repeat(depth);
}

// ✅ Twitter共有ウィンドウを開く関数
function shareToTwitter(options = {}) {
    const title = options.text ?? document.title ?? '';
    const url = options.url ?? location.href;
    const tweetText = encodeURIComponent(title);
    const tweetUrl = encodeURIComponent(url);
    const intentUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    const w = 550, h = 420;
    const left = Math.round((screen.width - w) / 2);
    const top = Math.round((screen.height - h) / 2);
    const features = `toolbar=0,status=0,resizable=1,width=${w},height=${h},left=${left},top=${top}`;
    const popup = window.open(intentUrl, 'tweetWindow', features);
    if (!popup) window.location.href = intentUrl;
    else popup.focus();
}

// ✅ サイドバー生成
function generateSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const depth = getCurrentDepth();
    const basePath = getRelativePath(depth);

    let html = `
        <!-- Font Awesome（Xアイコン用）-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

        <!-- 共有ボタン -->
        <div class="share-box" style="margin-bottom: 1em; text-align: center;">
            <button id="share-twitter" style="
                background: #000;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 8px 14px;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: opacity 0.2s;
            ">
                <i class="fa-brands fa-x-twitter"></i> このページをシェア
            </button>
        </div>

        <div class="search-box">
            <h3>検索</h3>
            <input type="search" placeholder="記事を検索..." onkeyup="searchArticles(this.value)">
        </div>

        <div class="index-box">
            <h3>インデックス</h3>
            <ul class="index-list" id="indexList">
    `;

    // タグごとに記事をリスト化
    for (const [tag, articles] of Object.entries(blogConfig.tags)) {
        html += `
            <li>
                <div class="index-category" onclick="toggleIndex(this)">
                    <span class="index-toggle">▶</span>
                    <span>${tag}</span>
                </div>
                <ul>
        `;
        articles.forEach(article => {
            html += `<li><a href="${basePath}${article.file}">${article.title}</a></li>`;
        });
        html += `
                </ul>
            </li>
        `;
    }

    html += `
            </ul>
        </div>
    `;

    sidebar.innerHTML = html;

    // ✅ Twitterボタンに機能を付与
    const shareBtn = document.getElementById('share-twitter');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareToTwitter();
        });
    }
}

// 検索機能
function searchArticles(query) {
    const indexList = document.getElementById('indexList');
    if (!indexList) return;

    const items = indexList.querySelectorAll('li');
    const searchTerm = query.toLowerCase();

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isCategory = item.querySelector('.index-category') !== null;
        
        if (isCategory) {
            const childItems = item.querySelectorAll('ul li');
            let hasMatch = false;
            
            childItems.forEach(child => {
                const childText = child.textContent.toLowerCase();
                if (childText.includes(searchTerm)) {
                    child.style.display = '';
                    hasMatch = true;
                } else {
                    child.style.display = searchTerm ? 'none' : '';
                }
            });
            
            if (text.includes(searchTerm) || hasMatch || !searchTerm) {
                item.style.display = '';
                if (searchTerm && hasMatch) {
                    const ul = item.querySelector('ul');
                    const toggle = item.querySelector('.index-toggle');
                    if (ul && toggle) {
                        ul.classList.add('open');
                        toggle.textContent = '▼';
                    }
                }
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// ページ読み込み時にサイドバーを生成
document.addEventListener('DOMContentLoaded', generateSidebar);
