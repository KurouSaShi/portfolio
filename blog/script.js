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
