using System.Diagnostics;
using System.Net;
using Yarp.ReverseProxy.Forwarder;

namespace MusicFestival.NodeJsMiddleware;

/// <summary>
/// This class acts as a simple wrapper around the <see cref="IHttpForwarder"/>
/// from Yarp.ReverseProxy.
/// </summary>
internal class NodeJsForwarder
{
    private readonly IHttpForwarder _forwarder;
    private readonly NodeJsOptions _options;
    private readonly HttpMessageInvoker _httpClient;
    private readonly ForwarderRequestConfig _requestConfig;

    public NodeJsForwarder(
        IHttpForwarder forwarder,
        NodeJsOptions options)
    {
        _forwarder = forwarder;
        _options = options;

        _httpClient = new HttpMessageInvoker(new SocketsHttpHandler()
        {
            UseProxy = false,
            AllowAutoRedirect = false,
            AutomaticDecompression = DecompressionMethods.None,
            UseCookies = false,
            ActivityHeadersPropagator = new ReverseProxyPropagator(DistributedContextPropagator.Current)
        });

        _requestConfig = new ForwarderRequestConfig
        {
            ActivityTimeout = TimeSpan.FromSeconds(_options.ProxyTimeout)
        };
    }

    public virtual ValueTask<ForwarderError> ProxyRequest(HttpContext context)
        => _forwarder.SendAsync(context, _options.DestinationServer, _httpClient, _requestConfig, HttpTransformer.Default);
}
