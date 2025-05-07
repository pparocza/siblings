class SiblingOption
{
    constructor(directory, title)
    {
        this.directory = directory;
        this.title = title;
    }
}

export const SIBLING_OPTIONS_ARRAY =
[
    new SiblingOption("Flaxen", "flaxen"),
    new SiblingOption("JustForYou", "just for you"),
    new SiblingOption("RollForHope", "roll for hope"),
    new SiblingOption("InkblotSentiment", "inkblot sentiment"),
    new SiblingOption("SalineAnatomy", "saline anatomy"),
    new SiblingOption("TargetEqualsBlank", "target equals blank")
]