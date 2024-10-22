export class VisibleParameter
{
    constructor(parent, labelString = "param", value = 0)
    {
        let input = document.createElement("input");
        let label = document.createElement("label");
        input.value = value;
        label.innerHTML = labelString;
        parent.appendChild(label);
        label.appendChild(input);

        this.input = input;
    }

    get value()
    {
        return this.input.value;
    }
}