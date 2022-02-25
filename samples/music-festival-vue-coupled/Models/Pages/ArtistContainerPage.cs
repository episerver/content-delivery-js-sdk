namespace MusicFestival.Models.Pages;

[ContentType(
    DisplayName = "Artist Container Page",
    GUID = "0a5b7b88-d0ec-4a2a-83d4-13a66d6d581d",
    Description = "Container page for artists")]
[AvailableContentTypes
    (Availability.Specific,
    Include = new[]
    {
        typeof(ArtistDetailsPage)
    })]
public class ArtistContainerPage : BasePage
{ }
