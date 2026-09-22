
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
    


        // Sticky Header Logic
        $(window).on("scroll", function () {
            var scroll = $(window).scrollTop();
            if (scroll < 20) {
                $("#sticky-menu").removeClass("sticky");
            } else {
                $("#sticky-menu").addClass("sticky");
            }
        });


    


        // Visitor Counter Script
        (function () {
            // Make sure we only call once per page load
            if (window.visitorCounterCalled) return;
            window.visitorCounterCalled = true;

            // Call PHP endpoint
            fetch('/counter.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Visitor count:', data.count);
                        // Update the visitor counter display
                        document.getElementById('visit-number').textContent = data.count;
                    }
                })
                .catch(error => {
                    console.error('Counter error:', error);
                    document.getElementById('visit-number').textContent = 'â€”';
                });
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
    
