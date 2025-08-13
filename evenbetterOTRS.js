// Better OTRS Change View
// @version 0.1.3
// Enhanced OTRS interface with improved workorder visualization, toggle button, and two-column layout, dynamic and readable Site Tile
// created by Mirko modifed by me


(function () {
    // Inline CSS styles
    const styles = `
        .boWorkorderButton {
            cursor: pointer;
            padding: 8px;
            margin: 4px 0;
            border-radius: 6px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .boWorkorderButton:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .bOTRS {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
        }
        .bOTRS.two-columns {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        .bOTRS.two-columns .boWorkorderButton {
            margin: 0;
            width: auto;
        }
        .bograyled {
            background:rgba(158, 158, 158, 0.7);
            border-left: 4px solid #9e9e9e;
        }
        .boredled {
            background:rgba(255, 51, 51, 0.7);
            border-left: 4px solid #ff3333;
        }
        .bogreenled {
            background:rgba(80, 200, 120, 0.7);
            border-left: 4px solid #50C878;
        }
        .boyellowled {
            background:rgba(254, 208, 2, 0.7);
            border-left: 4px solid #fecf02;
        }
        .boState {
            font-weight: 600;
            font-size: 13px;
            margin: 0;
            color: #374151;
        }
        .boTitle {
            font-size: 14px;
            margin: 4px 0 0 0;
            color: #6b7280;
        }
        .boToggleButton {
            display: block;
            padding: 4px 8px;
            color: #000;
            font-size: 11px;
            line-height: 14px;
            margin: 0;
            background: #eee;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .boToggleButton:hover {
            background: #e0e0e0;
            border-color: #999;
        }
        .boToggleButton.active {
            background: #f0fff4;
            border-color: #50C878;
            color: #065f46;
        }
    `;

    // Inject CSS into the page
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Main functionality
    try {
        const elements = {
            workorderGraphBox: document.querySelector(".WorkorderGraphBox"),
            workorderGraph: document.querySelector(".WorkorderGraph"),
            workorderGraphScale: document.querySelector(".LinesScaleBox"),
            workorderLabels: document.querySelectorAll(".WorkorderLabel"),
            workorders: document.querySelectorAll(".Workorder")
        };

        // Error handling if critical elements are missing
        if (!elements.workorderGraphBox) {
            console.warn("WorkorderGraphBox nicht gefunden!");
            return;
        }

        // Create enhanced view container
        const createWorkorderElements = () => {
            const enhancedViewContainer = document.createElement("div");
            enhancedViewContainer.classList.add("bOTRS");
            enhancedViewContainer.style.display = "none";
            elements.workorderGraphBox.parentNode.insertBefore(enhancedViewContainer, elements.workorderGraphBox.nextSibling);

            // Determine number of columns based on screen width and number of workorders
            const screenWidth = window.innerWidth;
            const totalItems = elements.workorderLabels.length;
            const needsTwoColumns = totalItems >= 8 || screenWidth > 1200;
            if (needsTwoColumns) {
                enhancedViewContainer.classList.add("two-columns");
            }

            // Create workorder buttons
            elements.workorderLabels.forEach((label, index) => {
                const titleAttr = label
                    .getAttribute("title")
                    ?.replace("Title: ", "")
                    .replace("Type: ", "")
                    .split(" | ") || ["Unknown", "Workorder"];
                const [title, type] = titleAttr;
                const state = label.querySelector("span");
                const link = label.querySelector("a")?.getAttribute("href") || "#";
                const agent = elements.workorders[index]?.querySelectorAll("p")[3]?.innerText || "-";

                // Map OTRS state classes to custom classes with your colors
                const stateClass = state?.getAttribute("class") || "";
                const classMap = {
                    greenled: "bogreenled",
                    yellowled: "boyellowled",
                    redled: "boredled",
                    grayled: "bograyled"
                };
                const customClass = classMap[stateClass] || "bograyled";

                const workorderElement = document.createElement("div");
                workorderElement.classList.add("boWorkorderButton", customClass);

                // Add workorder content
                workorderElement.insertAdjacentHTML(
                    "beforeend",
                    `<p class="boState">${index + 1}. ${state?.innerText.toUpperCase() || "UNKNOWN"}: ${agent}</p>`
                );
                workorderElement.insertAdjacentHTML(
                    "beforeend",
                    `<p class="boTitle">${type}: ${title}</p>`
                );

                workorderElement.addEventListener("click", () => {
                    window.location.href = link;
                });

                enhancedViewContainer.appendChild(workorderElement);
            });

            elements.enhancedView = enhancedViewContainer;
        };

        // Toggle between standard and enhanced view
        const toggleView = (showOriginal) => {
            elements.workorderGraphBox.style.display = showOriginal ? "block" : "none";
            elements.enhancedView.style.display = showOriginal ? "none" : (elements.enhancedView.classList.contains("two-columns") ? "grid" : "flex");
        };

        // Setup toggle button
        const setupToggleButton = () => {
            const actionsList = document.querySelector(".ActionRow .Actions");
            if (!actionsList) {
                console.warn("Actions-Liste nicht gefunden!");
                return;
            }

            const isActive = localStorage.getItem("activateBetterOTRS") === "true";
            actionsList.insertAdjacentHTML(
                "beforeend",
                `<li>
                    <button id="ActivateBetterOTRS" class="boToggleButton ${isActive ? 'active' : ''}" type="button">
                        ${isActive ? 'Enhanced View' : 'Standard View'}
                    </button>
                </li>`
            );

            const toggleButton = document.querySelector("#ActivateBetterOTRS");
            toggleButton.addEventListener("click", () => {
                const newState = !toggleButton.classList.contains('active');
                toggleButton.classList.toggle('active');
                toggleButton.textContent = newState ? 'Enhanced View' : 'Standard View';
                toggleView(!newState);
                localStorage.setItem("activateBetterOTRS", newState);
            });
        };

        // Initialize
        createWorkorderElements();
        setupToggleButton();
        toggleView(localStorage.getItem("activateBetterOTRS") !== "true");

        // Update tab title to include LT number (e.g., Change#LT1344)
        const updateTitle = () => {
            const headlineDiv = document.querySelector('.Headline');
            if (headlineDiv) {
                const h1Element = headlineDiv.querySelector('h1');
                if (h1Element) {
                    const originalTitle = h1Element.textContent.trim();
                    // Extract LT number (e.g., LT1344) from the title
                    const ltMatch = originalTitle.match(/LT\d+/);
                    if (ltMatch) {
                        document.title = `Change#${ltMatch[0]}`;
                    } else {
                        // Extract the first word string after the separator (—)
                        const titleParts = originalTitle.split(' — ');
                        const description = titleParts[1] || '';
                        const firstWordString = description.split(' ')[0] || 'Unknown';
                        document.title = `Change#${firstWordString}`;
                    }
                }
            }
        };
        const observer = new MutationObserver(updateTitle);
        observer.observe(document.body, { childList: true, subtree: true });
        updateTitle();

    } catch (e) {
        console.error("Fehler im Skript:", e);
    }
})();
