const fs = require('fs');
const path = require('path');

// ブログのルートディレクトリ
const blogRoot = './';

// HTMLファイルからタイトルを抽出
function extractTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // <h1 class="article-title">タイトル</h1> を探す
        const titleMatch = content.match(/<h1[^>]*class="article-title"[^>]*>(.*?)<\/h1>/);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
        // <title>タイトル</title> をフォールバック
        const pageTitleMatch = content.match(/<title>(.*?)<\/title>/);
        if (pageTitleMatch) {
            return pageTitleMatch[1].replace(' - My Blog', '').trim();
        }
        return path.basename(filePath, '.html');
    } catch (error) {
        return path.basename(filePath, '.html');
    }
}

// ディレクトリをスキャンして記事情報を取得
function scanDirectory() {
    const tags = {};
    
    // ルートディレクトリのサブディレクトリを取得
    const items = fs.readdirSync(blogRoot, { withFileTypes: true });
    
    items.forEach(item => {
        if (item.isDirectory() && !item.name.startsWith('.')) {
            const tagName = item.name;
            const tagPath = path.join(blogRoot, tagName);
            const articles = [];
            
            // タグディレクトリ内のHTMLファイルを取得
            const files = fs.readdirSync(tagPath);
            files.forEach(file => {
                if (file.endsWith('.html') && file !== 'index.html') {
                    const filePath = path.join(tagPath, file);
                    const title = extractTitle(filePath);
                    articles.push({
                        title: title,
                        file: file
                    });
                }
            });
            
            // ファイル名でソート
            articles.sort((a, b) => a.file.localeCompare(b.file));
            
            if (articles.length > 0) {
                tags[tagName] = articles;
            }
        }
    });
    
    return tags;
}

// config.jsを生成
function generateConfig() {
    const tags = scanDirectory();
    
    const configContent = `// ブログの設定
const blogConfig = {
    title: "My Blog",
    tags: ${JSON.stringify(tags, null, 8).replace(/"([^"]+)":/g, '$1:')}
};
`;
    
    fs.writeFileSync(path.join(blogRoot, 'config.js'), configContent, 'utf8');
    console.log('✅ config.js が生成されました！');
    console.log(`📁 ${Object.keys(tags).length} タグ, ${Object.values(tags).reduce((sum, arr) => sum + arr.length, 0)} 記事`);
}

// 実行
generateConfig();
