namespace MusicFestival.Models.Blocks;

[ContentType(
    DisplayName = "Content Block",
    GUID = "ed70e2a6-1d80-4a51-9aa7-bb91609ccf1b",
    Description = "Generic content block with text and image")]
public class ContentBlock : BlockData
{
    [CultureSpecific]
    [Display(
        Name = "Title",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    public virtual string? Title { get; set; }

    [Display(
        Name = "Image",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    [UIHint(UIHint.Image)]
    public virtual Url? Image { get; set; }

    [Display(
        Name = "Image Alignment",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    [SelectOne(SelectionFactoryType = typeof(ImageAlignmentSelectionFactory))]
    [Required]
    public virtual string? ImageAlignment { get; set; }

    [CultureSpecific]
    [Display(
        Name = "Content",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    public virtual XhtmlString? Content { get; set; }
}

public class ImageAlignmentSelectionFactory : ISelectionFactory
{
    public IEnumerable<ISelectItem> GetSelections(ExtendedMetadata metadata)
    {
        return new ISelectItem[]
        {
            new SelectItem() { Text = "Left", Value = "Left" },
            new SelectItem() { Text = "Right", Value = "Right" }
        };
    }
}
