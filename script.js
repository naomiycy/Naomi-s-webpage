// script.js - 结构修正版
// 设计项目详情数据
const designProjects = {
    'project1': {
        title: 'Naomi\'s Portfolio',
        details: [
            { imageUrl: './images/portfolio1/P1-1.png', caption: 'Design detail 1.' },
            { imageUrl: './images/portfolio1/P1-2.png', caption: 'Design detail 2.' },
            { imageUrl: './images/portfolio1/P1-3.png', caption: 'Design detail 3.' },
            { imageUrl: './images/portfolio1/P1-4.png', caption: 'Design detail 4.' }
        ]
    },
    'project2': {
        title: 'Naomi\'s Portfolio',
        details: [
            { imageUrl: './images/portfolio2/p2-1.png', caption: 'Design detail 1.' },
            { imageUrl: './images/portfolio2/p2-2.png', caption: 'Design detail 2.' },
            { imageUrl: './images/portfolio2/p2-3.png', caption: 'Design detail 3.' },
            { imageUrl: './images/portfolio2/p2-4.png', caption: 'Design detail 4.' },
            { imageUrl: './images/portfolio2/p2-5.png', caption: 'Design detail 5.' }
        ]
    },
    'project3': {
        title: 'Naomi\'s Portfolio',
        details: [
            { imageUrl: './images/portfolio3/P3-1.jpg', caption: 'Design detail 1.' },
            { imageUrl: './images/portfolio3/P3-2.jpg', caption: 'Design detail 2.' },
            { imageUrl: './images/portfolio3/P3-3.jpg', caption: 'Design detail 3.' },
            { imageUrl: './images/portfolio3/P3-4.jpg', caption: 'Design detail 4.' },
            { imageUrl: './images/portfolio3/P3-5.jpg', caption: 'Design detail 5.' },
            { imageUrl: './images/portfolio3/P3-6.jpg', caption: 'Design detail 6.' },
            { imageUrl: './images/portfolio3/P3-7.jpg', caption: 'Design detail 7.' }
        ]
    },
    'project4': {
        title: 'Naomi\'s Portfolio',
        details: [
            { imageUrl: './images/portfolio4/P4-1.png', caption: 'Design detail 1.' },
            { imageUrl: './images/portfolio4/P4-2.png', caption: 'Design detail 2.' },
            { imageUrl: './images/portfolio4/P4-3.png', caption: 'Design detail 3.' },
            { imageUrl: './images/portfolio4/P4-4.png', caption: 'Design detail 4.' },
            { imageUrl: './images/portfolio4/P4-5.png', caption: 'Design detail 5.' }
        ]
    },
    'project5': {
        title: 'Naomi\'s Portfolio',
        details: [
            { imageUrl: './images/portfolio5/P5-1.png', caption: 'Design detail 1.' },
            { imageUrl: './images/portfolio5/P5-2.png', caption: 'Design detail 2.' },
            { imageUrl: './images/portfolio5/P5-3.png', caption: 'Design detail 3.' }
        ]
    }
};

// 打开详情模态窗
function openModal(projectKey) {
    const project = designProjects[projectKey];
    if (!project || !project.details) { console.warn('Project data not found:', projectKey); return; }

    document.getElementById('modalProjectTitle').textContent = project.title;
    const contentContainer = document.getElementById('modalDetailContent');
    contentContainer.innerHTML = '';

    project.details.forEach(detail => {
        const img = document.createElement('img');
        img.src = detail.imageUrl;
        img.alt = detail.caption;
        img.className = 'detail-image';
        contentContainer.appendChild(img);

        const caption = document.createElement('p');
        caption.textContent = detail.caption;
        caption.className = 'detail-caption';
        contentContainer.appendChild(caption);
    });

    document.getElementById('imageModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态窗
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 点击模态窗的遮罩背景关闭
document.getElementById('imageModal').addEventListener('click', function(event) {
    const isClickInsideContent = event.target.closest('.modal-detail-container');
    if (!isClickInsideContent) {
        closeModal();
    }
});

// ============ 全局键盘事件监听：按ESC键关闭模态窗 ============
// 【重要】这段代码在全局作用域，独立于下面的DOMContentLoaded事件
document.addEventListener('keydown', function(event) {
    if (document.getElementById('imageModal').style.display === 'block' && event.key === 'Escape') {
        closeModal();
    }
});

// ============ 动态加载GitHub项目（在页面加载完成后执行）============
document.addEventListener('DOMContentLoaded', function() {
    const username = 'naomiycy';
    const container = document.getElementById('projects');
    container.innerHTML = '<div class="loading">Loading projects...</div>';

    fetch(`https://api.github.com/users/${username}/repos?per_page=20`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
        .then(r => r.ok ? r.json() : Promise.reject('Network error'))
        .then(repos => {
            const filtered = repos.filter(repo => !repo.fork);
            if (filtered.length === 0) { container.innerHTML = '<p>No public repos.</p>'; return; }
            filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
            
            let html = '';
            filtered.forEach(repo => {
                html += `<div class="project-card">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || 'No description'}</p>
                    <div class="project-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>Lang: ${repo.language || 'N/A'}</span>
                        <span>Updated: ${new Date(repo.updated_at).toLocaleDateString('en-US')}</span>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
        })
        .catch(err => {
            console.error('Fetch error:', err);
            container.innerHTML = '<p class="error">Failed to load projects.</p>';
        });
}); // DOMContentLoaded 事件监听器正确结束
