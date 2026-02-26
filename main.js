const malls = [
  {
    name: "무신사 (MUSINSA)",
    url: "https://www.musinsa.com",
    category: "unisex",
    desc: "국내 최대 규모의 패션 플랫폼, 스트릿부터 캐주얼까지.",
    tag: "스트릿/캐주얼",
    color: "#000"
  },
  {
    name: "29CM",
    url: "https://www.29cm.co.kr",
    category: "designer",
    desc: "감도 깊은 취향 셀렉트샵, 디자이너 브랜드 위주.",
    tag: "라이프스타일/디자이너",
    color: "#222"
  },
  {
    name: "지그재그 (ZigZag)",
    url: "https://zigzag.kr",
    category: "women",
    desc: "여성 쇼핑몰 모음 서비스, 개인화 맞춤 추천.",
    tag: "여성 패션",
    color: "#ff3f3f"
  },
  {
    name: "W Concept",
    url: "https://www.wconcept.co.kr",
    category: "designer",
    desc: "프리미엄 디자이너 브랜드 편집샵.",
    tag: "디자이너/여성",
    color: "#000"
  },
  {
    name: "에이블리 (ABLY)",
    url: "https://a-bly.com",
    category: "women",
    desc: "국내 최초 스타일 커머스, 무료 배송 혜택.",
    tag: "여성 패션",
    color: "#ff3f3f"
  },
  {
    name: "브랜디 (BRANDI)",
    url: "https://www.brandi.co.kr",
    category: "women",
    desc: "하루배송이 강점인 여성 쇼핑몰 앱.",
    tag: "여성 패션",
    color: "#000"
  },
  {
    name: "크림 (KREAM)",
    url: "https://kream.co.kr",
    category: "street",
    desc: "한정판 스니커즈 및 패션 거래 플랫폼.",
    tag: "스트릿/스니커즈",
    color: "#222"
  }
];

const mallGrid = document.getElementById('mallGrid');
const searchInput = document.getElementById('searchInput');
const tags = document.querySelectorAll('.tag');

function renderMalls(filter = 'all', searchTerm = '') {
  mallGrid.innerHTML = '';
  
  const filtered = malls.filter(mall => {
    const matchesFilter = filter === 'all' || mall.category === filter;
    const matchesSearch = mall.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mall.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filtered.forEach(mall => {
    const card = document.createElement('a');
    card.className = 'mall-card';
    card.href = mall.url;
    card.target = '_blank';
    
    card.innerHTML = `
      <div class="mall-thumb" style="background-color: ${mall.color}">
        ${mall.name[0]}
      </div>
      <div class="mall-info">
        <span class="category">${mall.tag}</span>
        <h3>${mall.name}</h3>
        <p>${mall.desc}</p>
      </div>
    `;
    mallGrid.appendChild(card);
  });

  if (filtered.length === 0) {
    mallGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">검색 결과가 없습니다.</p>';
  }
}

// 검색 이벤트
searchInput.addEventListener('input', (e) => {
  const activeTag = document.querySelector('.tag.active').dataset.filter;
  renderMalls(activeTag, e.target.value);
});

// 태그 클릭 이벤트
tags.forEach(tag => {
  tag.addEventListener('click', () => {
    tags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    renderMalls(tag.dataset.filter, searchInput.value);
  });
});

// 초기 렌더링
renderMalls();
