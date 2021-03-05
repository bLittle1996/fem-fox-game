import { ICONS } from "./constants";

const toggleHighlighted = (icon, shouldShow) =>
    document
        .querySelector(`.${ICONS[icon]}-icon`)
        .classList.toggle("highlighted", shouldShow);

export default function initButtons(handleUserAction) {
    let selectedIcon = 0;

    function buttonClick(event) {
        if (event.target.classList.contains("left-btn")) {
            toggleHighlighted(selectedIcon, false);
            selectedIcon = (2 + selectedIcon) % ICONS.length;
            toggleHighlighted(selectedIcon, true);
        } else if (event.target.classList.contains("right-btn")) {
            toggleHighlighted(selectedIcon, false);
            selectedIcon = (1 + selectedIcon) % ICONS.length;
            toggleHighlighted(selectedIcon, true);
        } else {
            handleUserAction(ICONS[selectedIcon]);
        }
    }

    document.querySelector(".buttons").addEventListener("click", buttonClick);
}
