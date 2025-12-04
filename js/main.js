document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('nav ul');

    // Mobile Menu
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileBtn.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileBtn.textContent = '☰';
                }
            }
        });
    });

    // Language Handling
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.getElementById('current-lang');

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('guguk_lang', lang);

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Update button text
        if (currentLangSpan) {
            currentLangSpan.textContent = lang === 'en' ? 'English' : 'العربية';
        }

        // Update active state in dropdown
        langOptions.forEach(opt => {
            if (opt.dataset.lang === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Initialize Language
    const savedLang = localStorage.getItem('guguk_lang') || 'en';
    if (!document.body.classList.contains('no-translate')) {
        setLanguage(savedLang);
    }

    // Dropdown Interaction
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        // Handle option selection
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.dataset.lang;
                setLanguage(selectedLang);
                langDropdown.classList.remove('show');
            });
        });
    }
    // Scroll Indicator Logic
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const sections = ['home', 'features', 'footer'];

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = sectionId;
                }
            }
        });

        // Special case for bottom of page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = 'footer';
        }

        scrollDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${current}`) {
                dot.classList.add('active');
            }
        });
    });
});

