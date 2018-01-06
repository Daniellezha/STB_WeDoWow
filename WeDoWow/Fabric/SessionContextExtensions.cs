using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Linq;
using WeDoWow.Models;

namespace WeDoWow.Fabric
{
    public static class SessionContextExtensions
    {
        public static UserVisitContext CreateVisitContext(this HttpRequest request)
        {
            var userContext = new UserVisitContext();

            bool defaultLanguage;

            userContext.PreferredLanguages = GetLanguages(request, out defaultLanguage);
            userContext.DefaultPreferredLanguage = defaultLanguage;

            return userContext;
        }

        private static List<string> GetLanguages(HttpRequest request, out bool defaultLanguage)
        {
            defaultLanguage = false;

            List<string> languages;
            var languagesHeader = request.Headers["Accept-Language"];

            if (languagesHeader == StringValues.Empty)
            {
                //TODO: set default based on GeoIp'd region
                languages = GetDefaultLanuagePreference();
                defaultLanguage = true;
            }
            else
            {
                languages = ParseLanguageHeader(languagesHeader);

                if (!languages.Any())
                {
                    languages = GetDefaultLanuagePreference();
                    defaultLanguage = true;
                }
            }

            return languages;
        }

        private static List<string> ParseLanguageHeader(StringValues stringValues)
        {
            var stringified = stringValues.ToString().Replace(';', ',');

            return stringified.Split(',', System.StringSplitOptions.RemoveEmptyEntries)
                .Where(s => !s.Contains("="))
                .ToList();
        }

        private static List<string> GetDefaultLanuagePreference()
        {
            //TODO: set default based on GeoIp'd region
            return new List<string> { "fr-CA" };
        }
    }
}
