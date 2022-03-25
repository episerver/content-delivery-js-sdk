using EPiServer.ContentApi.Core.Serialization;
using EPiServer.ContentApi.Core.Serialization.Internal;
using EPiServer.ContentApi.Core.Serialization.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Backend
{
    public class CustomHeaderContentApiFilter : ContentApiModelFilter<ContentApiModel>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomHeaderContentApiFilter(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public override void Filter(ContentApiModel contentApiModel, ConverterContext converterContext)
        {
            if (_httpContextAccessor.HttpContext.Request.Headers.ContainsKey("CustomHeaderName"))
            {
                contentApiModel.Properties.Add("customHeader", _httpContextAccessor.HttpContext.Request.Headers["CustomHeaderName"][0]);
            }
        }
    }
}