document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-dropdown');

    const dropdownButton = document.getElementById('dropdownNavbarLink');
    const dropdownMenu = document.getElementById('dropdownNavbar');

    const doubleDropdownButton = document.getElementById('doubleDropdownButton');
    const doubleDropdown = document.getElementById('doubleDropdown');

    // Function to toggle the navigation drawer
    function toggleDrawer() {
        const isOpen = !menu.classList.contains('hidden');

        if (isOpen) {
            // If menu is open, animate it closing
            menu.classList.remove('animate-zoom-in');
            setTimeout(() => {
                menu.classList.add('hidden');
            }, 300); // Delay to match the animation duration
        } else {
            // If menu is closed, animate it opening
            menu.classList.remove('hidden');
            menu.classList.add('animate-zoom-in');
        }
    }

    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    doubleDropdownButton.addEventListener('click', () => {
        doubleDropdown.classList.toggle('hidden');
    });

    button.addEventListener('click', function () {
        toggleDrawer();
    });
});
