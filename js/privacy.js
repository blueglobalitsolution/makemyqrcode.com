
        document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.footer-big-text-container');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const letters = container.querySelectorAll('.footer-large-title');
                    if (entry.isIntersecting) {
                        letters.forEach((letter, index) => {
                            setTimeout(() => {
                                letter.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s';
                                letter.style.transform = 'translate3d(0, 0%, 0)';
                                letter.style.opacity = '1';
                            }, index * 50);
                        });
                    } else {
                        letters.forEach((letter) => {
                            letter.style.transition = 'transform 0.8s, opacity 0.5s';
                            letter.style.transform = 'translate3d(0, 110%, 0)';
                            letter.style.opacity = '0';
                        });
                    }
                });
            }, { threshold: 0.1 });

            if (container) {
                observer.observe(container);
            }
        });
    


        // Sticky Header Logic (vanilla JS - no jQuery dependency)
        (function () {
            var header = document.getElementById('sticky-menu');
            if (!header) return;
            var ticking = false;
            window.addEventListener('scroll', function () {
                if (ticking) return;
                ticking = true;
                window.requestAnimationFrame(function () {
                    if (window.pageYOffset < 20) {
                        header.classList.remove('sticky');
                    } else {
                        header.classList.add('sticky');
                    }
                    ticking = false;
                });
            }, { passive: true });
        })();


    


        // Visitor Tracking (invisible — data collected for admin dashboard)
        (function () {
            if (window.visitorCounterCalled) return;
            window.visitorCounterCalled = true;

            fetch('https://app.makemyqrcode.com/api/visits/track/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({page: window.location.pathname})
            }).catch(function () {});
        })();
    


        const menu = document.querySelector(".menu-block");
        const menuTrigger = document.getElementById("mobile-menu-trigger") || document.querySelector(".mobile-menu-trigger");
        const closeMenu = menu ? menu.querySelector(".mobile-menu-close") : null;
        const menuOverlay = document.querySelector(".menu-overlay");

        function openDrawer() {
            if (menu) menu.classList.add("active");
            if (menuOverlay) menuOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeDrawer() {
            if (menu) menu.classList.remove("active");
            if (menuOverlay) menuOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }

        function toggleMenu() {
            if (menu && menu.classList.contains("active")) {
                closeDrawer();
            } else {
                openDrawer();
            }
        }

        if (menuTrigger) {
            menuTrigger.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            });
        }

        if (closeMenu) {
            closeMenu.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeDrawer();
            });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener("click", function (e) {
                e.preventDefault();
                closeDrawer();
            });
        }

        // Close drawer when any nav link is tapped on mobile
        if (menu) {
            const navLinks = menu.querySelectorAll(".site-menu-main a");
            navLinks.forEach(function (link) {
                link.addEventListener("click", function () {
                    closeDrawer();
                });
            });
        }

        window.addEventListener("resize", function () {
            if (window.innerWidth > 991 && menu && menu.classList.contains("active")) {
                closeDrawer();
            }
        });
    
