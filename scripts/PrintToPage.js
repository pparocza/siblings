const PAGE_CONSOLE = document.querySelector('.PAGE_CONSOLE');

export function PRINT_TO_PAGE(string)
{
    console.log(string);
    let consoleLine = document.createElement("p");
    consoleLine.innerHTML = string;
    PAGE_CONSOLE.appendChild(consoleLine);
}