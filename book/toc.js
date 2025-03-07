// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Summary</a></li><li class="chapter-item expanded affix "><a href="Introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Stage 0: Humanity in 2025</li><li class="chapter-item expanded "><a href="Stage_1/1_1_Current_State_Of_The_World.html"><strong aria-hidden="true">1.</strong> Current State Of The World</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.</strong> Political Climate</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.1.</strong> North America</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.2.</strong> Europe</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.2.1.</strong> Turkey</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.3.</strong> Asia</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.4.</strong> Africa</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.5.</strong> South America</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.1.6.</strong> Oceania</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.2.</strong> Technological Advancements</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.3.</strong> Social Dynamics</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">2.</strong> Current State Of AI</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">3.</strong> Human Sentiment of such a project</div></li><li class="chapter-item expanded affix "><li class="part-title">Stage 1: Passive AI Watchdog</li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.</strong> Passive AI Watchdog Framework</div></li><li class="chapter-item expanded affix "><li class="part-title">Stage 2: AGI &amp; Sentience</li><li class="chapter-item expanded affix "><li class="part-title">Stage 3: ASI &amp; Co‐Transcendence</li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
