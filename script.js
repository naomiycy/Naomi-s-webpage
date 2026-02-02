// script.js - 修正语法错误版
// 定义设计项目的详细信息库
const designProjects = {
    'reddot': {
        title: 'Reddot - 完整的交互设计项目',
        // 使用数组来存储多张详情图片及其描述
        details: [
            {
                imageUrl: './designs/reddot-detail-1.jpg', // 请替换为您的实际图片路径
                caption: '首页与全局导航设计。展示了品牌主色调和信息层级结构。'
            },
            {
                imageUrl: './designs/reddot-detail-2.jpg', // 请替换为您的实际图片路径
                caption: '用户个人中心页面。包含了数据可视化图表和快捷操作入口。'
            },
            {
                imageUrl: './designs/reddot-detail-3.jpg', // 请替换为您的实际图片路径
                caption: '移动端适配视图。展示了在手机上的交互布局与手势操作区域。'
            }
        ]
    }
    // 您可以在这里为其他项目添加类似结构，例如：
    // 'project2': { ... }
};

// 打开模态窗的函数
function openModal(projectKey) {
    const project = designProjects[projectKey];
    if (!project || !project.details) return;

    document.getElementById('modalProjectTitle').textContent = project.title;
    const contentContainer = document.getElementById('modalDetailContent');
    contentContainer.innerHTML = '';

    project.details.forEach(detail => {
        const imgElement = document.createElement('img');
        imgElement.src = detail.imageUrl;
        imgElement.alt = detail.caption.substring(0, 50) + '...';
        imgElement.className = 'detail-image';
        imgElement.loading = 'lazy';

        const captionElement = document.createElement('p');
        captionElement.textContent = detail.caption;
        captionElement.className = 'detail-caption';

        contentContainer.appendChild(imgElement);
        contentContainer.appendChild(captionElement);
    });

    document.getElementById('imageModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态窗的函数
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 点击模态窗的遮罩背景关闭
document.getElementById('imageModal').addEventListener('click', function(event) {
    if (event.target.id === 'imageModal') {
        closeModal();
    }
});

// ============ 动态加载GitHub项目 ============
document.addEventListener('DOMContentLoaded', function() {
    const username = 'naomiycy';
    const projectsContainer = document.getElementById('projects');

    projectsContainer.innerHTML = '<div class="loading">Loading projects from GitHub...</div>';

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load');
            return response.json();
        })
        .then(repos => {
            const originalRepos = repos.filter(repo => !repo.fork);
            if (originalRepos.length === 0) {
                projectsContainer.innerHTML = '<p>No public repositories found.</p>';
                return;
            }
            originalRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            
            let html = '';
            originalRepos.forEach(repo => {
                html += `
                    <div class="project-card">
                        <h3>
                            <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                        </h3>
                        <p>${repo.description || 'No description'}</p>
                        <div class="project-meta">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>Lang: ${repo.language || 'N/A'}</span>
                            <span>Updated: ${new Date(repo.updated_at).toLocaleDateString('en-US')}</span>
                        </div>
                    </div>
                `;
            });
            // 注意：这行必须在循环结束后，一次性设置innerHTML
            projectsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Failed to load GitHub projects:', error);
            projectsContainer.innerHTML = 
                '<div class="error"><p style="color:#d32f2f;">Failed to load projects. Please try again later.</p></div>';
        });
});
