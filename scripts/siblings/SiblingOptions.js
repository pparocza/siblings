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
    new SiblingOption("AssemblyExpression", "assembly expression"),
    new SiblingOption("Flaxen", "flaxen"),
    new SiblingOption("JustForYou", "just for you"),
    new SiblingOption("LivingInTheMouth", "living in the mouth"),
    new SiblingOption("RollForHope", "roll for hope"),
    /*
    new SiblingOption("InkblotSentiment", "inkblot sentiment"),
    new SiblingOption("SalineAnatomy", "saline anatomy"),
    */
    new SiblingOption("TargetEqualsBlank", "target equals blank"),
    new SiblingOption("Upcast", "upcast")
]