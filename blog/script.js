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
    
    // top.htmlはルート扱い
    if (filename === 'top.html' || path.endsWith('/')) {
        return 0;
    }
    
    const parts = path.split('/').filter(p => p && p !== 'top.html');
    return parts.length - 1;
}

// 相対パスを生成
function getRelativePath(depth) {
    if (depth === 0) return '';
    return '../'.repeat(depth);
}

// サイドバーを生成
function generateSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const depth = getCurrentDepth();
    const basePath = getRelativePath(depth);

    let html = `
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
                    <a href="${basePath}${tag}/">${tag}</a>
                </div>
                <ul>
        `;
        
        articles.forEach(article => {
            html += `<li><a href="${basePath}${tag}/${article.file}">${article.title}</a></li>`;
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
