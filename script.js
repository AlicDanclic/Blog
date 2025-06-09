// 全局 overview 对象
const overview = {
  software: [
    { title: "Alic CodeManager", desc: "一个简单的离线密码管理器,可轻松实现文档移植。", dir: [".zip", ".pdf"] },
    { title: "MoreQ", desc: "让一起更加快速。", dir: [".zip", ".pdf"] },
  ],
  hardware: [
    { title: "EternoPax Linker", desc: "模仿Ultralink的一个小linker。", dir: [".zip", ".pdf"] },
    { title: "串口模拟八路舵机", desc: "电赛助力板1,让IO口更宽松。", dir: [".zip", ".pdf"] },
    { title: "天空星扩展板", desc: "基于立创天空星的电赛扩展板,轻松实现硬件连接。", dir: [".zip", ".pdf"] },
  ],
  learning: [
    { title: "PID入门", desc: "还在更新。", dir: [".zip", ".pdf"] },
    { title: "数电模电信号与系统", desc: "大二上的学习笔记。", dir: [] },
    { title: "DataSheet怎么读", desc: "硬件设计必读书目。", dir: [".zip", ".pdf"] },
    { title: "高速PCB", desc: "持续学习中。", dir: [] },
    { title: "电赛集训", desc: "电赛入门书籍。", dir: [ ".pdf"] },
    { title: "通信协议", desc: "从零开始速通UART,IIC,SPI,CAN。", dir: [".zip", ".pdf"] },
    { title: "基于STM32的功能实现", desc: "为电赛助力。", dir: [".zip", ".pdf"] },
    { title: "2025 TI", desc: "更适合大众选手的电赛模拟赛题。", dir: [".md", ".pdf"] },
    { title: "DMA", desc: "简单入门一下DMA", dir: [".md", ".pdf"] },
  ],
  website: [
    { title: "BigVing", desc: "个人自用导航界面。", dir: [".zip", ".pdf"] },
    { title: "个人博客", desc: "这是一个轻易上手的个人博客网页!", dir: [".zip", ".pdf"] },
  ],
};

// 搜索结果列表
let activeSection = 'software';

// 初始化内容
document.addEventListener('DOMContentLoaded', () => {
  // 默认加载软件项目
  loadOverview(activeSection);

  // 为导航链接添加点击事件
  document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      activeSection = link.dataset.section;
      loadOverview(activeSection);
    });
  });

  // 搜索框
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
      return alert('请输入搜索关键词');
    }

    let results = [];
    for (const section in overview) {
      overview[section].forEach(item => {
        if (item.title.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm)) {
          results.push({
            section,
            title: item.title,
            desc: item.desc
          });
        }
      });
    }

    const contentArea = document.getElementById('content');
    contentArea.innerHTML = '';

    if (results.length > 0) {
      const resultContainer = document.createElement('div');
      resultContainer.className = 'content-section';
      resultContainer.innerHTML = `
        <h3>搜索结果 (${results.length} 个)</h3>
      `;
      contentArea.appendChild(resultContainer);

      results.forEach(({ section, title, desc }) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'overview-box';
        resultItem.innerHTML = `
          <h4>${title}</h4>
          <p>${desc}</p>
        `;
        resultItem.addEventListener('click', () => {
          loadHTMLContent(section, title);
        });
        resultContainer.appendChild(resultItem);
      });
    } else {
      contentArea.innerHTML = `
        <div class="error">
          <h3>没有找到相关结果</h3>
          <p>请尝试其他关键词</p>
        </div>
      `;
    }
  });

  // 添加回车键触发搜索
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });
});

// 加载概览块
function loadOverview(section) {
  const container = document.getElementById('content');
  container.innerHTML = '';

  overview[section].forEach(item => {
    const box = document.createElement('div');
    box.className = 'overview-box';
    box.innerHTML = `
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    `;
    box.addEventListener('click', () => {
      // 点击后加载HTML内容
      loadHTMLContent(section, item.title);
    });
    container.appendChild(box);
  });
}

// 加载HTML内容
function loadHTMLContent(section, title) {
  // 构建HTML文件路径
  const encodedTitle = encodeURIComponent(title);
  const contentUrl = `content/${section}/${encodedTitle}.html`;
  
  // 获取右侧内容区域
  const contentArea = document.getElementById('content');

  // 使用fetch加载HTML文件
  fetch(contentUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('文件未找到');
      }
      return response.text();
    })
    .then(data => {
      if (data.trim() === '') {
        throw new Error('内容为空');
      }
      // 直接将HTML内容插入到页面中
      contentArea.innerHTML = data;

      // 获取当前项目的下载文件扩展名
      const currentItem = overview[section].find(item => item.title === title);
      const downloadLinks = currentItem.dir.map(fileExtension => {
        return `
          <a href="download/${section}/${encodedTitle}/${encodedTitle}${fileExtension}" 
             download="${title}${fileExtension}" 
             class="download-btn">
            下载 ${title}${fileExtension}
          </a>
        `;
      }).join("");

      // 将下载链接添加到页面
      if (downloadLinks) {
        contentArea.innerHTML += `
          <div class="downloads">
            ${downloadLinks}
          </div>
        `;
      }
    })
    .catch(error => {
      console.error("加载内容时出错:", error);
      contentArea.innerHTML = `
        <div class="error">
          <h3>内容加载失败</h3>
          <p>文件路径: ${contentUrl}</p>
          <p>错误信息: ${error.message}</p>
          <button id="back-to-overview">返回列表</button>
        </div>
      `;
      
      // 添加事件监听器到返回按钮
      document.getElementById('back-to-overview').addEventListener('click', () => {
        loadOverview(section);
      });
    });
}

// 获取左侧栏和切换按钮
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// 切换左侧栏的显示和隐藏
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  if (sidebar.classList.contains('active')) {
    document.body.style.overflow = 'hidden'; // 防止滚动条闪烁
  } else {
    document.body.style.overflow = 'auto';
  }
});

// 点击左侧栏中的链接后，隐藏左侧栏
document.querySelectorAll('.sidebar .navigation a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
});

// 点击GitHub链接后，隐藏左侧栏
document.querySelector('.sidebar .github-link').addEventListener('click', (event) => {
  event.preventDefault();
  sidebar.classList.remove('active');
  document.body.style.overflow = 'auto';
  window.open(event.target.href, '_blank'); // 在新窗口中打开链接
});

// 点击非左侧栏内容时，隐藏左侧栏
document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && event.target.id !== 'sidebarToggle') {
    sidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});