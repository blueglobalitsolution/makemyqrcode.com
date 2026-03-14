
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
            fetch('counter.php')
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
        const menuMain = menu.querySelector(".site-menu-main");
        const submenuAll = menu.querySelectorAll(".sub-menu");
        const goBack = menu.querySelector(".go-back");
        const menuTrigger = document.querySelector(".mobile-menu-trigger");
        const closeMenu = menu.querySelector(".mobile-menu-close");
        let subMenu;
        let subMenuArray = [];
        let subMenuTextArray = [];

        function last(array) {
            return array[array.length - 1];
        }
        function last2(array) {
            return array[array.length - 2];
        }

        menuMain.addEventListener("click", (e) => {
            if (!menu.classList.contains("active")) {
                return;
            }
            if (e.target.closest(".nav-item-has-children")) {
                const hasChildren = e.target.closest(".nav-item-has-children");
                showSubMenu(hasChildren);
            }
        });

        if (goBack) {
            goBack.addEventListener("click", () => {
                const lastItem = last(subMenuArray);
                const lastItemText = last2(subMenuTextArray);
                subMenuArray.pop();
                subMenuTextArray.pop();
                if (subMenuArray.length >= 0) {
                    document.getElementById(lastItem).style.animation = "slideRight 0.5s ease forwards";
                    menu.querySelector(".current-menu-title").innerHTML = lastItemText;
                    setTimeout(() => {
                        document.getElementById(lastItem).classList.remove("active");
                    }, 300);
                }
                if (subMenuArray.length == 0) {
                    menu.querySelector(".mobile-menu-head").classList.remove("active");
                }
            });
        }

        if (menuTrigger) {
            menuTrigger.addEventListener("click", () => {
                toggleMenu();
            });
        }

        if (closeMenu) {
            closeMenu.addEventListener("click", () => {
                toggleMenu();
            });
        }

        const menuOverlay = document.querySelector(".menu-overlay");
        if (menuOverlay) {
            menuOverlay.addEventListener("click", () => {
                toggleMenu();
            });
        }

        function toggleMenu() {
            menu.classList.toggle("active");
            document.querySelector(".menu-overlay").classList.toggle("active");
        }

        function showSubMenu(hasChildren) {
            for (let i = 0; submenuAll.length < i; i++) {
                submenuAll[i].classList.remove("active");
            }
            subMenu = hasChildren.querySelector(".sub-menu");
            subMenuArray.push(subMenu.id);
            subMenu.classList.add("active");
            subMenu.style.animation = "slideLeft 0.5s ease forwards";
            const menuTitle = hasChildren.querySelector(".drop-trigger").textContent;
            subMenuTextArray.push(menuTitle);
            menu.querySelector(".current-menu-title").innerHTML = menuTitle;
            menu.querySelector(".mobile-menu-head").classList.add("active");
        }

        window.onresize = function () {
            if (this.innerWidth > 991) {
                if (menu.classList.contains("active")) {
                    toggleMenu();
                }
            }
        };
    
