using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using System;
using System.Linq;

namespace MusicFestival.Backend
{
    public static class Extensions
    {
        // TODO: Remove when method exists in library!
        public static IEndpointConventionBuilder RequireCorsForNamespace<TBuilder>(this TBuilder builder, string endpointNamespace, string policyName) where TBuilder : IEndpointConventionBuilder
        {
            builder.Add(endpointBuilder =>
            {
                var metadata = endpointBuilder.Metadata;
                var metadataCount = metadata.Count;
                var controllerAction = metadata
                    .OfType<ControllerActionDescriptor>()
                    .FirstOrDefault(x => x.DisplayName.StartsWith(endpointNamespace, StringComparison.OrdinalIgnoreCase));

                if (controllerAction != null)
                {
                    for (var i = 0; i < metadataCount; i++)
                    {
                        if (metadata[i] is HttpMethodMetadata httpMethodMetadata)
                        {
                            metadata[i] = new HttpMethodMetadata(httpMethodMetadata.HttpMethods, acceptCorsPreflight: true);
                            break;
                        }
                    }

                    endpointBuilder.Metadata.Add(new EnableCorsAttribute(policyName));
                }
            });

            return builder;
        }
    }
}
