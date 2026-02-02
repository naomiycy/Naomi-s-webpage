// script.js
// 定义设计项目的详细信息库
const designProjects = {
    'reddot': {
        fullImage: './designs/reddot-full.jpg',
        title: 'Reddot 项目完整设计',
        description: '这是 Reddot 项目的高清完整设计图，展示了所有界面的细节与交互流程。'
    }
    // 添加更多项目格式示例：
    // 'project2': {
    //     fullImage: './designs/project2-full.jpg',
    //     title: '项目二完整设计',
    //     description: '项目二的详细描述...'
    // }
};

// 打开模态窗的函数
function openModal(projectKey) {
    const project = designProjects[projectKey];
    if (project) {
        document.getElementById('fullSizeImage').src = project.fullImage;
        document.getElementById('imageCaption').textContent = project.description;
        document.getElementById('imageModal').style.display = 'flex';
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

// 关闭模态窗的函数
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 点击模态窗的黑色遮罩背景也可以关闭
document.getElementById('imageModal').addEventListener('click', function(event) {
    if (event.target.id === 'imageModal') {
        closeModal();
    }
});

// 动态加载GitHub项目
document.addEventListener('DOMContentLoaded', function() {
    const username = 'naomiycy';
    const projectsContainer = document.getElementById('projects');
    
    // 显示加载状态
    projectsContainer.innerHTML = '<div class="loading">正在从 GitHub 加载项目数据...</div>';
    
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
        .then(response => {
            if (!response.ok) throw new Error('加载失败');
            return response.json();
        })
        .then(repos => {
            // 过滤掉 Fork 的仓库
            const originalRepos = repos.filter(repo => !repo.fork);
            
            if (originalRepos.length === 0) {
                projectsContainer.innerHTML = '<p>暂无公开项目。</p>';
                return;
            }

            // 按星标数排序
            originalRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            
            let html = '';
            originalRepos.forEach(repo => {
                const updateTime = new Date(repo.updated_at).toLocaleDateString('zh-CN');
                html += `
                    <div class="project-card">
                        <h3>
                            <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                        </h3>
                        <p>${repo.description || '暂无描述'}</p>
                        <div class="project-meta">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>语言: ${repo.language || '未指定'}</span>
                            <span>更新: ${updateTime}</span>
                        </div>
                    </div>
                `;
            });
            projectsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('加载GitHub项目失败:', error);
            projectsContainer.innerHTML = 
                '<div class="error"><p style="color:#d32f2f;">项目加载失败，请稍后重试。</p></div>';
        });
});
