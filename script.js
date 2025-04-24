// Animation on scroll
const photos = document.querySelectorAll('.photo');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

photos.forEach(photo => {
  observer.observe(photo);
});

// จัดการการคลิกเมนู "Photo Trip"
document.querySelectorAll('.sidebar .has-sub > span').forEach(span => {
  span.addEventListener('click', (e) => {
    const submenu = span.nextElementSibling; // เลือก <ul class="submenu">

    // เช็คถ้าเป็นคลิกใน submenu ไม่ให้หยุดการทำงาน
    if (submenu.classList.contains('show') && !submenu.contains(e.target)) {
      submenu.classList.remove('show'); // ปิดเมนู
    } else {
      submenu.classList.toggle('show'); // เปิดหรือปิดเมนู
    }
  });
});

// ป้องกันการหยุดการทำงานของคลิกที่เมนูใน submenu
document.querySelectorAll('.sidebar .submenu li').forEach(menuItem => {
  menuItem.addEventListener('click', (e) => {
    e.stopPropagation();  // ป้องกันไม่ให้คลิกที่เมนูปิด submenu
    const filter = menuItem.dataset.filter;

    const filterButtons = document.querySelectorAll('.sidebar li');
    filterButtons.forEach(btn => btn.classList.remove('active'));

    menuItem.classList.add('active');
    applyFilters();
    localStorage.setItem('lastFilter', filter);
  });
});

// Filter functionality
const filterButtons = document.querySelectorAll('.sidebar li[data-filter]');
const mainTitle = document.getElementById('main-title');

function applyFilters() {
  const activeFilter = document.querySelector('.sidebar li.active').dataset.filter;

  photos.forEach(photo => {
    const matchesFilter = activeFilter === 'all' || photo.dataset.category === activeFilter;
    photo.style.display = matchesFilter ? 'block' : 'none';
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();

    const newTitle = btn.dataset.title || 'My Photo';
    mainTitle.textContent = newTitle;

    localStorage.setItem('lastFilter', btn.dataset.filter);
  });
});

// Set default filter to 'all' on load
window.addEventListener('DOMContentLoaded', () => {
  const defaultBtn = [...filterButtons].find(btn => btn.dataset.filter === 'all');
  if (defaultBtn) {
    defaultBtn.click();
  }
});

/*
// Restore last filter on load
window.addEventListener('DOMContentLoaded', () => {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    const targetBtn = [...filterButtons].find(btn => btn.dataset.filter === lastFilter);
    if (targetBtn) {
      targetBtn.click();
    }
  }
});
*/

// ป้องกันคลิกขวา/ลาก/ดาวน์โหลดภาพ
document.querySelectorAll("img").forEach(img => {
  img.setAttribute("draggable", "false");
  img.addEventListener("contextmenu", e => e.preventDefault());
});

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");

let currentPhotoList = []; // เก็บภาพที่แสดงตามฟิลเตอร์
let currentIndex = 0; // ตำแหน่งของภาพที่เปิดใน modal

// ฟังก์ชันเปิด modal
function openModal(img) {
  // อัปเดตรายชื่อรูปภาพที่แสดงอยู่เท่านั้น
  currentPhotoList = [...document.querySelectorAll('.photo')]
    .filter(p => p.style.display !== 'none')
    .map(p => p.querySelector('img.zoomable'));

  currentIndex = currentPhotoList.indexOf(img);
  modal.style.display = "block";
  modalImg.src = img.src;
  modalImg.setAttribute("draggable", "false");
  captionText.textContent = img.closest('.photo').dataset.caption || "";
}

// ฟังก์ชันปิด modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// เปลี่ยนรูปไปข้างหน้า
document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentPhotoList.length;
  modalImg.src = currentPhotoList[currentIndex].src;
  captionText.textContent = currentPhotoList[currentIndex].closest('.photo').dataset.caption || "";
});

// เปลี่ยนรูปไปข้างหลัง
document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
  modalImg.src = currentPhotoList[currentIndex].src;
  captionText.textContent = currentPhotoList[currentIndex].closest('.photo').dataset.caption || "";
});

// เปิด modal เมื่อคลิกที่รูปภาพ
document.querySelectorAll(".zoomable").forEach(img => {
  img.addEventListener("click", () => {
    openModal(img);
  });
});

// ปิด modal เมื่อคลิกภายนอก
modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarMenu = document.getElementById('sidebar-menu');

  menuToggle.addEventListener('click', function () {
    sidebarMenu.classList.toggle('show');
    menuToggle.classList.toggle('active');

    if (menuToggle.classList.contains('active')) {
      menuToggle.innerHTML = '✖'; // กากบาท
    } else {
      menuToggle.innerHTML = '☰'; // แฮมเบอร์เกอร์
    }
  });
});

document.querySelectorAll('#sidebar-menu li[data-filter]').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebarMenu.classList.remove('show');
      menuToggle.classList.remove('active');
      menuToggle.innerHTML = '☰'; // เปลี่ยนกลับเป็น hamburger
    }
  });
});

document.querySelectorAll('#sidebar-menu li[data-filter]').forEach(item => {
  item.addEventListener('click', () => {
    const menu = document.getElementById('sidebar-menu');
    const toggleBtn = document.getElementById('menu-toggle');

    if (window.innerWidth <= 768) {
      // ซ่อนเมนู
      menu.classList.remove('show');

      // เปลี่ยนไอคอนกลับเป็นแฮมเบอร์เกอร์
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '☰';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sidebar li[data-filter]').forEach(li => {
    if (!li.dataset.title) {
      li.dataset.title = li.textContent.trim();
    }
  });

  // กู้ค่า filter เดิม (จากที่เคยเลือกไว้)
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    const targetBtn = [...document.querySelectorAll('.sidebar li[data-filter]')]
      .find(btn => btn.dataset.filter === lastFilter);
    if (targetBtn) targetBtn.click();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const imageData = JSON.parse(localStorage.getItem('images')) || [];
  const photoContainer = document.getElementById('photo-container');

  // แสดงรูปภาพทั้งหมดจาก localStorage
  imageData.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.src;
    imgElement.alt = image.caption;
    imgElement.dataset.category = image.category;
    photoContainer.appendChild(imgElement);
  });

  const filterItems = document.querySelectorAll('.sidebar li[data-filter]');
  const photoElements = document.querySelectorAll('.photo');

  const countMap = {};
  photoElements.forEach(photo => {
    const category = photo.dataset.category || 'unknown';
    countMap[category] = (countMap[category] || 0) + 1;
  });

  const totalPhotos = photoElements.length;

  filterItems.forEach(item => {
    const filter = item.dataset.filter;
    const originalTitle = item.dataset.title || item.textContent.trim();
    const count = filter === 'all' ? totalPhotos : (countMap[filter] || 0);

    item.innerHTML = `${originalTitle} <span class="count">(${count})</span>`;
  });

  // แสดงฟิลเตอร์จาก localStorage
  const filterList = JSON.parse(localStorage.getItem('filters')) || [];
  const filterListContainer = document.getElementById('filter-list');
  
  filterList.forEach(filter => {
    const filterElement = document.createElement('li');
    filterElement.textContent = filter;
    filterListContainer.appendChild(filterElement);
  });

  // เปลี่ยนธีมตามการตั้งค่าใน localStorage
  const bgColor = localStorage.getItem('bgColor') || '#ffffff';
  const textColor = localStorage.getItem('textColor') || '#000000';
  
  document.documentElement.style.setProperty('--bg-color', bgColor);
  document.documentElement.style.setProperty('--text-color', textColor);
});

// เปลี่ยนธีม
document.getElementById('bg-color').addEventListener('input', (e) => {
  const bgColor = e.target.value;
  localStorage.setItem('bgColor', bgColor);
  document.documentElement.style.setProperty('--bg-color', bgColor);
});

document.getElementById('text-color').addEventListener('input', (e) => {
  const textColor = e.target.value;
  localStorage.setItem('textColor', textColor);
  document.documentElement.style.setProperty('--text-color', textColor);
});
