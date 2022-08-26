using EPiServer.ContentDelivery.NodeProxy;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.AspNetCore.Builder;

/// <summary>
/// Extensions for <see cref="IEndpointRouteBuilder"/>.
/// </summary>
public static class NodeJsEndpointRouteBuilderExtensions
{
    /// <summary>
    /// Adds an endpoint that proxies incoming requests to a Node.js based
    /// webserver running on the same machine, which is fully controlled by
    /// this application scope
    /// </summary>
    /// <param name="endpoints">The <see cref="IEndpointRouteBuilder"/> to add the route to.</param>
    /// <returns>An <see cref="IEndpointRouteBuilder"/> that can be used to further customize the endpoint.</returns>
    public static IEndpointRouteBuilder MapNodeJs(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapFallback("{*path}", async context =>
        {
            var process = endpoints.ServiceProvider.GetRequiredService<NodeJsProcess>();
            var ready = await process.EnsureProcessStarted();

            if (ready)
            {
                var forwarder = endpoints.ServiceProvider.GetRequiredService<NodeJsForwarder>();
                await forwarder.ProxyRequest(context);
            }
        }).WithDisplayName("Node.js proxy");

        return endpoints;
    }
}
