const malls = [
  {
    name: "무신사 (MUSINSA)",
    url: "https://www.musinsa.com",
    category: "unisex",
    desc: "국내 최대 규모의 패션 플랫폼, 스트릿부터 캐주얼까지.",
    tag: "스트릿/캐주얼",
    color: "#000",
    sampleGarment: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" // 샘플 코트 이미지
  },
  {
    name: "29CM",
    url: "https://www.29cm.co.kr",
    category: "designer",
    desc: "감도 깊은 취향 셀렉트샵, 디자이너 브랜드 위주.",
    tag: "라이프스타일/디자이너",
    color: "#222",
    sampleGarment: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" // 샘플 티셔츠 이미지
  },
  {
    name: "지그재그 (ZigZag)",
    url: "https://zigzag.kr",
    category: "women",
    desc: "여성 쇼핑몰 모음 서비스, 개인화 맞춤 추천.",
    tag: "여성 패션",
    color: "#ff3f3f",
    sampleGarment: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500" // 샘플 원피스 이미지
  }
  // ... 추가 쇼핑몰들
];

const mallGrid = document.getElementById('mallGrid');
const searchInput = document.getElementById('searchInput');
const creditDisplay = document.getElementById('creditDisplay');

// 크레딧 시스템 초기화
let credits = parseInt(localStorage.getItem('seyu_credits')) || 3;
function updateCredits(amount) {
  credits += amount;
  localStorage.setItem('seyu_credits', credits);
  creditDisplay.innerText = `✨ 오늘 남은 무료 피팅: ${credits}회`;
}
updateCredits(0); // 초기 표시

function renderMalls(filter = 'all', searchTerm = '') {
  mallGrid.innerHTML = '';
  const filtered = malls.filter(mall => {
    const matchesFilter = filter === 'all' || mall.category === filter;
    const matchesSearch = mall.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filtered.forEach(mall => {
    const card = document.createElement('div');
    card.className = 'mall-card';
    card.innerHTML = `
      <button class="try-on-overlay" onclick="directTryOn('${mall.sampleGarment}')">✨ 바로 피팅</button>
      <a href="${mall.url}" target="_blank" style="text-decoration:none; color:inherit;">
        <div class="mall-thumb" style="background-image: url('${mall.sampleGarment}'); background-size: cover;">
          <div style="background: rgba(0,0,0,0.3); width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#fff;">
            ${mall.name[0]}
          </div>
        </div>
        <div class="mall-info">
          <span class="category">${mall.tag}</span>
          <h3>${mall.name}</h3>
          <p>${mall.desc}</p>
        </div>
      </a>
    `;
    mallGrid.appendChild(card);
  });
}

// 직접 피팅 연동 로직
window.directTryOn = (garmentUrl) => {
  const modal = document.getElementById('fittingRoomModal');
  const garmentPreview = document.getElementById('garmentPreview');
  const placeholder = document.getElementById('garmentPlaceholder');
  
  garmentPreview.src = garmentUrl;
  garmentPreview.style.display = "block";
  if(placeholder) placeholder.style.display = "none";
  
  modal.style.display = "block";
};

// 모달 제어
const modal = document.getElementById('fittingRoomModal');
const closeBtn = document.querySelector('.close');
closeBtn.onclick = () => modal.style.display = "none";

// API 설정 토글
document.getElementById('toggleApiSettings').onclick = () => {
  const area = document.getElementById('apiConfigArea');
  area.style.display = area.style.display === "none" ? "block" : "none";
};

// 생성 로직 고도화
document.getElementById('generateBtn').onclick = async () => {
  if (credits <= 0) {
    alert("오늘의 무료 크레딧을 모두 사용하셨습니다. 내일 다시 시도하거나 프리미엄 플랜을 이용해주세요!");
    return;
  }

  const userImg = document.getElementById('userPreview').src;
  const garmentImg = document.getElementById('garmentPreview').src;
  
  if (!userImg || userImg.includes('none')) return alert('본인의 사진을 먼저 업로드해주세요.');
  
  document.getElementById('resultSection').style.display = "block";
  document.getElementById('loading').style.display = "block";
  document.getElementById('vtonResult').style.display = "none";

  // AI 생성 시뮬레이션 및 크레딧 차감
  setTimeout(() => {
    updateCredits(-1);
    document.getElementById('loading').style.display = "none";
    const resultImg = document.getElementById('vtonResult');
    resultImg.src = garmentImg; // 데모용으로 옷 이미지를 결과로 표시 (실제는 AI 생성값)
    resultImg.style.display = "inline-block";
    alert("피팅이 완료되었습니다! (1 크레딧 차감)");
  }, 2000);
};

// 공유 기능
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.onclick = () => {
    const type = btn.classList[1];
    if (type === 'link') {
      navigator.clipboard.writeText(window.location.href);
      alert('공유 링크가 복사되었습니다!');
    } else {
      alert(`${type} 공유 기능은 현재 준비 중입니다. (SaaS 정식 버전에서 제공 예정)`);
    }
  };
});

// 업로드 설정
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
        const p = zone.querySelector('p');
        if(p) p.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  };
}
setupUpload('userPhotoZone', 'userPhotoInput', 'userPreview');
setupUpload('garmentPhotoZone', 'garmentPhotoInput', 'garmentPreview');

renderMalls();
