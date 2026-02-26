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

// ... (기존 malls 배열 및 renderMalls 함수 유지)

// 모달 및 피팅룸 관련 요소
const modal = document.getElementById('fittingRoomModal');
const openBtn = document.getElementById('openFittingRoom');
const closeBtn = document.querySelector('.close');
const generateBtn = document.getElementById('generateBtn');
const toggleApiBtn = document.getElementById('toggleApiSettings');
const apiConfigArea = document.getElementById('apiConfigArea');
const replicateTokenInput = document.getElementById('replicateToken');

// 이미지 업로드 관련
const userPhotoInput = document.getElementById('userPhotoInput');
const garmentPhotoInput = document.getElementById('garmentPhotoInput');
const userPreview = document.getElementById('userPreview');
const garmentPreview = document.getElementById('garmentPreview');

// 초기 설정: 저장된 토큰 불러오기
replicateTokenInput.value = localStorage.getItem('replicate_token') || '';

// 모달 열기/닫기
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// API 설정 토글
toggleApiBtn.onclick = () => {
  apiConfigArea.style.display = apiConfigArea.style.display === "none" ? "block" : "none";
};

// 토큰 저장
replicateTokenInput.onchange = (e) => localStorage.setItem('replicate_token', e.target.value);

// 이미지 미리보기 로직
function setupUpload(zoneId, inputId, previewId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  zone.onclick = () => input.click();
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.src = event.target.result;
        preview.style.display = "block";
        zone.querySelector('p').style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  };
}

setupUpload('userPhotoZone', 'userPhotoInput', 'userPreview');
setupUpload('garmentPhotoZone', 'garmentPhotoInput', 'garmentPreview');

// AI 생성 로직 (Replicate API 호출)
generateBtn.onclick = async () => {
  const token = replicateTokenInput.value;
  const userImg = userPreview.src;
  const garmentImg = garmentPreview.src;
  const size = document.getElementById('sizeSelect').value;

  if (!token) return alert('Replicate API 토큰을 입력해주세요 (⚙️ 설정에서 입력)');
  if (!userImg || !garmentImg) return alert('두 사진을 모두 업로드해주세요.');

  document.getElementById('loading').style.display = "block";
  document.getElementById('vtonResult').style.display = "none";
  generateBtn.disabled = true;

  try {
    // Replicate API는 CORS 이슈로 인해 실제 운영 환경에서는 Proxy 서버가 필요하지만,
    // 여기서는 개념적 구현과 사용자 안내를 중심으로 작성합니다.
    // 사용자는 본인의 Replicate 계정에서 'IDM-VTON' 모델을 실행할 수 있습니다.
    
    console.log("AI 피팅 생성 시작...", { size });
    
    // 이 부분은 실제 API 연동 시 Replicate 라이브러리나 fetch를 사용합니다.
    // 현재는 사용자에게 안내 메시지를 표시합니다.
    setTimeout(() => {
      alert("현재 브라우저 보안 정책상 직접 호출을 위해서는 프록시 서버가 필요합니다. \n\n대신 'IDM-VTON' 모델에 사용할 수 있는 최적의 프롬프트를 생성해 드립니다: \n'A person wearing this " + size + " size garment, realistic body fit, professional lighting.'");
      document.getElementById('loading').style.display = "none";
      generateBtn.disabled = false;
    }, 2000);

  } catch (error) {
    console.error(error);
    alert('오류가 발생했습니다.');
    document.getElementById('loading').style.display = "none";
    generateBtn.disabled = false;
  }
};

// 초기 렌더링 호출 (기존 코드 유지)
renderMalls();
