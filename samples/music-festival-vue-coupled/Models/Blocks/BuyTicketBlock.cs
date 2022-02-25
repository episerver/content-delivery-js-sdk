namespace MusicFestival.Models.Blocks;

[ContentType(
    DisplayName = "Buy Ticket Block",
    GUID = "ac096c4f-56ab-4396-9f5c-cfa923875c18",
    Description = "Allow visitors to buy a ticket",
    AvailableInEditMode = false)]
public class BuyTicketBlock : BlockData
{
    [CultureSpecific]
    [Required]
    public virtual string? Heading { get; set; }

    [CultureSpecific]
    [Required]
    public virtual string? Message { get; set; }
}
