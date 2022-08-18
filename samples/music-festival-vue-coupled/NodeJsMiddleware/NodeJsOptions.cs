using EPiServer.ServiceLocation;

namespace MusicFestival.NodeJsMiddleware;

[Options(ConfigurationSection = ConfigurationSectionConstants.Cms)]
public class NodeJsOptions
{
    /// <summary>
    /// Gets or sets the destination server where the requests
    /// should be proxied to.
    /// </summary>
    /// <remarks>
    /// Default is http://localhost:3080.
    /// </remarks>
    public string DestinationServer { get; set; } = "http://localhost:3080";

    /// <summary>
    /// Gets or sets the launch command.
    /// </summary>
    /// <remarks>
    /// Example: node ./server.js
    /// </remarks>
    public string LaunchCommand { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the working directory.
    /// </summary>
    /// <remarks>
    /// Example: ./clientApp/
    /// </remarks>
    public string WorkingDirectory { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets whether the output should be redirected
    /// or the process should open in a separate window.
    /// </summary>
    public bool RedirectOutput { get; set; }

    /// <summary>
    /// Gets or sets the timeout in seconds.
    /// </summary>
    /// <remarks>
    /// Default is 10 seconds.
    /// </remarks>
    public int ProxyTimeout { get; set; } = 10;

    /// <summary>
    /// Gets or sets whether the middleware should be disabled or not.
    /// </summary>
    public bool Disabled { get; set; }
}
