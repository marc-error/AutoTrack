import './style.css'

const sidebar = document.getElementById('sidebar')
const toggleBtn = document.getElementById('sidebar-toggle')
const mobileToggle = document.getElementById('mobile-toggle')
const overlay = document.getElementById('sidebar-overlay')
const navItems = document.querySelectorAll('.nav-item')
const pageTitle = document.getElementById('page-title')
const pageContainer = document.getElementById('page-container')

const STORAGE_KEY = 'autoparts_sidebar'
const THEME_KEY = 'autotrack_theme'

const pageCache = {}

const titles = {
  home: 'Home',
  search: 'Search',
  browse: 'Browse',
  inventory: 'Inventory',
  vehicle: 'Vehicle',
  billing: 'Billing',
  reports: 'Reports',
  notification: 'Notification',
  members: 'Members',
  history: 'History',
  account: 'Account',
}

/* ───── Sidebar Collapse ───── */
function setCollapsed(collapsed) {
  sidebar.classList.toggle('collapsed', collapsed)
  toggleBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar'
  localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
}

function loadCollapsedState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === '1') {
    setCollapsed(true)
  }
}

toggleBtn.addEventListener('click', () => {
  const isCollapsed = sidebar.classList.contains('collapsed')
  setCollapsed(!isCollapsed)
})

/* ───── Mobile Toggle ───── */
function openMobile() {
  sidebar.classList.add('open')
  overlay.classList.add('show')
}

function closeMobile() {
  sidebar.classList.remove('open')
  overlay.classList.remove('show')
}

mobileToggle.addEventListener('click', openMobile)
overlay.addEventListener('click', closeMobile)

/* ───── Navigation / Hash Routing ───── */
let isTransitioning = false

async function navigateTo(pageId) {
  const target = pageId || 'home'

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.page === target)
  })

  pageTitle.textContent = titles[target] || 'Home'

  if (!pageCache[target]) {
    try {
      const res = await fetch(`/src/pages/${target}.html`)
      if (!res.ok) throw new Error(`Page not found: ${target}`)
      pageCache[target] = await res.text()
    } catch (err) {
      pageCache[target] = `<div class="page-placeholder"><i class="fas fa-exclamation-triangle"></i><h2>Page Not Found</h2><p>${err.message}</p></div>`
    }
  }

  if (isTransitioning) return
  isTransitioning = true

  pageContainer.style.opacity = '0'
  pageContainer.style.transform = 'translateY(8px)'

  setTimeout(() => {
    pageContainer.innerHTML = pageCache[target]
    requestAnimationFrame(() => {
      pageContainer.style.opacity = '1'
      pageContainer.style.transform = 'translateY(0)'
      isTransitioning = false
    })
  }, 150)

  if (window.innerWidth <= 768) {
    closeMobile()
  }
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault()
    const page = item.dataset.page
    window.location.hash = page
  })
})

function onHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home'
  navigateTo(hash)
}

window.addEventListener('hashchange', onHashChange)

/* ───── Init ───── */
if (!window.location.hash) {
  window.location.hash = 'home'
} else {
  onHashChange()
}
loadCollapsedState()

/* ───── Theme Toggle ───── */
const themeToggle = document.getElementById('theme-toggle')
const themeLabel = themeToggle ? themeToggle.querySelector('.theme-toggle-label') : null

function updateThemeLabel(theme) {
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode'
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
  updateThemeLabel(theme)
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  setTheme(current === 'dark' ? 'light' : 'dark')
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) {
    setTheme(saved)
  } else {
    setTheme('dark')
  }
}

themeToggle.addEventListener('click', toggleTheme)
loadTheme()
