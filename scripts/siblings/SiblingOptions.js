class SiblingOption
{
    constructor(folder, title)
    {
        this.folder = folder;
        this.title = title;
    }
}

export const SIBLING_OPTIONS_ARRAY =
[
    new SiblingOption("InkblotSentiment", "Inkblot Sentiment"),
    new SiblingOption("OneNote", "One Note"),
    new SiblingOption("RollingSine", "Rolling Sine"),
    new SiblingOption("SalineAnatomy", "Saline Anatomy")
]